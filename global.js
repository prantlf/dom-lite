var DOM = require(".")

global.document = DOM.document
global.Node = DOM.Node
global.Element = global.HTMLElement = DOM.HTMLElement
global.DocumentFragment = DOM.DocumentFragment
global.Document = DOM.Document
global.CSSStyleSheet = DOM.CSSStyleSheet
global.setDOMFeatures = DOM.setDOMFeatures

module.exports = DOM
