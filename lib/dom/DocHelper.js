// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A singleton class for documenting helper.
 * @author orga.cham.job@gmail.com (Orga Chem)
 */


var tsumekusa = require('../../node_modules/tsumekusa');
var util = tsumekusa.util;
var string = tsumekusa.string;
var Code = tsumekusa.Code;
var DefinitionList = tsumekusa.DefinitionList;
var ElementArray = tsumekusa.ElementArray;
var InlineCode = tsumekusa.InlineCode;
var Link = tsumekusa.Link;
var List = tsumekusa.List;
var Paragraph = tsumekusa.Paragraph;
var Strong = tsumekusa.Strong;

var basePath = '../../lib';
var tsumekusaJsdoc = require(basePath);
var UnknownInlineTag = require(basePath + '/dom/UnknownInlineTag');


// Support trim methods for htmlparser2 on Rhino.
if (!String.prototype.trim) {
  String.prototype.trim = string.trim;
}

if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = string.trimLeft;
}

if (!String.prototype.trimRight) {
  String.prototype.trimRight = string.trimRight;
}

var htmlparser = require('../../node_modules/htmlparser2');



/**
 * A singleton class for documenting helper.  You can change behavior of inline
 * code parsing, and then you should call {@link tsumekusa.addSingletonGetter},
 * it helps to prevent different helper used.
 * @constructor
 * @exports lib/dom/DocHelper
 */
var DocHelper = function() {};
util.addSingletonGetter(DocHelper);


/**
 * Enabled tag name regexp on {@link #parseBlocks}.
 * @const
 * @type {RegExp}
 */
DocHelper.ENABLED_TAG_NAME_REGEXP = /^(ul|ol|li|pre|code|b)/i;


/**
 * Parses a string includes block-like contents.  The method parse HTML if
 * {@link tsumekusaJsdoc.HTML_DISABLED} is true.
 * @param {string} str String to parse.
 * @param {?module:lib/dom/DocletWrapper=} opt_current Optional doclet that
 *     has {@code str}.
 * @return {Array.<module:tsumekusa.BlockElement>} Block elements.
 */
DocHelper.prototype.parseBlocks = function(str, opt_current) {
  var blocks = [], blockIdx = 0;

  if (!tsumekusaJsdoc.HTML_DISABLED) {
    var root = new DocHelper.TreeNode();
    var currentNode = root, tmp;

    var parser = new htmlparser.Parser({
      onopentag: function(name) {
        if (name.match(DocHelper.ENABLED_TAG_NAME_REGEXP)) {
          tmp = new DocHelper.TreeNode();
          tmp.setValue({ name: name, text: null });
          currentNode.append(tmp);
          currentNode = tmp;
        }
        else {
          tmp = new DocHelper.TreeNode();
          tmp.setValue({ name: 'text', text: '<' + name + '>' });
          currentNode.append(tmp);
        }
      },
      ontext: function(text) {
        tmp = new DocHelper.TreeNode();
        var decoded = text.replace(/&([^;]+);/g, function(s, entity) {
          switch (entity) {
            case 'amp':
              return '&';
            case 'lt':
              return '<';
            case 'gt':
              return '>';
            case 'quot':
              return '"';
            default:
              if (entity.charAt(0) == '#') {
                // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex.
                var n = Number('0' + entity.substr(1));
                if (!isNaN(n)) {
                  return String.fromCharCode(n);
                }
              }
          }
        });

        tmp.setValue({ name: 'text', text: decoded });
        currentNode.append(tmp);
      },
      onclosetag: function(name) {
        if (name.match(DocHelper.ENABLED_TAG_NAME_REGEXP)) {
          currentNode = currentNode.getParent();
        }
        else {
          tmp = new DocHelper.TreeNode();
          tmp.setValue({ name: 'text', text: '</' + name + '>' });
          currentNode.append(tmp);
        }
      }
    });

    parser.write(str);
    parser.done();

    root.getChildren().forEach(function(node) {
      var block = this.createBlockElementByNode(node, opt_current);
      if (block) {
        blocks[blockIdx++] = block;
      }
    }, this);
  }
  else {
    var p = new Paragraph();
    p.addInlineElements(this.parseInlineTags(str, opt_current));
    blocks[0] = p;
  }

  return blocks;
};


