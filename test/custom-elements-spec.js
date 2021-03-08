describe("customElements", function() {
	var undef
	, test = describe.test
	, DOM = require("../")
	, document = DOM.document
	, HTMLElement = DOM.HTMLElement
	, customElements = DOM.customElements

	test("wait for early registration", function (assert) {
		class FirstElement extends HTMLElement {}
		customElements.define('first-element', FirstElement)

		customElements
			.whenDefined('first-element')
			.then(function (elementClass) {
				assert.equal(elementClass, FirstElement)

				assert.end()
			})
	})

	test("wait for late registration", function (assert) {
		class SecondElement extends HTMLElement {}

		customElements
			.whenDefined('second-element')
			.then(function (elementClass) {
				assert.equal(elementClass, SecondElement)

				assert.end()
			})

		customElements.define('second-element', SecondElement)
	})

	test("check the registration", function (assert) {
		class ThirdElement extends HTMLElement {}

		assert.equal(customElements.get('third-element'), undefined)
		customElements.define('third-element', ThirdElement)
		assert.equal(customElements.get('third-element'), ThirdElement)

		assert.end()
	})

	test("validate the custom element name", function (assert) {
		try {
			customElements.define('test', function () {})
			assert.ok(false, 'invalid element name accepted')
		} catch (error) {
			assert.ok(true)
		}

		assert.end()
	})

	test("validate the custom element class", function (assert) {
		try {
			customElements.define('x-test', null)
			assert.ok(false, 'invalid element class accepted')
		} catch (error) {
			assert.ok(true)
		}

		assert.end()
	})

	test("validate an already defined element", function (assert) {
		try {
			customElements.define('third-element', function () {})
			assert.ok(false, 'an already defined element accepted')
		} catch (error) {
			assert.ok(true)
		}

		assert.end()
	})

	test("create a custom element", function (assert) {
		class FourthElement extends HTMLElement {}
		customElements.define('fourth-element', FourthElement)

		var el = document.createElement('fourth-element')
		assert.ok(el instanceof FourthElement)

		assert.end()
	})

	test("notify about appending to and removing from DOM", function (assert) {
		var called = ""
		class FifthElement extends HTMLElement {
			connectedCallback() { called += "1" }
			disconnectedCallback() { called += "2" }
		}
		customElements.define('fifth-element', FifthElement)

		var el = document.createElement('fifth-element')
		document.body.appendChild(el)
		document.body.removeChild(el)
		assert.equal(called, "12")

		assert.end()
	})

	test("notify about attribute changes", function (assert) {
		var called = ""
		class SixthElement extends HTMLElement {
			attributeChangedCallback() { called += "1" }
			static get observedAttributes() { return ["test"] }
		}
		customElements.define('sixth-element', SixthElement)

		var el = document.createElement('sixth-element')
		el.setAttribute('test', '1')
		el.setAttribute('test2', '2')
		assert.equal(called, "1")

		assert.end()
	})

	test("check if an element is included in DOM", function (assert) {
		var el = document.createElement('div')
		assert.equal(document.contains(el), false)
		document.body.appendChild(el)
		assert.equal(document.contains(el), true)

		assert.end()
	})
})
