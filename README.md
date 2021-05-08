# @prantlf/dom-lite

[![NPM version](https://badge.fury.io/js/%40prantlf%2Fdom-lite.svg)](http://badge.fury.io/js/%40prantlf%2Fdom-lite)
[![Build Status](https://github.com/prantlf/dom-lite/workflows/Test/badge.svg)](https://github.com/prantlf/dom-lite/actions)
[![Dependency Status](https://david-dm.org/prantlf/dom-lite.svg)](https://david-dm.org/prantlf/dom-lite)
[![devDependency Status](https://david-dm.org/prantlf/dom-lite/dev-status.svg)](https://david-dm.org/prantlf/dom-lite#info=devDependencies)

A small [DOM] implementation, where most of attributes and methods including [selectors] from elements and document are implemented.

This fork enhances the original project with a support for testing libraries manipulating DOM (JSX syntax, for example) and for testing [Web Components]:

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

## Synopsis

```js
var document = require("@prantlf/dom-lite").document;

var el = document.createElement("h1");
el.id = "123";
el.className = "large";

var fragment = document.createDocumentFragment();
var text1 = document.createTextNode("hello");
var text2 = document.createTextNode(" world");

fragment.appendChild(text1);
fragment.appendChild(text2);
el.appendChild(fragment);

el.innerHTML;
// hello world
el.innerHTML = "<b>hello world</b>"
el.outerHTML;
// <h1 id="123" class="large"><b>hello world</b></h1>
el.querySelectorAll("b");
// [ "<b>hello world</b>" ]
```

## Contributing

In lieu of a [formal styleguide], take care to maintain the existing coding style. Lint and test your code.

How to clone this repository, install development dependencies and run tests:

```sh
git clone https://github.com/prantlf/dom-lite.git
cd dom-lite
pnpm i # you can use npm or yarn too
npm test
```

## Licence

Copyright (c) 2014-2021 Lauri Rooden &lt;lauri@rooden.ee&gt;<br>
Copyright (c) 2021 Ferdinand Prantl &lt;prantlf@gmail.com&gt;

[DOM]: https://dom.spec.whatwg.org/
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
[formal styleguide]: https://github.com/litejs/litejs/wiki/Style-Guidelines
