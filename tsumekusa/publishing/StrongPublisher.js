// This script licensed under the MIT.
// http://orgachem.mit-license.org


var basePath = '../../tsumekusa';
var tsumekusa = require(basePath);


/**
 * A singleton class for strong publisher.
 * @constructor
 * @implements {tsumekusa.publishing.IContentPublisher}
 */
var StrongPublisher = function() {};
tsumekusa.addSingletonGetter(StrongPublisher);


/** @override */
StrongPublisher.prototype.publish = function(strong) {
  console.warn('The output mode do not support a strong: ' + strong.getCode());
  return strong.getContent();
};
