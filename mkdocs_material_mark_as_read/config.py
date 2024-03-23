from typing import List

from mkdocs.config.base import Config
from mkdocs.config.config_options import SubConfig, Type


class _Texts(Config):
    mark_as_read = Type(str, default="Mark as read")
    mark_as_unread = Type(str, default="Mark as unread")
    read_tooltip = Type(str, default="Read")
    updated_tooltip = Type(str, default="Document updated")


class MarkAsReadConfig(Config):
    read_icon = Type(str, default="material-check")
    updated_icon = Type(str, default="material-update")

    include = Type(List, default=[])
    exclude = Type(List, default=[])

    texts = SubConfig(_Texts)
