# Changes

## 21.3.0 (2021-05-25)

* Support focus and blur methods, maintain document.activeElement.

## 21.2.8 (2021-05-10)

* Fix accessing ownerDocument in a custom element constructor.

## 21.2.7 (2021-05-10)

* Fix the declarative shadow dom support for custom elements II.

## 21.2.6 (2021-05-09)

* Recognise attributes without the equal sign.

## 21.2.5 (2021-05-09)

* Fix the declarative shadow dom support for custom elements.

## 21.2.4 (2021-05-09)

* Distribute the global module.

## 21.2.3 (2021-05-09)

* Add the rest of the exports to global

## 21.2.2 (2021-05-09)

* Make document fragment an event target.
* Make shadow dom an event target.
* Add element getters to document fragment.
* Add element getters to shadow dom.

## 21.2.1 (2021-05-09)

* Fix template element content.

## 21.2.0 (2021-05-09)

* Support the declarative Shadom DOM.

## 21.1.0 (2021-05-09)

* Support closed shadow root.
* Implement the experimental `getInnerHTML` method.
* Add the `host` property to shadowRoot.

## 21.0.0 (2021-05-08)

Add support for testing libraries manipulating DOM (JSX syntax, for example) and for testing [Web Components].

### Changes

* Add the [`classList`] property.
* Add the [`Event`] class and the [`EventTarget`] support to `Document` and `Element`.
* Add the [`setAttributeNS`] method.
* Isolate the storage for attributes from the element instance to allow reflecting properties to attributes using getters and setters and inherit default values from ancestor element classes.
* Add the [`attachShadow`] method and the [`ShadowRoot`] class for the [Shadow DOM] capability.
* Add the [`adoptedStyleSheets`] method and the [`CSSStylesheet`] class to support [constructible stylesheets].
* Add the method `setDOMFeatures` to disable or enable features like the [constructible stylesheets].
* Add the [`customElements`] object together with life-cycle members `connectedCallback`, `disconnectedCallback`, `observedAttributes` and `attributeChangedCallback`.
* Add the [`content`] property to the `template` element, utilise `HTMLTemplateElement`.
* Expose a `global` module to set the exported objects to the global namespace.

### BREAKING CHANGES

* The `class` attribute is not rendered in `outerHTML` in the order, which `setAttribute` was called. If a class is set, the `class` attribute is always rendered as the last one. Your tests may need to be adapted for this change.
* The `style` attribute is not rendered in `outerHTML` in the order, which `setAttribute` was called. If a style is set, the `style` attribute is always rendered as the last one, or before `class`, if a class is set. Your tests may need to be adapted for this change.
* Setting attributes does not automatically set a property on the element instance. If you depend on this in your tests, you will need to set the property in addition to calling `setAttribite`.

This is the first version released after forking the [original project].

[original project]: https://github.com/litejs/dom-lite
[Web Components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[`classList`]: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
[`Event`]: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
[`EventTarget`]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[`customElements`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements
[`setAttributeNS`]: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS
[`attachShadow`]: https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
[`ShadowRoot`]: https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot
[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[`content`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content
[`adoptedStyleSheets`]: https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets
[`CSSStylesheet`]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
[constructible stylesheets]: https://wicg.github.io/construct-stylesheets/
