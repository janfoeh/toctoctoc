// Copyright Jan-Christian Föh <jan@programmanstalt.de>
// Licensed under the EUPL v1.2

(function() {
  "use strict";

  class Toctoctoc {
    elem;
    scope;
    headlineSelector;

    renderListCallback;
    renderListItemCallback;
    renderListEntryCallback;

    #listInsertionTargets = [];

    constructor({ elem, scope = document.body,
                  headlineSelector = "h1, h2, h3, h4, h5, h6, h7, h8",
                  renderListCallback = null, renderListItemCallback = null,
                  renderListEntryCallback = null }) {
      this.elem                    = elem;
      this.scope                   = scope;
      this.headlineSelector        = headlineSelector;
      this.renderListCallback      = renderListCallback;
      this.renderListItemCallback  = renderListItemCallback;
      this.renderListEntryCallback = renderListEntryCallback;

      this.#setup();
    }

    #setup() {
      const headlines =
              this.scope
                  .querySelectorAll(this.headlineSelector);

      let currentIndentationLevel,
          currentListItem;

      if (headlines.length === 0)
        return;

      this.#addList();

      [...headlines].forEach((headline, idx) => {
        let nextIndentationLevel =
              parseInt(headline.nodeName.replace("H",""), 10);

        if (!currentIndentationLevel)
          currentIndentationLevel = nextIndentationLevel;

        if (!headline.id)
          headline.id = `headline-${idx}`;

        if (nextIndentationLevel > currentIndentationLevel) {
          // We might not yet have one if this is the very first
          // item rendered
          if (!currentListItem)
            currentListItem = this.#addListItem();

          this.#addList({
            indentationLevel: nextIndentationLevel,
            renderAt: currentListItem
          });

        } else if (nextIndentationLevel < currentIndentationLevel) {
          const difference =
                  nextIndentationLevel - currentIndentationLevel;

          this.#listInsertionTargets =
            this.#listInsertionTargets.slice(0, difference);
        }

        currentIndentationLevel = nextIndentationLevel;
        currentListItem         = this.#addListItem();

        currentListItem.appendChild(this.#renderEntry(headline));
      });
    }

    get #currentListInsertionTarget() {
      return this.#listInsertionTargets[this.#listInsertionTargets.length - 1];
    }

    #renderList({ callback, indentationLevel = 0 } = {}) {
      if (!!this.renderListCallback) {
        return  this.renderListCallback({
                  callback: callback,
                  indentationLevel: indentationLevel
                });
      }

      const ul =
              document.createElement("ul");

      ul.classList.add("toc");

      callback(ul);

      return ul;
    }

    #addList({ renderAt = this.elem, indentationLevel = 0 } = {}) {
      let insertionTarget;

      const targetProviderCallback =
              (target) => insertionTarget = target,
            list =
              this.#renderList({
                callback: targetProviderCallback,
                indentationLevel: indentationLevel
              });

      this.#listInsertionTargets.push(insertionTarget);

      renderAt.appendChild(list);

      return list;
    }

    #renderListItem() {
      if (!!this.renderListItemCallback) {
        return this.renderListItemCallback();

      } else {
        return document.createElement("li");
      }
    }

    #addListItem() {
      const listItem =
              this.#renderListItem();

      this.#currentListInsertionTarget
          .appendChild(listItem);

      return listItem;
    }

    #renderEntry(elem) {
      if (!!this.renderListEntryCallback) {
        return this.renderListEntryCallback(elem);

      } else {
        const a = document.createElement("a");

        a.href        = `#${elem.id}`;
        a.textContent = elem.textContent;

        return a;
      }
    }
  }

  window.Toctoctoc = Toctoctoc;
})();
