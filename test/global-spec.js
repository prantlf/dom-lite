describe("global", function() {
	var undef
	, localDOM = require("../")
	, globalDOM = require("../global")
	, test = describe.test

	test("exposes objects like a browser", function (assert) {
		assert.equal(globalDOM, localDOM)
		assert.equal(global.document, localDOM.document)
		assert.equal(global.Node, localDOM.Node)
		assert.equal(global.Element, localDOM.HTMLElement)
		assert.equal(global.HTMLElement, localDOM.HTMLElement)
		assert.equal(global.DocumentFragment, localDOM.DocumentFragment)
		assert.equal(global.Document, localDOM.Document)

		assert.end()
	})
})
