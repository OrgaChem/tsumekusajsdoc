// This script licensed under the MIT.
// http://orgachem.mit-license.org


var tsumekusa = require('../../tsumekusa')
var Container = require('./Container');
var VimHelpDocumentPublisher = require('./VimHelpDocumentPublisher');



/**
 * A class for document.
 * @param {string} caption Caption.
 * @param {string} filename File name.
 * @param {?string=} opt_version Optional version identifier.
 * @param {?Date=} opt_date Optional date object.
 * @constructor
 * @extends {tsumekusa.publishing.Container}
 */
var Document = function(caption, filename, opt_version, opt_date) {
  Container.call(this, caption, filename, opt_refHelper);
  this.version_ = opt_version;
  this.date_ = opt_date || new Date();
};
tsumekusa.inherits(Document, Container);


/**
 * Default content publisher.
 * @type {tsumekusa.publishing.ContentPublisher}
 */
Document.publisher = VimHelpDocumentPublisher.getInstance();


/**
 * Returns a date object.
 * @return {Date} Date object.
 */
Document.prototype.getDate = function() {
  return this.date_;
};


/**
 * Returns a version identifier.
 * @return {string} Version identifier.
 */
Document.prototype.getVersion = function() {
  return this.version_ || 'n/a';
};


// Export the constructor
module.exports = Document;