/**
 * Creates block content by a node.
 * @param {module:lib/dom/DocHelper.TreeNode} node Node.
 * @param {?module:lib/dom/DocletWrapper=} opt_current Optional doclet that
 *     has {@code node}.
 * @return {?module:tsumekusa.BlockElement} Block element.  Return null the text
 * is whitespaces or an unknown html element.
 * @protected
 */
DocHelper.prototype.createBlockElementByNode = function(node, opt_current) {
  var obj = node.getValue();
  var tagName = obj.name;
  var text = obj.text;
  var childNodes = node.getChildren();

  switch (tagName.toLowerCase()) {
    case 'ul':
      var list = new List(List.ListType.UNORDERED);
      var elemArr = list.getListItems();

      childNodes.forEach(function(childNode) {
        var child = this.createBlockElementByNode(childNode, opt_current);
        if (child) {
          elemArr.addChild(child);
        }
      }, this);

      return list;
    case 'ol':
      var list = new List(List.ListType.ORDERED);
      var elemArr = list.getListItems();

      childNodes.forEach(function(childNode) {
        var child = this.createBlockElementByNode(childNode, opt_current);
        if (child) {
          elemArr.addChild(child);
        }
      }, this);

      return list;
    case 'li':
      var blocks = new ElementArray();

      childNodes.forEach(function(childNode) {
        var child = this.createBlockElementByNode(childNode, opt_current);
        if (child) {
          blocks.addChild(child);
        }
      }, this);

      return new List.ListItem(blocks);
    case 'pre':
      var pre = childNodes[0].getValue().text.replace(/^\n/, '')
          .replace(/\n$/, '');
      return new Code(pre);
    case 'b':
      var strong = childNodes[0].getValue().text;
      return new Strong(strong);
    case 'code':
      var code = childNodes[0].getValue().text;
      return new InlineCode(code);
    case 'text':
      if (text && !text.match(/^\s*$/)) {
        var p = new Paragraph();
        p.addInlineElements(this.parseInlineTags(text, opt_current));
        return p;
      }
      return null;
    default:
      tsumekusa.warn('Unpublishable HTML tag found: <' + tagName + '>');
      return null;
  }
};


/**
 * Parses a string to an array of inline tags.  Returns an original string,
 * if {@link tsumekusa.INLINE_TAG_DISABLED} flag was set.
 * @param {string} input String to parse.
 * @param {?module:lib/dom/DocletWrapper=} opt_current Optional current
 *     doclet.
 * @return {Array.<string|tsumekusa.dom.InlineElement>} Parsed contents.
 */
DocHelper.prototype.parseInlineTags = function(input, opt_current) {
  // Return an original input if no inline code.
  var contents = [input], contentsIdx = 0;
  var that = this;

  if (!tsumekusaJsdoc.INLINE_TAG_DISABLED) {
    input.replace(/([^\{]+)?(\{@([\S]+)\s+([^\}]+)\})?/g, function(matched, pre,
        tag, tagName, tagElement) {
          if (pre) {
            contents[contentsIdx++] = string.trim(pre);
          }
          if (tag) {
            contents[contentsIdx++] = that.createInlineElement(tagName,
                tagElement, opt_current);
          }
        });
  }

  return contents;
};


