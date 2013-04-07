// This script licensed under the MIT.
// http://orgachem.mit-license.org


var tsumekusa = require('tsumekusa');
var util = tsumekusa.util;
var DefinitionList = tsumekusa.DefinitionList;
var ElementArray = tsumekusa.ElementArray;
var Paragraph = tsumekusa.Paragraph;

var basePath = '../../lib';
var tsumekusaJsdoc = require(basePath);
var DeprecationDefinition = require(basePath + '/dom/DeprecationDefinition');
var DocElement = require(basePath + '/dom/DocElement');
var SeeDefinition = require(basePath + '/dom/SeeDefinition');
var VisibilityDefinition = require(basePath + '/dom/VisibilityDefinition');



/**
 * A class for a definition of a member.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Symbol.
 * @param {?tsumekusaJsdoc.dom.DocHelper=} opt_docHelper Optional
 *     document helper.
 * @param {?tsumekusaJsdoc.references.ReferenceHelper=} opt_refHelper Optional
 *     reference helper.
 * @constructor
 * @extends {tsumekusaJsdoc.dom.DocElement}
 */
var MemberDefinition = function(symbol, opt_docHelper, opt_refHelper) {
  DocElement.call(this, opt_docHelper, opt_refHelper);
  var def = new DefinitionList.Definition();
  var dt = new Paragraph();
  var dd = new ElementArray();

  def.setTerm(dt);
  def.setDescriptions(dd);

  dt.addInlineElement(this.createDigest(symbol));
  dd.addChildren(this.createSummaryBlocks(symbol));

  var dl = this.createDetailDefinitionList(symbol);
  if (dl) {
    dd.addChild(dl);
  }

  this.dd_ = dd;
  this.setElement(def);
};
util.inherits(MemberDefinition, DocElement);


/**
 * Creates a member digest such as {@code 'foo: string|null'}.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Symbol.
 * @return {tsumekusaJsdoc.dom.Digest} Member digest.
 */
MemberDefinition.prototype.createDigest = tsumekusa.abstractMethod;


/**
 * Creates contents as a member summary.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Symbol.
 * @return {Array.<tsumekusa.dom.BlockElement>} Top contents.
 */
MemberDefinition.prototype.createSummaryBlocks = function(symbol) {
  var blocks = this.getDocHelper().parseBlocks(
      symbol.description || tsumekusaJsdoc.NO_DESCRIPTION, symbol);
  return blocks;
};


/**
 * Returns definition descriptions.
 * @return {tsumekusa.dom.ElementArray} Definition description.
 */
MemberDefinition.prototype.getDefinitionDescritions = function() {
  return this.dd_;
};


/**
 * Creates 
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Member symbol.
 * @return {}
 */
MemberDefinition.prototype.createDetailDefinitionList = function(symbol) {
  var dl = new DefinitionList();
  var defs = dl.getDefinitions();

  if (symbol.access) {
    defs.addChild(this.createVisibilityDefinition(symbol).getElement());
  }

  if (symbol.deprecated) {
    defs.addChild(this.createDeprecationDefinition(symbol).getElement());
  }

  if (symbol.see) {
    defs.addChild(this.createSeeDefinition(symbol).getElement());
  }

  return defs.getCount() > 0 ? dl : null;
};



/**
 * Creates a visility definition.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Member symbol.
 * @return {tsumekusaJsdoc.dom.VisibilityDefinition} Created visility
 *     definition.
 */
MemberDefinition.prototype.createVisibilityDefinition = function(symbol) {
  return new VisibilityDefinition(symbol.access, this.getDocHelper(),
      this.getReferenceHelper());
};



/**
 * Creates a deprecation definition.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Member symbol.
 * @return {tsumekusaJsdoc.dom.VisibilityDefinition} Created visility
 *     definition.
 */
MemberDefinition.prototype.createDeprecationDefinition = function(symbol) {
  return new DeprecationDefinition(symbol, this.getDocHelper(),
      this.getReferenceHelper());
};



/**
 * Creates a see definition.
 * @param {tsumekusaJsdoc.dom.DocletWrapper} symbol Member symbol.
 * @return {tsumekusaJsdoc.dom.VisibilityDefinition} Created visility
 *     definition.
 */
MemberDefinition.prototype.createSeeDefinition = function(symbol) {
  return new SeeDefinition(symbol.see, this.getDocHelper(),
      this.getReferenceHelper());
};


// Exports the constructor.
module.exports = MemberDefinition;