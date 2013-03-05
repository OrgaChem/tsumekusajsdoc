// This script licensed under the MIT.
// http://orgachem.mit-license.org


var jsdocref = require('../../jsdocref');
var BlockContent = require('./BlockContent');
var Sentence = require('./Sentence');
var VimHelpDefinitionListPublisher = require(
    './VimHelpDefinitionListPublisher');



/**
 * A class for ordered/unordered list contents.
 * Use {@link jsdocref.publishing.DefinitionList} if you need.
 * @param {?jsdocref.publishing.DefinitionList.ListType=} opt_type List type.
 *     Default is no marker list.
 * @constructor
 * @extends {jsdocref.publishing.BlockContent}
 */
var DefinitionList = function(opt_type) {
  BlockContent.call(this);
  this.definitions_ = [];
  this.type_ = opt_type || DefinitionList.ListType.NO_MARKER;
};
jsdocref.inherits(DefinitionList, BlockContent);


/**
 * List type numbers.
 * @enum {number}
 */
DefinitionList.ListType = {
  /** No marker list type. */
  NO_MARKER: 0,
  /** Ordered list type. */
  ORDERED: 1,
  /** Unordered list type. */
  UNORDERED: 2
};


/**
 * Default content publisher.
 * @type {jsdocref.publishing.ContentPublisher}
 */
DefinitionList.publisher = VimHelpDefinitionListPublisher.getInstance();


/**
 * Definitions.
 * @type {Array.<jsdocref.publishing.Definition>}
 * @private
 */
DefinitionList.prototype.definitions_ = null;


/**
 * List type.
 * @type {jsdocref.publishing.List.ListType}
 * @private
 */
DefinitionList.prototype.type_;


/**
 * Returns a list type.
 * @return {jsdocref.publishing.DefinitionList.ListType} List type.
 */
DefinitionList.prototype.getListType = function() {
  return this.type_;
};


/**
 * Appends a definition.  The method is chainable.
 * @param {jsdocref.publishing.Sentence} caption Definition caption.
 * @param {jsdocref.publishing.Sentence} content Definition content.
 * @param {?jsdocref.publishing.DefinitionList.ListType=} opt_type List type.
 *     Default is same type parent list.
 * @return {jsdocref.publishing.DefinitionList} This instance.
 */
DefinitionList.prototype.appendDefinition = function(caption, content,
                                                     opt_type) {
  this.definitions_.push(new DefinitionList.Definition(caption, content,
      opt_type || this.getListType()));
  return this;
};


/**
 * Removes a definition.
 * @param {?jsdocref.publishing.DefinitionList.Definition} definition Definition
 *     to remove.  Returns null if the definition is not found.
 * @return {jsdocref.publishing.DefinitionList.Definition} Removed definition if
 *     exists.
 */
DefinitionList.prototype.removeDefinition = function(definition) {
  var i = this.definitions_.indexOf(definition);
  if (i >= 0) {
    return this.definitions_.splice(i, 1) || null;
  }
  return null;
};


/**
 * Returns definitions.
 * @return {Array.<jsdocref.publishing.Definition>} Definitions.
 */
DefinitionList.prototype.getDefinitions = function() {
  return this.definitions_;
};


/**
 * Returns a definition by index.
 * @param {number} index Index of a definition to get.
 * @return {jsdocref.publishing.DefinitionList.Definition} Definition.
 * @protected
 */
DefinitionList.prototype.getDefinitionAt = function(index) {
  return this.getDefinitions()[index];
};


/**
 * Returns a definition caption.
 * @param {number} index Index of a definition to get.
 * @return {jsdocref.publishing.Sentence} Definition caption.
 */
DefinitionList.prototype.getDefinitionCaptionAt = function(index) {
  var definition;
  return (definition = this.getDefinitionAt(index)) && definition.getCaption();
};


/**
 * Returns a definition content.
 * @param {number} index Index of a definition to get.
 * @return {jsdocref.publishing.Sentence} Definition content.
 */
DefinitionList.prototype.getDefinitionContentAt = function(index) {
  var definition;
  return (definition = this.getDefinitionAt(index)) && definition.getContent();
};



/**
 * A class for definition.
 * @param {jsdocref.publishing.Sentence} caption Definition caption.
 * @param {jsdocref.publishing.Sentence} content Definition content.
 * @param {jsdocref.publishing.DefinitionList.ListType} type List type.
 * @constructor
 */
DefinitionList.Definition = function(caption, content, type) {
  this.caption_ = caption instanceof Sentence ? caption : new Sentence(caption);
  this.content_ = content instanceof Sentence ? content : new Sentence(content);
  this.type_ = type;
};


/**
 * Returns a caption.
 * @return {jsdocref.publishing.Sentence} Definition caption.
 */
DefinitionList.Definition.prototype.getCaption = function() {
  return this.caption_;
};


/**
 * Returns a content.
 * @return {jsdocref.publishing.Sentence} Definition content.
 */
DefinitionList.Definition.prototype.getContent = function() {
  return this.content_;
};


/**
 * List type.
 * @type {jsdocref.publishing.DefinitionList.ListType}
 * @private
 */
DefinitionList.Definition.prototype.type_;


/**
 * Returns a list type.
 * @return {jsdocref.publishing.DefinitionList.ListType} List type.
 */
DefinitionList.Definition.prototype.getListType = function() {
  return this.type_;
};


// Export the constructor
module.exports = DefinitionList;
