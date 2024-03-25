---
mark_as_read:
    updated_at: 2024-03-24
---

# Quickstart

This guide will help you to add mark as read feature to your mkdocs-material project.

## 1. Install Plugin

First install the plugin with `pip install mkdocs-material-mark-as-read`

Then add plugin to `mkdocs.yml`:

```yaml title="mkdocs.yml"
plugins:
  - mark-as-read
```

This plugin uses `attr_list` and `pymdownx.emoji` markdown extensions so make sure they are enabled:

```yaml title="mkdocs.yml"
markdown_extensions:
  - attr_list
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
```

!!! info "Set `site_url` config"

    If your website is not hosted on the root of the domain, you must set `site_url` in `mkdocs.yml`.
    Example for GitHub Pages:

    ```yaml title="mkdocs.yml"
    site_url: https://username.github.io/repo-name
    ```

## 2. Add "Mark as read" Button to Pages

To show a button at the end of the pages you should extend `content.html` template. Follow these
steps:

1. Add `custom_dir: overrides` under theme in `mkdocs.yml`:
    ```yaml title="mkdocs.yml" hl_lines="3"
    theme:
      name: material
      custom_dir: overrides
    ```
2. Create `overrides/` directory in the root of the project
   
3. Create `overrides/partials/mark-as-read-button.html` and copy paste the following content:
    
    ```jinja title="overrides/partials/mark-as-read-button.html"
    {% if page.meta and "mark_as_read" in page.meta %}
        <link rel="stylesheet" href="{{config.site_url}}css/mark-as-read-button.css">
        <button class="mark-as-read-button" onclick="markAsReadButtonOnClick()"></button>
        <script src="{{config.site_url}}js/mark-as-read-button.js"></script>
    {% endif %}
    ```
    
    > This template will show "Mark as Read" button if page is configured to use mark as read
    > feature. You can also customize this button easily, check out [here](../customization/button-style/index.md).

4. Copy [`content.html`
   file](https://github.com/squidfunk/mkdocs-material/blob/master/material/templates/partials/content.html)
   from mkdocs-material to `overrides/partials` folder and add highlighted line to it:

    > Since you are overriding content.html template, you should keep it up to date with the
    > original one when mkdocs-material updates.

    ```jinja title="overrides/partials/content.html" hl_lines="12"
    {% if "material/tags" in config.plugins and tags %}
    {% include "partials/tags.html" %}
    {% endif %}
    {% include "partials/actions.html" %}
    {% if "\x3ch1" not in page.content %}
    <h1>{{ page.title | d(config.site_name, true)}}</h1>
    {% endif %}
    {{ page.content }}
    {% include "partials/source-file.html" %}
    {% include "partials/feedback.html" %}

    {% include "partials/mark-as-read-button.html" %}

    {% include "partials/comments.html" %}
    ```

## 3. Use Plugin on Pages

Add `mark_as_read` meta to the pages you want users to be able to mark as read. You can add this
meta to the top of the page like this:

```hl_lines="2 3"
---
mark_as_read:
    updated_at: 2024-03-24 17:00:00+03:00
---

# Page title

Your wonderful content
```

You should set `updated_at` field in date or datetime format. This field is used to inform user if
the page is updated after the user marked it as read. 


!!! tip "Tip: Setting up for lots of pages"

    If you **already have** lots of pages and don't want to add this meta to each of them, you can set
    regexes to activate plugin on pages. Check out [include](../config-reference/index.md#include) and
    [exclude](../config-reference/index.md#exclude) docs.

:tada: Congratulations, plugin is all set! Now you should see "Mark as read" button at the end of
the pages.