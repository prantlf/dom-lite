var DOM = require(".")

global.document = DOM.document
global.Document = DOM.Document
global.Node = DOM.Node
global.Element = global.HTMLElement = DOM.HTMLElement
global.HTMLTemplateElement = DOM.HTMLTemplateElement
global.DocumentFragment = DOM.DocumentFragment
global.ShadowRoot = DOM.ShadowRoot
global.Document = DOM.Document
global.CSSStyleSheet = DOM.CSSStyleSheet
global.customElements = DOM.customElements
global.Event = global.CustomEvent = DOM.Event
global.setDOMFeatures = DOM.setDOMFeatures

module.exports = DOM
