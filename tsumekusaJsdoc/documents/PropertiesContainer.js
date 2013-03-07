// This script licensed under the MIT.
// http://orgachem.mit-license.org


var tsumekusa = require('../../tsumekusa');
var MembersContainer = require('./MembersContainer');
var PropertyContainer = require('./PropertyContainer');



/**
 * A class for properties container.
 * @param {jsdoc.Doclet} parent Symbol contains {@code members}.
 * @param {Array.<jsdoc.Doclet>} members Member symbols.
 * @param {string} caption Caption of the container such as {@code
 *     'Static members'}.
 * @param {string} modifier Modifier of the reference ID.
 * @param {?tsumekusaJsdoc.documents.DocumentHelper=} opt_docHelper Optional
 *     document helper.
 * @param {?tsumekusaJsdoc.references.ReferenceHelper=} opt_refHelper Optional
 *     reference helper.
 * @constructor
 * @extends {tsumekusaJsdoc.documents.MembersContainer}
 */
var PropertiesContainer = function(parent, members, caption, modifier,
    opt_docHelper, opt_refHelper) {
  MembersContainer.call(this, parent, members, caption, modifier, opt_docHelper,
    opt_refHelper);
};
tsumekusa.inherits(PropertiesContainer, tsumekusaJsdoc.documents.MembersContainer);


/** @override */
PropertiesContainer.prototype.createMemberContainer = function(symbol) {
  return new PropertyContainer(symbol, this.getDocumentHelper(),
      this.getReferenceHelper());
};