

/**
 * @version    0.5.1
 * @date       2016-07-26
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */


// Void elements: http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
var voidElements = {
	AREA:1, BASE:1, BR:1, COL:1, EMBED:1, HR:1, IMG:1, INPUT:1,
	KEYGEN:1, LINK:1, MENUITEM:1, META:1, PARAM:1, SOURCE:1, TRACK:1, WBR:1
}
, hasOwn = voidElements.hasOwnProperty
, selector = require("selector-lite")
, elementGetters = {
	getElementById: function(id) {
		return selector.find(this, "#" + id, 1)
	},
	getElementsByTagName: function(tag) {
		return selector.find(this, tag)
	},
	getElementsByClassName: function(sel) {
		return selector.find(this, "." + sel.replace(/\s+/g, "."))
	},
	querySelector: function(sel) {
		return selector.find(this, sel, 1)
	},
	querySelectorAll: function(sel) {
		return selector.find(this, sel)
	}
}
, Node = {
	ELEMENT_NODE:                1,
	TEXT_NODE:                   3,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE:                8,
	DOCUMENT_NODE:               9,
	DOCUMENT_TYPE_NODE:         10,
	DOCUMENT_FRAGMENT_NODE:     11,
	nodeName:        null,
	parentNode:      null,
	ownerDocument:   null,
	childNodes:      null,
	get nodeValue() {
		return this.nodeType === 3 || this.nodeType === 8 ? this.data : null
	},
	set nodeValue(text) {
		return this.nodeType === 3 || this.nodeType === 8 ? (this.data = text) : null
	},
	get textContent() {
		return this.hasChildNodes() ? this.childNodes.map(function(child) {
			return child[ child.nodeType == 3 ? "data" : "textContent" ]
		}).join("") : this.nodeType === 3 ? this.data : ""
	},
	set textContent(text) {
		if (this.nodeType === 3) return (this.data = text)
		for (var node = this; node.firstChild;) node.removeChild(node.firstChild)
		node.appendChild(node.ownerDocument.createTextNode(text))
	},
	get firstChild() {
		return this.childNodes && this.childNodes[0] || null
	},
	get lastChild() {
		return this.childNodes && this.childNodes[ this.childNodes.length - 1 ] || null
	},
	get previousSibling() {
		return getSibling(this, -1)
	},
	get nextSibling() {
		return getSibling(this, 1)
	},
	// innerHTML and outerHTML should be extensions to the Element interface
	get innerHTML() {
		return Node.toString.call(this)
	},
	set innerHTML(html) {
		var match, child
		, node = this
		, doc = node.ownerDocument || node
		, tagRe = /<(!--([\s\S]*?)--|!\[[\s\S]*?\]|[?!][\s\S]*?)>|<(\/?)([^ \/>]+)([^>]*?)(\/?)>|[^<]+/g
		, attrRe = /([^= ]+)\s*=\s*(?:("|')((?:\\\2|.)*?)\2|(\S+))/g

		for (; node.firstChild; ) node.removeChild(node.firstChild)

		for (; (match = tagRe.exec(html)); ) {
			if (match[3]) {
				node = node.parentNode
			} else if (match[4]) {
				child = doc.createElement(match[4])
				if (match[5]) {
					match[5].replace(attrRe, setAttr)
				}
				node.appendChild(child)
				if (!voidElements[child.tagName] && !match[6]) node = child
			} else if (match[2]) {
				node.appendChild(doc.createComment(htmlUnescape(match[2])))
			} else if (match[1]) {
				node.appendChild(doc.createDocumentType(match[1]))
			} else {
				node.appendChild(doc.createTextNode(htmlUnescape(match[0])))
			}
		}

		return html

		function setAttr(_, name, q, a, b) {
			child.setAttribute(name, htmlUnescape(a || b || ""))
		}
	},
	get outerHTML() {
		return this.toString()
	},
	set outerHTML(html) {
		var frag = this.ownerDocument.createDocumentFragment()
		frag.innerHTML = html
		this.parentNode.replaceChild(frag, this)
		return html
	},
	get htmlFor() {
		return this["for"]
	},
	set htmlFor(value) {
		this["for"] = value
	},
	get className() {
		return this["class"] || ""
	},
	set className(value) {
		this["class"] = value
	},
	get style() {
		return this.styleMap || (this.styleMap = new StyleMap())
	},
	set style(value) {
		this.styleMap = new StyleMap(value)
	},
	hasChildNodes: function() {
		return this.childNodes && this.childNodes.length > 0
	},
	appendChild: function(el) {
		return this.insertBefore(el)
	},
	insertBefore: function(el, ref) {
		var node = this
		, childs = node.childNodes

		if (el.nodeType == 11) {
			while (el.firstChild) node.insertBefore(el.firstChild, ref)
		} else {
			if (el.parentNode) el.parentNode.removeChild(el)
			el.parentNode = node

			// If ref is null, insert el at the end of the list of children.
			childs.splice(ref ? childs.indexOf(ref) : childs.length, 0, el)
			// TODO:2015-07-24:lauri:update document.body and document.documentElement
		}
		return el
	},
	removeChild: function(el) {
		var node = this
		, index = node.childNodes.indexOf(el)
		if (index == -1) throw Error("NOT_FOUND_ERR")

		node.childNodes.splice(index, 1)
		el.parentNode = null
		return el
	},
	replaceChild: function(el, ref) {
		this.insertBefore(el, ref)
		return this.removeChild(ref)
	},
	cloneNode: function(deep) {
		var key
		, node = this
		, clone = new node.constructor(node.tagName || node.data)
		clone.ownerDocument = node.ownerDocument

		if (node.hasAttribute) {
			for (key in node) if (node.hasAttribute(key)) clone[key] = node[key].valueOf()
		}

		if (deep && node.hasChildNodes()) {
			node.childNodes.forEach(function(child) {
				clone.appendChild(child.cloneNode(deep))
			})
		}
		return clone
	},
	toString: function() {
		return this.hasChildNodes() ? this.childNodes.reduce(function(memo, node) {
			return memo + node
		}, "") : ""
	}
}
, EventTarget = {
	// Event listeners are stored in arrays organised by their types in an object.
	// el.eventListeners = {
	//   click: [
	//       { target, handler, useCapture }
	//       { target, handler, useCapture }
	//       ...
	//     ]
	//   ...
	// }
	dispatchEvent: function(event) {
		event.target = this

		var path = event.composedPath()
		path.shift() // the event on the target node will lbe triggered explicitly

		var reversePath = path.reverse()
		event.eventPhase = Event.CAPTURING_PHASE
		for (var i = 0, l = reversePath.length; i < l; ++i) {
			if (callEventHandlers(reversePath[i], event, true)) return result()
		}

		event.eventPhase = Event.AT_TARGET
		if (callEventHandlers(this, event)) return result()

		if (event.bubbles) {
			event.eventPhase = Event.BUBBLING_PHASE
			for (i = 0, l = path.length; i < l; ++i) {
				if (callEventHandlers(path[i], event, false)) return result()
			}
		}

		return result()

		function result() {
			return !(event.cancelable && event.defaultPrevented)
		}
	},
	addEventListener: function(type, handler, useCapture) {
		var event = normalizeEvent(type, useCapture)
		var eventListeners = getEventListeners(this, event.type)
		var eventListener = {
			target: this,
			handler: handler,
			useCapture: event.useCapture
		}
		eventListeners.push(eventListener)
	},
	removeEventListener: function(type, handler, useCapture) {
		var event = normalizeEvent(type, useCapture)
		var eventListeners = getEventListeners(this, event.type)
		var index = eventListeners.findIndex(function(listener) {
			return handler === listener.handler && event.useCapture === listener.useCapture
		})
		if (index >= 0) eventListeners.splice(index, 1)
	}
}



function now() {
	var time = process.hrtime()
	return time[0] * 1e3 + time[1] / 1e6
}

 // calls event handlers registered for the specific event on the specified
// element and returns true if the bubbling was cancelled by a handler
function callEventHandlers(el, event, useCapture) {
	var eventListeners = getEventListeners(el, event.type)
	for (var i = 0, l = eventListeners.length; i < l; ++i) {
		var eventListener = eventListeners[i]
		// call the handler if it is the target or if useCapture matches
		if (useCapture === undefined || useCapture === eventListener.useCapture) {
			event.currentTarget = el
			eventListener.handler(event)
			if (event.cancelImmediate) return true
		}
	}
	if (event.cancelBubble) return true
}

// ensures a lower-case event type and a boolean useCapture
function normalizeEvent(type, useCapture) {
	type = type.toLowerCase()
	useCapture = useCapture || false
	var event = { type: type, useCapture: useCapture }
	return event
}

// gets an array of event listeners for the specified event type
function getEventListeners(el, type) {
	var allListeners = el.eventListeners || (el.eventListeners = {})
	return allListeners[type] || (allListeners[type] = [])
}

function Event(type, options) {
	if (!type) throw new TypeError("type not specified")
	this.type = type.toLowerCase()
	this.timeStamp = now()
	Object.assign(this, options)
}

Object.assign(Event, {
	NONE: 0,
	CAPTURING_PHASE: 1,
	AT_TARGET: 2,
	BUBBLING_PHASE: 3
})

Object.assign(Event.prototype, {
	isTrusted: false,
	bubbles: false,
	cancelable: false,
	composed: false,
	defaultPrevented: false,
	cancelBubble: false,
	cancelImmediate: false,
	eventPhase: Event.NONE,
	preventDefault: function() {
		this.defaultPrevented = true
	},
	stopPropagation: function() {
		this.cancelBubble = true
	},
	stopImmediatePropagation: function() {
		this.cancelImmediate = true
	},
	composedPath: function() {
		var el = this.target
		var path = [el]
		while ((el = el.parentNode)) {
			var shadowRoot = el.shadowRoot
			if (shadowRoot) {
				// if the event is not composed and an ancestor of the target element
				// has a shadow dom, cut the path to start with the custom element
				if (!this.composed || shadowRoot.mode === "closed") path = [el]
				else path.push(shadowRoot, el)
			} else {
				path.push(el)
			}
		}
		return path
	}
})



function extendNode(obj, extras) {
	obj.prototype = Object.create(Node)
	for (var descriptor, key, i = 1; (extras = arguments[i++]); ) {
		for (key in extras) {
			descriptor = Object.getOwnPropertyDescriptor(extras, key)
			Object.defineProperty(obj.prototype, key, descriptor)
		}
	}
	obj.prototype.constructor = obj
}

function camelCase(str) {
	return str.replace(/[ _-]+([a-z])/g, function(_, a) { return a.toUpperCase() })
}

function hyphenCase(str) {
	return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function htmlEscape(str) {
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function htmlUnescape(str) {
	return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&")
}

function StyleMap(style) {
	var styleMap = this
	if (style) style.split(/\s*;\s*/g).map(function(val) {
		val = val.split(/\s*:\s*/)
		if(val[1]) styleMap[val[0] == "float" ? "cssFloat" : camelCase(val[0])] = val[1]
	})
}

StyleMap.prototype.valueOf = function() {
	var styleMap = this
	return Object.keys(styleMap).map(function(key) {
		return (key == "cssFloat" ? "float: " : hyphenCase(key) + ": ") + styleMap[key]
	}).join("; ")
}

function getSibling(node, step) {
	var silbings = node.parentNode && node.parentNode.childNodes
	, index = silbings && silbings.indexOf(node)

	return silbings && index > -1 && silbings[ index + step ] || null
}



function DocumentFragment() {
	this.childNodes = []
}

extendNode(DocumentFragment, {
	nodeType: 11,
	nodeName: "#document-fragment"
})

function Attr(node, name) {
	this.ownerElement = node
	this.name = name.toLowerCase()
}

Attr.prototype = {
	get value() { return this.ownerElement.getAttribute(this.name) },
	set value(val) { this.ownerElement.setAttribute(this.name, val) },
	toString: function() {
		return this.name + "=\"" + htmlEscape(this.value) + "\""
	}
}

function escapeAttributeName(name) {
	name = name.toLowerCase()
	if (name === "constructor" || name === "attributes") return name.toUpperCase()
	return name
}

function HTMLElement(tag) {
	var element = this
	element.nodeName = element.tagName = tag.toUpperCase()
	element.localName = tag.toLowerCase()
	element.childNodes = []
}

extendNode(HTMLElement, elementGetters, EventTarget, {
	get attributes() {
		var key
		, attrs = []
		, element = this
		for (key in element) if (key === escapeAttributeName(key) && element.hasAttribute(key))
			attrs.push(new Attr(element, escapeAttributeName(key)))
		return attrs
	},
	matches: function(sel) {
		return selector.matches(this, sel)
	},
	closest: function(sel) {
		return selector.closest(this, sel)
	},
	namespaceURI: "http://www.w3.org/1999/xhtml",
	nodeType: 1,
	localName: null,
	tagName: null,
	styleMap: null,
	hasAttribute: function(name) {
		name = escapeAttributeName(name)
		return name != "style" ? hasOwn.call(this, name) :
		!!(this.styleMap && Object.keys(this.styleMap).length)
	},
	getAttribute: function(name) {
		name = escapeAttributeName(name)
		return this.hasAttribute(name) ? "" + this[name] : null
	},
	setAttribute: function(name, value) {
		this[escapeAttributeName(name)] = "" + value
	},
	removeAttribute: function(name) {
		name = escapeAttributeName(name)
		this[name] = ""
		delete this[name]
	},
	toString: function() {
		var attrs = this.attributes.join(" ")
		return "<" + this.localName + (attrs ? " " + attrs : "") + ">" +
		(voidElements[this.tagName] ? "" : this.innerHTML + "</" + this.localName + ">")
	}
})

function ElementNS(namespace, tag) {
	var element = this
	element.namespaceURI = namespace
	element.nodeName = element.tagName = element.localName = tag
	element.childNodes = []
}

ElementNS.prototype = HTMLElement.prototype

function Text(data) {
	this.data = data
}

extendNode(Text, {
	nodeType: 3,
	nodeName: "#text",
	toString: function() {
		return htmlEscape("" + this.data)
	}
})

function Comment(data) {
	this.data = data
}

extendNode(Comment, {
	nodeType: 8,
	nodeName: "#comment",
	toString: function() {
		return "<!--" + this.data + "-->"
	}
})

function DocumentType(data) {
	this.data = data
}

extendNode(DocumentType, {
	nodeType: 10,
	toString: function() {
		return "<" + this.data + ">"
		// var node = document.doctype
		// return "<!DOCTYPE " + node.name +
		// 	(node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
		// 	(!node.publicId && node.systemId ? ' SYSTEM' : '') +
		// 	(node.systemId ? ' "' + node.systemId + '"' : '') + '>'
	}
})

function Document() {
	this.childNodes = []
	this.documentElement = this.createElement("html")
	this.appendChild(this.documentElement)
	this.body = this.createElement("body")
	this.documentElement.appendChild(this.body)
}

function own(Element) {
	return function($1, $2) {
		var node = new Element($1, $2)
		node.ownerDocument = this
		return node
	}
}

extendNode(Document, elementGetters, EventTarget, {
	nodeType: 9,
	nodeName: "#document",
	createElement: own(HTMLElement),
	createElementNS: own(ElementNS),
	createTextNode: own(Text),
	createComment: own(Comment),
	createDocumentType: own(DocumentType), //Should be document.implementation.createDocumentType(name, publicId, systemId)
	createDocumentFragment: own(DocumentFragment)
})

module.exports = {
	document: new Document(),
	StyleMap: StyleMap,
	Node: Node,
	HTMLElement: HTMLElement,
	DocumentFragment: DocumentFragment,
	Document: Document,
	Event: Event
}

