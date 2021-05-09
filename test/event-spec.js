describe("Event", function() {
	var undef
	, test = describe.test
	, DOM = require("../")
	, document = DOM.document
	, Event = DOM.Event


	test("does not contain document in the composed path for an element not appended to DOM ", function (assert) {
		var el = document.createElement("div")

		var event = new Event('click')
		event.target = el

		var path = event.composedPath()
		assert.equal(path.length, 1)
		assert.equal(path[0], el)

		assert.end()
	})


	test("contains document in the composed path for an element appended to DOM ", function (assert) {
		var el = document.createElement("div")
		document.body.appendChild(el)

		var event = new Event('click')
		event.target = el

		var path = event.composedPath()
		assert.equal(path.length, 4)
		assert.equal(path[0], el)
		assert.equal(path[1], document.body)
		assert.equal(path[2], document.documentElement)
		assert.equal(path[3], document)

		assert.end()
	})


	test("shortens the composed path if not composed and the shadow root is closed", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.shadowRoot = { mode: "closed" }
		parent.appendChild(child)

		var event = new Event('click')
		event.target = child

		var path = event.composedPath()
		assert.equal(path.length, 1)
		assert.equal(path[0], parent)

		assert.end()
	})


	test("shortens the composed path if the shadow root is closed", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.shadowRoot = { mode: "closed" }
		parent.appendChild(child)

		var event = new Event('click', { composed: true })
		event.target = child

		var path = event.composedPath()
		assert.equal(path.length, 1)
		assert.equal(path[0], parent)

		assert.end()
	})


	test("shortens the composed path if not composed", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.shadowRoot = { mode: "open" }
		parent.appendChild(child)

		var event = new Event('click')
		event.target = child

		var path = event.composedPath()
		assert.equal(path.length, 1)
		assert.equal(path[0], parent)

		assert.end()
	})


	test("includes shadow in the composed path if composed and the shadow is open", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.shadowRoot = { mode: "open" }
		parent.appendChild(child)

		var event = new Event('click', { composed: true })
		event.target = child

		var path = event.composedPath()
		assert.equal(path.length, 3)
		assert.equal(path[0], child)
		assert.equal(path[1], parent.shadowRoot)
		assert.equal(path[2], parent)

		assert.end()
	})


	test("can be captured if bubbling", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			triggered.push(4)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 4)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)
		assert.equal(triggered[2], 3)
		assert.equal(triggered[3], 4)

		assert.end()
	})


	test("can be captured if not bubbling", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			triggered.push(4)
		})

		var event = new Event('click')
		child.dispatchEvent(event)
		assert.equal(triggered.length, 3)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)
		assert.equal(triggered[2], 3)

		assert.end()
	})


	test("can stop propagation", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			event.stopPropagation()
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			triggered.push(4)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 3)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)
		assert.equal(triggered[2], 3)

		assert.end()
	})


	test("can stop propagation immediately when capturing", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			event.stopImmediatePropagation()
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			triggered.push(4)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 1)
		assert.equal(triggered[0], 1)

		assert.end()
	})


	test("can stop propagation immediately when on the target", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			event.stopImmediatePropagation()
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			triggered.push(4)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 2)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)

		assert.end()
	})


	test("can stop propagation immediately when bubbling", function (assert) {
		var parent = document.createElement("div")
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		parent.addEventListener('click', function() {
			triggered.push(1)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(2)
		}, true)
		child.addEventListener('click', function() {
			triggered.push(3)
		})
		parent.addEventListener('click', function() {
			event.stopImmediatePropagation()
			triggered.push(4)
		})
		parent.addEventListener('click', function() {
			triggered.push(5)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 4)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)
		assert.equal(triggered[2], 3)
		assert.equal(triggered[3], 4)

		assert.end()
	})


	test("can be cancelable", function (assert) {
		var el = document.createElement("div")

		el.addEventListener('click', function() {})

		var event = new Event('click', { cancelable: true })
		assert.equal(el.dispatchEvent(event), true)

		assert.end()
	})


	test("can be cancelled if cancelable", function (assert) {
		var el = document.createElement("div")

		el.addEventListener('click', function() {
			event.preventDefault()
		})

		var event = new Event('click', { cancelable: true })
		assert.equal(el.dispatchEvent(event), false)

		assert.end()
	})


	test("cannot be cancelled if not cancelable", function (assert) {
		var el = document.createElement("div")

		el.addEventListener('click', function() {
			event.preventDefault()
		})

		var event = new Event('click')
		assert.equal(el.dispatchEvent(event), true)

		assert.end()
	})


	test("can be unregistered", function (assert) {
		var el = document.createElement("div")

		var triggered = []
		var handler = function() {
			triggered.push(1)
		}

		el.addEventListener('click', handler)
		el.removeEventListener('click', handler)
		el.removeEventListener('click', handler)

		var event = new Event('click')
		el.dispatchEvent(event)
		assert.equal(triggered.length, 0)

		assert.end()
	})


	test("works with document fragment", function (assert) {
		var parent = document.createDocumentFragment()
		var child = document.createElement("div")
		parent.appendChild(child)

		var triggered = []
		child.addEventListener('click', function() {
			triggered.push(1)
		})
		parent.addEventListener('click', function() {
			triggered.push(2)
		})

		var event = new Event('click', { bubbles: true })
		child.dispatchEvent(event)
		assert.equal(triggered.length, 2)
		assert.equal(triggered[0], 1)
		assert.equal(triggered[1], 2)

		assert.end()
	})


	test("requires type", function (assert) {
		try {
			var event = new Event()
			assert.ok(false, 'empty type accepted')
		} catch (error) {
			assert.ok(true)
		}

		assert.end()
	})
})
