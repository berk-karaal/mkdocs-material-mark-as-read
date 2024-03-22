from typing import List

from mkdocs.config.base import Config
from mkdocs.config.config_options import Type


class MarkAsReadConfig(Config):
    read_icon = Type(str, default="material-check")
    updated_icon = Type(str, default="material-update")

    include = Type(List, default=[])
    exclude = Type(List, default=[])
