---
mark_as_read:
    updated_at: 2024-03-24
---

# Plugin Configuration Reference

This page explains all available plugin configs that can be edited with `mkdocs.yml`.

## read_icon

**Default value:** `material-check`

Icon to show in the navigation for pages that marked as read.

!!! info "Values"

    You can select any icon (or emoji) available in your mkdocs-material setup. Check out
    [here](https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/#search) for icon names.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      read_icon: ok_hand
```

## updated_icon

**Default value:** `material-update`

Icon to show in the navigation for pages that have been updated after user marked as read.

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      updated_icon: fontawesome-solid-circle-exclamation
```

## include

**Default value:** `[]`

List of regex patterns to use mark-as-read plugin in pages without setting `mark_as_read` in page
meta.

Given regex patterns will be matched against the page's absolute path. If page's path matches any of
the regex patterns, the plugin will be enabled for that page.

Don't add `^` and `$` in the regex pattern, the plugin adds them and thus searches for full match.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      include:
        - /notes/.*
        - /tutorials/.*
```

## exclude

**Default value:** `[]`

List of regex patterns to activate the plugin in all pages except the ones that match any of the
given patterns.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      exclude:
        - /
        - /contact-us/ 
        - /blog/.*
```

## texts

Text configuration options can be used for localization or just to customize the text shown to user.

### mark_as_read

Default: `Mark as read`

Text of the button when user is not marked the page as read.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      texts:
        mark_as_read: Mark as completed
```

??? tip "Add icons or emojis to the text"

    You can also add icons or emojis to the text. Example
    ```yaml
    plugins:
      - mark-as-read:
        texts:
          mark_as_read: "Mark as read :white_check_mark:"
          mark_as_unread: "Mark as unread :material-restore:"
    ```


### mark_as_unread

Default: `Mark as unread`

Text of the button when user is marked the page as read.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      texts:
        mark_as_unread: Mark as incomplete
```

### read_tooltip

Default: `Read`

Tooltip of the icon in the navigation when user is marked the page as read.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      texts:
        read_tooltip: Completed
```

### updated_tooltip

Default: `Document updated`

Tooltip of the icon in the navigation when page is updated after user marked it as read.

Example:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read:
      texts:
        updated_tooltip: Updated
```

