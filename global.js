var DOM = require(".")

global.document = DOM.document
global.Node = DOM.Node
global.Element = global.HTMLElement = DOM.HTMLElement
global.DocumentFragment = DOM.DocumentFragment
global.Document = DOM.Document

module.exports = DOM
