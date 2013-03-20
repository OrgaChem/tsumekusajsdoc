// This script licensed under the MIT.
// http://orgachem.mit-license.org


var basePath = '../../tsumekusa';
var tsumekusa = require(basePath);
var ContentArray = require(basePath + '/dom/ContentArray');
var BlockContent = require(basePath + '/dom/BlockContent');



/**
 * A class for sentence.
 * @param {tsumekusa.dom.InlineContent|string} var_args Inline contents to
 *     append.
 * @constructor
 * @extends {tsumekusa.dom.BlockContent}
 */
var Paragraph = function(var_args) {
  BlockContent.call(this);

  this.inlineContents_ = new ContentArray();

  if (var_args) {
    this.addInlineContents(Array.prototype.slice.call(arguments, 0));
  }
};
tsumekusa.inherits(Paragraph, BlockContent);


/**
 * Default content publisher.
 * @type {tsumekusa.publishing.ParagraphPublisher}
 */
Paragraph.publisher = null;


/**
 * Inline contents in the paragraph.
 * @type {tsumekusa.dom.ContentArray.<tsumekusa.dom.InlineContent|
 * string>}
 * @private
 */
Paragraph.prototype.inlineContents_;


/**
 * Returns inline contents are in the paragraph.
 * @return {Array.<tsumekusa.dom.InlineContent|string>} Inline contents.
 */
Paragraph.prototype.getInlineContents = function() {
  return this.inlineContents_.getChildren();
};


/**
 * Adds inline contents at the last.
 * @param {Array.<tsumekusa.dom.InlineContent|string>} contents Inline
 *     contents or strings to add.
 * @return {tsumekusa.dom.Paragraph} This instance.
 */
Paragraph.prototype.addInlineContents = function(contents) {
  contents.forEach(function(content) {
    this.addInlineContent(content);
  }, this);
  return this;
};


/**
 * Adds an inline content at the last.
 * @param {tsumekusa.dom.InlineContent|string} content Inline content or
 *     string to add.
 * @return {tsumekusa.dom.Paragraph} This instance.
 */
Paragraph.prototype.addInlineContent = function(content) {
  this.inlineContents_.addChild(content);
  return this;
};


/**
 * Adds an inline content at the given 0-based index.
 * @param {tsumekusa.dom.InlineContent|string} content Inline content or
 *     string to add.
 * @param {number} index 0-based index.
 * @return {tsumekusa.dom.Paragraph} This instance.
 */
Paragraph.prototype.addInlineContentAt = function(content, index) {
  this.inlineContents_.addChildAt(content, index);
  return this;
};


/**
 * Removes the specified inline content from the paragraph.
 * @param {tsumekusa.dom.InlineContent|string} content Inline content or
 *     string to remove.
 * @return {tsumekusa.dom.InlineContent|string} Removed inline content, if
 *     any.
 */
Paragraph.prototype.removeInlineContent = function(content) {
  return this.inlineContents_.removeChild(content);
};


/**
 * Removes the specified inline content at the given 0-based index from the
 * paragraph.
 * @param {number} index 0-based index.
 * @return {tsumekusa.dom.InlineContent|string} Removed inline content, if
 *     any.
 */
Paragraph.prototype.removeInlineContentAt = function(index) {
  return this.inlineContents_.removeChildAt(index);
};


// Exports the constructor.
module.exports = Paragraph;
