// This script licensed under the MIT.
// http://orgachem.mit-license.org


var tsumekusaPath = '../../../tsumekusa';
var tsumekusa = require(tsumekusaPath);
var registry = require(tsumekusaPath + '/publishing/registry');
var publishers = require(tsumekusaPath + '/publishing/DefaultPublishers');

registry.registerElementPublishers(publishers);

var basePath = '../../../tsumekusaJsdoc';
var PropertyContainer = require(basePath + '/dom/PropertyContainer');
var Type = require(basePath + '/dom/Type');
var TypePublisher = require(basePath + '/publishing/TypePublisher');
Type.publisher = new TypePublisher();


exports.testPublish = function(test) {
  // Dummy doclet {{{
  var dummyDoclet = {
    "comment": "/**\n * The DOM element for the component.\n * @type {Element}\n * @private\n */",
    "meta": {
      "range": [
        10190,
        10233
      ],
      "filename": "component.js",
      "lineno": 354,
      "path": "google-closure-library/closure/goog/ui",
      "code": {
        "id": "astnode532405576",
        "name": "goog.ui.Component.prototype.element_",
        "type": "NULL",
        "node": "<Object>",
        "value": "NULL"
      }
    },
    "description": "The DOM element for the component.",
    "type": {
      "names": [
        "Element"
      ]
    },
    "access": "private",
    "name": "element_",
    "kind": "member",
    "memberof": "goog.ui.Component",
    "longname": "goog.ui.Component#element_",
    "scope": "instance",
    "___id": "T000002R000053",
    "___s": true
  };
  //}}}

 var container = new PropertyContainer(dummyDoclet);

  var CORRECT = [
    '0. goog.ui.Component#element_',
    '  goog.ui.Component#element_: [Element]',
    '',
    '  The DOM element for the component.'
  ].join('\n');

  test.equal(container.publish(), CORRECT);
  test.done();
};
