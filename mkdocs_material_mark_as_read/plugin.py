import json
import os
import re
from datetime import date, datetime
from inspect import cleandoc
from typing import Any, Dict, Union

from mkdocs.config.defaults import MkDocsConfig
from mkdocs.plugins import BasePlugin, get_plugin_logger
from mkdocs.structure.files import Files
from mkdocs.structure.pages import Page
from mkdocs.utils import copy_file, write_file

from mkdocs_material_mark_as_read.config import MarkAsReadConfig

log = get_plugin_logger(__name__)

PLUGIN_PATH = os.path.dirname(os.path.abspath(__file__))
PLUGIN_META_NAME = "mark_as_read"


class MarkAsReadPlugin(BasePlugin[MarkAsReadConfig]):
    def __init__(self) -> None:
        # Update date of pages that use mark_as_read.
        self.pages_updated_at: Dict[str, str] = {}
        # example: {"/page/path/": "2024-03-21", "/another/page/path/": "2024-01-01T12:00:00Z"}

    def on_config(self, config: MkDocsConfig) -> Union[MkDocsConfig, None]:
        # add navlink-updater.js to every page
        config["extra_javascript"].append("js/mark-as-read-navlink-updater.js")
        return config

    def on_page_markdown(
        self, markdown: str, *, page: Page, config: MkDocsConfig, files: Files
    ) -> Union[str, None]:
        """`page.meta` is available at this point."""

        updated_at = self.get_page_updated_at(page)
        if updated_at is not None:
            self.pages_updated_at[page.abs_url] = updated_at  # type: ignore

            # Make sure plugin meta is included to page. Existance of this meta makes "Mark as read"
            # button displayed. Pages which use this plugin via 'include' or 'exclude' config
            # don't have this meta, adding here to show button on these pages as well.
            if PLUGIN_META_NAME not in page.meta:
                page.meta[PLUGIN_META_NAME] = []

        display_none_style = "style='display: none !important;'"

        # put icons and texts to page. JS code will get them by their IDs and use when needed.
        assets = cleandoc(
            f"""
            :{self.config['read_icon']}:{{.mark-as-read-icon #mark-as-read-read-icon title='{self.config['texts']['read_tooltip']}'}}
            :{self.config['updated_icon']}:{{.mark-as-read-icon #mark-as-read-updated-icon title='{self.config['texts']['updated_tooltip']}'}}
            {{ {display_none_style} }}

            {self.config['texts']['mark_as_read']}
            {{#mark-as-read-text-mark-as-read {display_none_style} data-search-exclude}}

            {self.config['texts']['mark_as_unread']}
            {{#mark-as-read-text-mark-as-unread {display_none_style} data-search-exclude}}

            {config.site_url}
            {{#mark-as-read-config-site-url {display_none_style} data-search-exclude}}
            """
        )
        markdown += "\n\n" + assets

        return markdown

    def on_post_build(self, *, config: MkDocsConfig) -> None:
        """After build complete, add necessary static files to the site directory."""
        files = [
            "js/mark-as-read-button.js",
            "css/mark-as-read-button.css",
            "js/mark-as-read-navlink-updater.js",
        ]
        for file in files:
            dest_file_path = os.path.join(config["site_dir"], file)
            src_file_path = os.path.join(PLUGIN_PATH, file)
            assert os.path.exists(src_file_path)
            copy_file(src_file_path, dest_file_path)

        # Add captured "page update date" data to the site directory and make it available to read
        # by client-side scripts.
        write_file(
            json.dumps(self.pages_updated_at).encode(),
            os.path.join(config["site_dir"], "mark-as-read/pages-updated-at.json"),
        )

    def get_page_updated_at_from_meta(self, page: Page) -> Union[str, None]:
        """Return the update date of the given page if it is declareed under mark_as_read meta,
        otherwise return None.
        """
        if PLUGIN_META_NAME in page.meta and page.abs_url:
            if "updated_at" in page.meta[PLUGIN_META_NAME]:
                page_updated_at: Any = page.meta[PLUGIN_META_NAME]["updated_at"]
                if isinstance(page_updated_at, date) or isinstance(page_updated_at, datetime):
                    return page_updated_at.isoformat()
                else:
                    log.error(
                        f"Page '{page.title}' has an invalid 'updated_at' field under its {PLUGIN_META_NAME} meta. "
                        f"Expected date or datetime, got {type(page_updated_at)}."
                    )
            else:
                log.error(
                    f"Page '{page.title}' has no 'updated_at' field under its {PLUGIN_META_NAME} meta. "
                    "This page will not be marked as read in navigation sections."
                )

        return None

    def get_page_updated_at(self, page: Page) -> Union[str, None]:
        """Return the update date if the given page contains mark_as_read meta or is included via
        config, otherwise or if excluded via config return None.

        Update date can be returned as "0" which is also valid date string in JS. This value is
        returned when page doesn't have an update date in its meta but is included via `include` or
        not excluded via 'exclude' configs in mkdocs.yml.
        """
        if not isinstance(page.abs_url, str):
            return None

        updated_at = self.get_page_updated_at_from_meta(page)
        if updated_at is not None:
            return updated_at

        for include_regex in self.config["include"]:
            if re.search(f"^{include_regex}$", page.abs_url):
                return "0"

        for exclude_regex in self.config["exclude"]:
            if re.search(f"^{exclude_regex}$", page.abs_url):
                return None

        if self.config["include"]:
            return None

        if self.config["exclude"]:
            return "0"

        return None
