import os

from mkdocs.config.defaults import MkDocsConfig
from mkdocs.plugins import BasePlugin, get_plugin_logger
from mkdocs.utils import copy_file

from mkdocs_mark_as_read.config import MarkAsReadConfig

log = get_plugin_logger(__name__)

PLUGIN_PATH = os.path.dirname(os.path.abspath(__file__))


class MarkAsReadPlugin(BasePlugin[MarkAsReadConfig]):
    def on_post_build(self, *, config: MkDocsConfig) -> None:
        """After build complete, add necessary static files to the site directory."""
        files = [
            "js/mark-as-read-button.js",
            "css/mark-as-read-button.css",
        ]
        for file in files:
            dest_file_path = os.path.join(config["site_dir"], file)
            src_file_path = os.path.join(PLUGIN_PATH, file)
            assert os.path.exists(src_file_path)
            copy_file(src_file_path, dest_file_path)
