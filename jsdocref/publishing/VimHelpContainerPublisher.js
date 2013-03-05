// This script licensed under the MIT.
// http://orgachem.mit-license.org


var jsdocref = require('../../jsdocref');
var string = require('../string');



/**
 * A class for container publisher for vim help.
 * @constructor
 * @implements {jsdocref.publishing.ContentPublisher}
 */
var VimHelpContainerPublisher = function() {};
jsdocref.addSingletonGetter(VimHelpContainerPublisher);


/**
 * Separator characters.  First char is used in top level container, and second
 * char is used in second level container.
 * @const
 * @type {string}
 */
VimHelpContainerPublisher.SEPARATORS = '=-';


/**
 * Returns a header content.
 * @param {jsdocref.publishing.Container} container Contents container
 *     to create a header.
 * @return {jsdocref.publishing.Content} Header content.
 */
VimHelpContainerPublisher.prototype.createHeader = function(container) {
  var indexString = this.createIndex(container);
  var tag = container.getTag();
  var tagString = tag.publish();

  var head = indexString + ' ' + container.getCaption();
  var tail = tagString;
  return string.fillMiddle(head, tail, jsdocref.TEXT_WIDTH);
};


/**
 * Returns a footer content.
 * @param {jsdocref.publishing.Container} container Contents container
 *     to create a footer.
 * @return {jsdocref.publishing.Content} Footer content.
 */
VimHelpContainerPublisher.prototype.createFooter = function(container) {
  return null;
};


/**
 * Creates an index string on head of a header.  Index string foemat as: {@code
 * 1.1.2}.
 * @param {jsdocref.publishing.Container} container Contents container.
 * @return {string} Index string.
 */
VimHelpContainerPublisher.prototype.createIndex = function(container) {
  var ancestors = container.getAncestors();

  var depth, idxs;

  if ((depth = container.getSelfDepth()) > 1) {
    ancestors.push(container);
    idxs = ancestors.map(function(content) {
      return content.getSelfIndex() + 1;
    });
    idxs.shift();
    return idxs.join('.');
  }
  else {
    return container.getSelfDepth() + '.';
  }
};


/**
 * Creates a separator between sub contents.
 * @param {jsdocref.publishing.Container} container Contents container.
 * @return {string} Separator.
 */
VimHelpContainerPublisher.prototype.createSubContentSeparator =
    function(container) {
  var i = container.getSelfDepth();
  var SEP = VimHelpContainerPublisher.SEPARATORS;
  var sepLen = SEP.length;

  return (i >= sepLen ? '' : string.repeat(SEP[i], jsdocref.TEXT_WIDTH)) + '\n';
};


/**
 * Creates a top content.
 * @param {jsdocref.publishing.Container} container Contents container.
 * @return {string} Top content.
 */
VimHelpContainerPublisher.prototype.createTopContent = function(container) {
  var topContent;
  return (topContent = container.getTopContent()) && topContent.publish();
};


/**
 * Creates sub contents.
 * @param {jsdocref.publishing.Container} container Contents container.
 * @return {string} Sub contents.
 */
VimHelpContainerPublisher.prototype.createSubContents = function(container) {
  var separator = this.createSubContentSeparator(container);
  var subStrings = this.createSubContentsInternal(container);

  if (subStrings.length > 0) {
    var subsString = subStrings.join(separator);
    return [separator, subsString].join('');
  }

  return null;
};


/**
 * Creates a sub contents string internally.
 * @param {jsdocref.publishing.Container} container Contents container.
 * @return {Array.<string>} Sub contents.
 * @protected
 */
VimHelpContainerPublisher.prototype.createSubContentsInternal = function(
    container) {
  return container.getSubContents().map(function(content) {
    return content.publish();
  });
};


/** @override */
VimHelpContainerPublisher.prototype.publish = function(container) {
  var output = [];
  var header = this.createHeader(container);
  if (header) {
    output.push(header);
  }
  var topContent = this.createTopContent(container);
  if (topContent) {
    output.push(topContent);
  }
  else {
    output.push('');
  }
  var subContents = this.createSubContents(container);
  if (subContents) {
    output.push(subContents);
  }
  var footer = this.createFooter(container);
  if (footer) {
    output.push(footer);
  }

  return output.join('\n');
};


// Export the constructor
module.exports = VimHelpContainerPublisher;
