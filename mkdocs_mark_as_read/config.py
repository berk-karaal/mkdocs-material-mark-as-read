from mkdocs.config.base import Config
from mkdocs.config.config_options import Type


class MarkAsReadConfig(Config):
    read_icon = Type(str, default="material-check")
    updated_icon = Type(str, default="material-update")