/**
 * Creates an inline content by tag name and tag content.  You can get an
 * unknown tag by overriding the method, when you defined a new inline tag.
 *
 * See the sample overriding:
 * <pre>
 * function(tagName, tagElement) {
 *   var tag = DocHelper.prototype.createInlineElement(tagName, tagElement);
 *
 *   // Check whether the tag is unknown
 *   if (tag.unknown) {
 *     // You can switch to construct your inline contents
 *     switch (tag.type) {
 *       case 'foo':
 *         return new YourInlineElement(tag.content);
 *       default:
 *         // Make chainable
 *         return tag;
 *     }
 *   }
 *   return tag;
 * };
 * </pre>
 * @param {string} tagName Tag name.
 * @param {string} tagElement Tag content.
 * @param {?module:lib/dom/DocletWrapper=} opt_current Optional current
 *     doclet.
 * @return {tsumekusa.dom.InlineElement} Created inline content.  Returns
 *     an {@code tsumekusa.publishing.UnknownInlineTag} for overriding if the
 *     tag type was unknown.  You can get an other content by overriding the
 *     method when you defined a new inline tag.
 */
DocHelper.prototype.createInlineElement = function(tagName, tagElement,
    opt_current) {
  switch (tagName.toLowerCase()) {
    case 'link':
      return new Link(this.resolveInlineLink(tagElement, opt_current));
    case 'plain':
    case 'code':
      return new InlineCode(tagElement);
    default:
      return new UnknownInlineTag(tagName, tagElement, opt_current);
  }
};


/**
 * Resolves relational link in an inline content.
 * @param {string} link Link string.
 * @param {?module:lib/dom/DocletWrapper=} opt_current Optional current
 *     doclet.
 * @return {string} Absolute link string.
 */
DocHelper.prototype.resolveInlineLink = function(link, opt_current) {
  // The method can not resolve a link, if current doclet is not defined. then
  // the method should pass through.  And link head is not '#', it seems
  // an absolute link.
  if (opt_current && opt_current.memberof && link.match(/^\s*#/)) {
    var parent = opt_current.memberof;
    return parent + link;
  }
  return link;
};



/**
 * A class for tree nodes.
 * @constructor
 */
DocHelper.TreeNode = function() {
  this.children_ = [];
};


/**
 * Tree node as a parent of the node.
 * @type {module:lib/dom/DocHelper.TreeNode}
 * @private
 */
DocHelper.TreeNode.prototype.super_ = null;


/**
 * Tree nodes as children of the node.
 * @type {Array.<module:lib/dom/DocHelper.TreeNode>}
 * @private
 */
DocHelper.TreeNode.prototype.children_ = null;


/**
 * Sets a value to the node.
 * @param {*} val Value to set.
 */
DocHelper.TreeNode.prototype.setValue = function(val) {
  this.val_ = val;
};


/**
 * Returns a value of the node.
 * @return {*} Value of the node.
 */
DocHelper.TreeNode.prototype.getValue = function() {
  return this.val_;
};


/**
 * Sets a parent node.
 * @param {module:lib/dom/DocHelper.TreeNode} tree Parent tree
 *   node.
 */
DocHelper.TreeNode.prototype.setParent = function(tree) {
  this.super_ = tree;
};


/**
 * Returns a parent node.
 * @return {?module:lib/dom/DocHelper.TreeNode} Parent tree node
 *     if any.
 */
DocHelper.TreeNode.prototype.getParent = function() {
  return this.super_;
};


/**
 * Returns children of the node.
 * @return {Array.<module:lib/dom/DocHelper.TreeNode>} Children.
 */
DocHelper.TreeNode.prototype.getChildren = function() {
  return this.children_;
};


/**
 * Appends a tree node.
 * @param {module:lib/dom/DocHelper.TreeNode} tree Tree node to
 *     append.
 */
DocHelper.TreeNode.prototype.append = function(tree) {
  this.children_.push(tree);
  tree.setParent(this);
};


/**
 * Traverses all child nodes recursively in preorder.
 * @param {?function (goog.structs.TreeNode)} func Callback function. It takes
 *     the node as argument.
 * @param {?Object=} opt_obj The object to be used as the value of this within
 *     {@code func}.
 */
DocHelper.TreeNode.prototype.forEachDecendant = function(func, opt_obj) {
  this.getChildren().forEach(function(child) {
    func.call(opt_obj, child);
    child.forEachDecendant(func, opt_obj);
  });
};


// Exports the constructor.
module.exports = DocHelper;
