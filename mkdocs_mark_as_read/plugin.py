import json
import os
from datetime import date, datetime
from typing import Any, Dict, Union

from mkdocs.config.defaults import MkDocsConfig
from mkdocs.plugins import BasePlugin, get_plugin_logger
from mkdocs.structure.files import Files
from mkdocs.structure.pages import Page
from mkdocs.utils import copy_file, write_file

from mkdocs_mark_as_read.config import MarkAsReadConfig

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
        config["extra_javascript"].append("js/navlink-updater.js")
        config["extra_css"].append("css/navlink-updater.css")

        return config

    def on_page_markdown(
        self, markdown: str, *, page: Page, config: MkDocsConfig, files: Files
    ) -> Union[str, None]:
        """`page.meta` is available at this point."""

        # Store the update date of the page if it uses or should use mark_as_read
        if isinstance(page.abs_url, str):
            page_updated_at = self.get_page_updated_at_from_meta(page)
            if page_updated_at is not None:
                self.pages_updated_at[page.abs_url] = page_updated_at

        # import icons to page
        markdown += (
            f"\n\n:{self.config['read_icon']}:{{.mark-as-read-display-none .mark-as-read-icon #mark-as-read-read-icon title='Read'}}"
            f"\n:{self.config['updated_icon']}:{{.mark-as-read-display-none .mark-as-read-icon #mark-as-read-updated-icon title='Read but updated'}}"
        )

        return markdown

    def on_post_build(self, *, config: MkDocsConfig) -> None:
        """After build complete, add necessary static files to the site directory."""
        files = [
            "js/mark-as-read-button.js",
            "css/mark-as-read-button.css",
            "js/navlink-updater.js",
            "css/navlink-updater.css",
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
            for d in page.meta[PLUGIN_META_NAME]:
                if "updated_at" not in d:
                    continue

                page_updated_at: Any = d["updated_at"]
                if isinstance(page_updated_at, date) or isinstance(page_updated_at, datetime):
                    return page_updated_at.isoformat()
                else:
                    log.error(
                        f"Page '{page.title}' has an invalid 'updated_at' field under its {PLUGIN_META_NAME} meta. "
                        f"Expected date or datetime, got {type(page_updated_at)}."
                    )
                break
            else:
                log.error(
                    f"Page '{page.title}' has no 'updated_at' field under its {PLUGIN_META_NAME} meta. "
                    "This page will not be marked as read in navigation sections."
                )

        return None
