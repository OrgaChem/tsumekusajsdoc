// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A class for definitions of method parameters.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


var tsumekusa = require('../../node_modules/tsumekusa');
var util = tsumekusa.util;
var DefinitionList = tsumekusa.DefinitionList;
var ElementArray = tsumekusa.ElementArray;
var InlineCode = tsumekusa.InlineCode;
var InlineElement = tsumekusa.InlineElement;
var Paragraph = tsumekusa.Paragraph;

var basePath = '../../lib';
var tsumekusaJsdoc = require(basePath);
var DocElement = require(basePath + '/dom/DocElement');
var Type = require(basePath + '/dom/Type');



/**
 * A class for a definitions of method parameters.
 * @param {module:lib/dom/DocletWrapper} symbol Symbol.
 * @param {?module:lib/dom/DocHelper=} opt_docHelper Optional document helper.
 * @param {?module:lib/references/ReferenceHelper=} opt_refHelper Optional
 *     reference helper.
 * @constructor
 * @extends {module:lib/dom/DocElement}
 * @exports lib/dom/ParametersDefinition
 */
ParametersDefinition = function(symbol, opt_docHelper, opt_refHelper) {
  DocElement.call(this, opt_docHelper, opt_refHelper);
  var docHelper = this.getDocHelper();
  var def = new DefinitionList.Definition();

  var dt = this.getCaption();
  var dd = new ElementArray();

  def.setTerm(dt);
  def.setDescriptions(dd);

  var innerDl = new DefinitionList(DefinitionList.ListType.NO_MARKER);
  dd.addChild(innerDl);

  if (symbol.params) {
    symbol.params.forEach(function(tag) {
      var desc = new ElementArray();
      desc.addChildren(docHelper.parseBlocks(tag.description || tsumekusaJsdoc.
          NO_DESCRIPTION, symbol));

      var term = new ParametersDefinition.ParameterDefinitionTerm(tag,
          opt_docHelper, opt_refHelper);
      var p = new Paragraph(term.getElement());

      innerDl.addDefinition(p, desc);
    }, this);
  }

  this.setElement(def);
};
util.inherits(ParametersDefinition, DocElement);


/**
 * Default caption for parameter definitions.
 * @const
 * @type {string}
 */
ParametersDefinition.CAPTION = 'Parameters';



/**
 * A class for parameter definition terms.
 * @param {jsdoc.Tag} tag Parameter tag.
 * @param {?module:lib/dom/DocHelper=} opt_docHelper Optional document helper.
 * @param {?module:lib/references/ReferenceHelper=} opt_refHelper Optional
 *     reference helper.
 * @constructor
 * @extends {module:lib/dom/DocElement}
 */
ParametersDefinition.ParameterDefinitionTerm = function(tag, opt_docHelper,
    opt_refHelper) {
  DocElement.call(this, opt_docHelper, opt_refHelper);

  var name = new InlineCode(tsumekusaJsdoc.decorateParamName(tag));
  var type = new Type(tag, opt_docHelper, opt_refHelper);

  var impl = new ParametersDefinition.ParameterDefinitionTermImpl(name, type);
  this.setElement(impl);
};
util.inherits(ParametersDefinition.ParameterDefinitionTerm, DocElement);



/**
 * A class for parameter definition term implementors.
 * @param {tsumekusa.dom.InlineElement} name Parameter name.
 * @param {module:lib/dom/Type} type Parameter type.
 * @constructor
 * @extends {tsumekusa.dom.InlineElement}
 */
ParametersDefinition.ParameterDefinitionTermImpl = function(name, type) {
  InlineElement.call(this);
  this.name_ = name;
  this.type_ = type;
};
util.inherits(ParametersDefinition.ParameterDefinitionTermImpl,
    InlineElement);


/** @override */
ParametersDefinition.ParameterDefinitionTermImpl.prototype.isBreakable =
    function() {
  return false;
};


/** @override */
ParametersDefinition.ParameterDefinitionTermImpl.prototype.getPublisher =
    function() {
  return null;
};


/** @override */
ParametersDefinition.ParameterDefinitionTermImpl.prototype.publish =
    function() {
  return this.name_.publish() + ': ' + this.type_.publish();
};


/**
 * Retruns a caption of parameter definitions.
 * @return {string} Caption string for parameter definitions.
 */
ParametersDefinition.prototype.getCaption = function() {
  return ParametersDefinition.CAPTION + ':';
};


// Exports the constructor.
module.exports = ParametersDefinition;
