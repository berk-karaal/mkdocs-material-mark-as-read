---
mark_as_read:
    updated_at: 2024-03-24
---

# Customizing Button Style

You can customize the style of "Mark as read" button with css.

In the `overrides/partials/mark-as-read-button.html` you created, instead of importing the css file
comes with the plugin, you can write your own css classes and use them in the button.

Example:

```jinja title="overrides/partials/mark-as-read-button.html"
{% if page.meta and "mark_as_read" in page.meta%}
    <style>
        .mark-as-read-button {
            background-color: #4CAF50;
            border: none;
            border-radius: 99px;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    </style>
    <button class="mark-as-read-button" onclick="markAsReadButtonOnClick()"></button>
    <script src="/js/mark-as-read-button.js"></script>
{% endif %}
```

!!! warning

    Make sure to keep the `mark-as-read-button` class in the button even it's empty.
    `mark-as-read-button` class is used for finding the button in the js scripts.