# toctoctoc

is a tiny script that parses all headlines on a page and creates a table of contents from it.

I've written this for use on a [Jekyll](https://wwww.jekyllrb.com) site, but there is nothing Jekyll-specific about it.

There's also [ghiculescu/jekyll-table-of-contents](https://github.com/ghiculescu/jekyll-table-of-contents); it didn't quite fit my needs, but it might fit yours.

This script has three advantages:

1. it has no dependencies

   jekyll-table-of-contents depends on jQuery, which I do not use

2. it automatically assigns IDs to headlines, if necessary, to make them linkable

3. its markup is a bit easier to customize

## Usage

```html
<div id="my-toc-container"></div>
```

```js
document.addEventListener('DOMContentLoaded', () => {
  // basic
  new Toctoctoc({ elem: document.querySelector("#my-toc-container") });

  // with options
  new Toctoctoc({
    elem: document.querySelector("#my-toc-container"),
    // limit the part of the document in which we look for headlines
    scope: document.querySelector("body > main"),
    // custom selector for headlines
    headlineSelector: "h2, h3, h4, h5, h6, h7, h8"
  });
});
```

## Markup

By default, we render a simple unordered list:

```html
<ul class="toc">
  <li><a href="#headline-0">Headline</a></li>
  <li>
    <ul class="toc">
      <li><a href="#headline-1">Second headline</a></li>
    </ul>
  </li>
</ul>
```

If you need something different, you can do so via three callbacks:

1. `renderListCallback` provides the list - by default the `<ul class="toc">`
2. `renderListItemCallback` provides the item wrapper - by default the `<li>`
2. `renderListEntryCallback` provides the item itself - by default the `<a>`

## `renderListCallback({ callback, indentationLevel })`

renderListCallback must return a list node. It must also call the provided callback with a DOM node in which the list items are to be inserted, which is not necessarily the same. Consider this example in which we wrap the `<ul>` in a `<div>` - but only the first, outer one:

```js
new Toctoctoc({
  elem: document.querySelector("#my-toc-container"),
  renderListCallback: ({ callback, indentationLevel }) => {
    if (indentationLevel === 1) {
      const div  = document.createElement("div"),
            list = document.createElement("ul");

      div.appendChild(list);

      callback(list);

      return div;

    } else {
      const list = document.createElement("ul");

      callback(list);

      return list;
    }
  }
});
````

## `renderListItemCallback()`

renderListItemCallback must simply return a list item node:

```js
new Toctoctoc({
  elem: document.querySelector("#my-toc-container"),
  renderListItemCallback: () => {
    const item = document.createElement("li");

    item.classList.add("foo");

    return item;
  }
});
```

## `renderListEntryCallback(headlineDOMNode)`

renderListEntryCallback receives the current headline node and must simply return the content of the list item:

```js
new Toctoctoc({
  elem: document.querySelector("#my-toc-container"),
  renderListEntryCallback: (headline) => {
    const a = document.createElement("a");

    a.href        = `#${elem.id}`;
    a.textContent = elem.textContent;

    return a;
  }
});
```

## License

toctoctoc is licensed under the [EUPL v1.2](https://joinup.ec.europa.eu/sites/default/files/custom-page/attachment/2020-03/EUPL-1.2%20EN.txt)
