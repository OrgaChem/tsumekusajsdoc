// This script licensed under the MIT.
// http://orgachem.mit-license.org


var tsumekusaPath = '../../tsumekusa';
var tsumekusa = require(tsumekusaPath);
var Document = require(tsumekusaPath + '/contents/Document');

var basePath = '../../tsumekusaJsdoc';
var SymbolDocument = require(basePath + '/documents/SymbolDocument');
var StaticMethodsContainer = require(basePath +
    '/documents/StaticMethodsContainer');
var InstanceMethodsContainer = require(basePath +
    '/documents/InstanceMethodsContainer');
var StaticPropertiesContainer = require(basePath +
    '/documents/StaticPropertiesContainer');
var InstancePropertiesContainer = require(basePath +
    '/documents/InstancePropertiesContainer');



/**
 * A class for document explains a class.
 * @param {jsdoc.Doclet} symbol Class symbol.
 * @param {?Array.<tsumekusa.dom.Paragraph>=} opt_topContents Optional top
 *     contents.
 * @param {?string=} opt_version Optional version identifier.
 * @param {?Date=} opt_date Optional date object.
 * @param {?tsumekusaJsdoc.documents.DocumentHelper=} opt_docHelper Optional
 *     document helper.
 * @param {?tsumekusaJsdoc.references.ReferenceHelper=} opt_refHelper Optional
 *     reference helper.
 * @constructor
 * @extends {tsumekusaJsdoc.documents.SymbolDocument}
 */
var ClassDocument = function(symbol, opt_topContents, opt_version, opt_date,
    opt_docHelper, opt_refHelper) {
  SymbolDocument.call(this, symbol, ClassDocument.CAPTION, opt_topContents,
      opt_version, opt_date, opt_docHelper, opt_refHelper);
};
tsumekusa.inherits(ClassDocument, SymbolDocument);



// TODO: Adapt mutliple languages.
/**
 * Default caption for a class document.
 * @const
 * @type {string}
 */
ClassDocument.CAPTION = 'Class';


/** @override */
ClassDocument.prototype.publish = function() {
  // TODO: Aboid lazy members setting. Or apply builder pattern.
  var document = this.getContent();
  var symbol = this.getSymbol();

  var staticMethods = this.getStaticMethods();
  var staticProperties = this.getStaticProperties();
  var instanceMethods = this.getInstanceMethods();
  var instanceProperties = this.getInstanceProperties();

  if (staticMethods && staticMethods.length > 0) {
    var staticMethodsContainer = this.createStaticMethodsContainer();
    document.appendSubContainer(staticMethodsContainer.getContent());
  }
  if (staticProperties && staticProperties.length > 0) {
    var staticPropertiesContainer = this.createStaticPropertiesContainer();
    document.appendSubContainer(staticPropertiesContainer.getContent());
  }
  if (instanceMethods && instanceMethods.length > 0) {
    var instanceMethodsContainer = this.createInstanceMethodsContainer();
    document.appendSubContainer(instanceMethodsContainer.getContent());
  }
  if (instanceProperties && instanceProperties.length > 0) {
    var instancePropertiesContainer = this.createInstancePropertiesContainer();
    document.appendSubContainer(instancePropertiesContainer.getContent());
  }

  return SymbolDocument.prototype.publish.call(this);
};


/**
 * Sets an array of static method doclets.
 * @param {Array.<jsdoc.Doclet>} symbols Static method symbols.
 */
ClassDocument.prototype.setStaticMethods = function(symbols) {
  if (this.staticMethods_) {
    throw Error('Static methods were already set.');
  }
  this.staticMethods_ = symbols;
};


/**
 * Sets an array of static method doclets.
 * @return {Array.<jsdoc.Doclet>} Static method symbols.
 * @protected
 */
ClassDocument.prototype.getStaticMethods = function() {
  return this.staticMethods_;
};


/**
 * Sets an array of instance method doclets.
 * @param {Array.<jsdoc.Doclet>} symbols Instance method symbols.
 */
ClassDocument.prototype.setInstanceMethods = function(symbols) {
  if (this.instanceMethods_) {
    throw Error('Instance methods were already set.');
  }
  this.instanceMethods_ = symbols;
};


/**
 * Sets an array of instance method doclets.
 * @return {Array.<jsdoc.Doclet>} Instance method symbols.
 * @protected
 */
ClassDocument.prototype.getInstanceMethods = function() {
  return this.instanceMethods_;
};


/**
 * Sets an array of static property doclets.
 * @param {Array.<jsdoc.Doclet>} symbols Static property symbols.
 */
ClassDocument.prototype.setStaticProperties = function(symbols) {
  if (this.staticProperties_) {
    throw Error('Static properties were already set.');
  }
  this.staticProperties_ = symbols;
};


/**
 * Sets an array of static property doclets.
 * @return {Array.<jsdoc.Doclet>} Static property symbols.
 * @protected
 */
ClassDocument.prototype.getStaticProperties = function() {
  return this.staticProperties_;
};


/**
 * Sets an array of instance property doclets.
 * @param {Array.<jsdoc.Doclet>} symbols Instance property symbols.
 */
ClassDocument.prototype.setInstanceProperties = function(symbols) {
  if (this.instanceProperties_) {
    throw Error('Instance properties were already set.');
  }
  this.instanceProperties_ = symbols;
};


/**
 * Sets an array of instance property doclets.
 * @return {Array.<jsdoc.Doclet>} Instance property symbols.
 * @protected
 */
ClassDocument.prototype.getInstanceProperties = function() {
  return this.instanceProperties_;
};


/**
 * Creates a container explains static methods of the class.
 * @return {tsumekusaJsdoc.documents.StaticMethodsContainer} Static methods
 *     container.
 * @protected
 */
ClassDocument.prototype.createStaticMethodsContainer = function() {
  return new StaticMethodsContainer(this.getSymbol(), this.getStaticMethods(),
      this.getDocumentHelper(), null, this.getReferenceHelper());
};


/**
 * Creates a container explains instance methods of the class.
 * @return {tsumekusaJsdoc.documents.InstanceMethodsContainer} Instance methods
 *     container.
 * @protected
 */
ClassDocument.prototype.createInstanceMethodsContainer = function() {
  return new InstanceMethodsContainer(this.getSymbol(),
      this.getInstanceMethods(), null, this.getDocumentHelper(),
      this.getReferenceHelper());
};


/**
 * Creates a container explains static properties of the class.
 * @return {tsumekusaJsdoc.documents.StaticPropertiesContainer} Static
 *     properties container.
 * @protected
 */
ClassDocument.prototype.createStaticPropertiesContainer = function() {
  return new StaticPropertiesContainer(this.getSymbol(),
      this.getStaticProperties(), null, this.getDocumentHelper(),
      this.getReferenceHelper());
};


/**
 * Creates a container explains instance properties of the class.
 * @return {tsumekusaJsdoc.documents.InstancePropertiesContainer} Instance
       properties container.
 * @protected
 */
ClassDocument.prototype.createInstancePropertiesContainer = function() {
  return new InstancePropertiesContainer(this.getSymbol(),
      this.getInstanceProperties(), null, this.getDocumentHelper(),
      this.getReferenceHelper());
};


// Exports the constructor.
module.exports = ClassDocument;
