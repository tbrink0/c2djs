/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

exports.POSITIONING_ABSOLUTE = 'absolute';
exports.POSITIONING_RELATIVE = 'relative';

exports.Point = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
};

exports.Border = class {
  /**
   * Create a new Border object to be assigned to an Shape.border property
   * @param {string} color The border color
   * @param {number} width The border width
   */
  constructor(color = '#000', width = 1) {
    this.color = color;
    this.width = width;
  }
};

exports.Shadow = class {
  /**
   * Creates a new Shadow object to be assigned to an Shape.shadow property
   * @param {string} color         The shadow color
   * @param {number} blur          The blur amount; context.shadowBlur
   * @param {number} offsetX       Shadow offset x; context.shadowOffsetX
   * @param {number} offsetY       Shadow offset y; context.shadowOffsetY
   */
  constructor(color = '#000', blur = 0, offsetX = 0, offsetY = 0) {
    this.color = color;
    this.blur = blur;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const { Point, POSITIONING_ABSOLUTE, POSITIONING_RELATIVE } = __webpack_require__(0);

/**
 * This is the parent class for all shapes. It mostly
 * just provides a hierarchical foundation for the other shapes.
 * It also defines the base render() function.
 */
class Shape {
  /**
   * The constructor just defines some variables to null/default values.
   * @param {string} shapeName   The class name of the shape
   */
  constructor(shapeName) {
    this.children = [];
    /**
     * Each shape has its own context, which is
     * inherited from its parent (see appendChild()). This
     * behind-the-scenes ._ctx property is to falicitate
     * a getter/setter for the frontend .context property.
     */
    this._ctx = null;
    /**
     * The .positioning property determines whether coordinates
     * will be determined relative to the parent element (relative) or
     * relative to the canvas (absolute).
     */
    this.positioning = 'relative';
    this.pos = new Point(0, 0);
    this.parent = null;
    /**
     * Rotation values are in radians.
     */
    this.rotation = 0;
    /**
     * The default colors are defined here.
     * The border and shadow properties are null; if you desire to render a
     * border or shadow, assign a new instance of the Border/Shadow class
     * to these properties.
     */
    this.color = '#000000';
    this.border = null;
    this.shadow = null;
    /**
     * The ._shapeType is a programmatic way to determine what a
     * shape is.
     */
    this._shapeName = shapeName;
  }
  /**
   * This function appends a child to .children.
   */
  appendChild(child) {
    this.children.push(child);
    child.context = this.context;
    child.parent = this;
  }
  /**
   * Same as appendChild, but the child is inserted so that it has
   * the index specified.
   */
  insertChild(child, index) {
    this.children = this.children.slice(0, index).concat(child).concat(this.children.slice(index));
    child.context = this.context;
    child.parent = this;
  }
  /**
   * This setter function is called when the shape is added to a
   * parent; it simply sets its own ._ctx property and the .context
   * properties of all its children.
   */
  set context(ctx) {
    this._ctx = ctx;
    this.children.forEach(child => {
      child.context = ctx;
    });
  }
  get context() {
    return this._ctx;
  }
  /**
   * The render function calls _renderSelf() and render() for each
   * of this shape's children.
   * Because of the order in which everything is rendered, it ends
   * up that 2D stacking will occur in a slightly confusing order.
   * In this family tree:
   *            Scene
   *           /     \
   *     parent0      parent1
   *    /       \    /       \
   * child0 child1 child2 child3
   * The shapes will be rendered in this order:
   * Scene, parent0, child0, child1, parent1, child2, child3
   */
  render() {
    // Check if this shape has a context:
    if (this.context === null) {
      throw new Error('Shape has no context!');
      return;
    }
    // If we are rendering a Scene, clear() it first:
    if (this._shapeName === 'Scene') {
      this.clear();
    }
    // Call _renderSelf() if it exists (the check is for 
    // non-rendering shapes like Scene):
    if (this._renderSelf) {
      this._renderSelf();
    }
    // Render children:
    this.children.forEach(function (child) {
      child.render();
    });
  }
  /**
   * Function to get position relative to canvas.
   * It performs the positioning checks.
   * This position is what the shape must be drawn relative to.
   */
  getPos() {
    if (this.positioning === POSITIONING_RELATIVE) {
      let absPos = new Point();
      let parentAbsPos;
      if (this.parent) {
        parentAbsPos = this.parent.getPos();
      } else {
        parentAbsPos = new Point(0, 0);
      }
      absPos.x = parentAbsPos.x + this.pos.x;
      absPos.y = parentAbsPos.y + this.pos.y;
      return absPos;
    } else if (this.positioning === POSITIONING_ABSOLUTE) {
      return this.pos;
    } else {
      throw new Error(`'${this.positioning}' positioning does not exist!`);
    }
  }
  /**
   * This is called by a _renderSelf() function to position the context properly.
   */
  transformContext() {
    if (this._shapeName === 'Scene') {
      return;
    }
    this.parent.transformContext();
    /**
     * This just checks if we actually need to rotate anything.
     * (NEW in 1.3)
     */
    if (this.rotation !== 0) {
      var c = this.context,
          center = this.center;
      c.translate(center.x, center.y);
      c.rotate(this.rotation);
      c.translate(-center.x, -center.y);
    }
  }
}

module.exports = Shape;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * c2d.js v1.3
 * c2d.js is a low-level 2D canvas wrapper that makes working with simple shapes
 * and sprites simple and easy. It uses a heirarchical object-oriented approach
 * to creating and manipulating shapes.
 * Ideas/todo:
 *  - Add Text, Gradient, Polygon, Line, Arc, and Path (in order of importance) classes
 *  - Possibly introduce methods for transforming the coordinate matrix through
 *    the Scene class, or have some useful presets (e.g. designate the visible area
 *    as the 1st or 1st and 2nd quadrants of a Cartesian coordinate plane rather
 *    than the 4th).
 *  - Shadows and borders don't work together well (i.e. shadows are rendered on top of borders);
 *    try to fix this.
 */
(function (global) {
  'use strict';

  var c2d = {};

  c2d.Shape = __webpack_require__(1);

  var utils = __webpack_require__(0);
  c2d.POSITIONING_ABSOLUTE = utils.POSITIONING_ABSOLUTE;
  c2d.POSITIONING_RELATIVE = utils.POSITIONING_RELATIVE;
  c2d.Point = utils.Point;
  c2d.Shadow = utils.Shadow;
  c2d.Border = utils.Border;

  c2d.Circle = __webpack_require__(3);
  c2d.Rectangle = __webpack_require__(4);
  c2d.Image = __webpack_require__(5);

  global.c2d = c2d;
})(this);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(1);
const { Point } = __webpack_require__(0);

class Circle extends Shape {
  constructor(x, y, r) {
    super('Circle');
    // Position (in this class the position is in the centre of the circle)
    this.pos = new Point(x, y);
    // Radius
    this.r = r;
  }
  _renderSelf() {
    var pos = this.getPos(),
        c = this.context;
    c.save();
    this.transformContext();
    if (this.shadow) {
      c.shadowBlur = this.shadow.blur;
      c.shadowColor = this.shadow.color;
      c.shadowOffsetX = this.shadow.offsetX;
      c.shadowOffsetY = this.shadow.offsetY;
    }
    if (this.border) {
      c.beginPath();
      c.arc(pos.x, pos.y, this.r + this.border.width / 2, 0, 2 * Math.PI);
      c.closePath();
      c.strokeStyle = this.border.color;
      c.lineWidth = this.border.width;
      c.stroke();
    }
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(pos.x, pos.y, this.r, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.restore();
  }
  get center() {
    return this.getPos();
  }
}

module.exports = Circle;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(1);
const { Point } = __webpack_require__(0);

/**
 * Block comments from here to the end of the exports.Rectangle
 * class detail what is required in a new Shape class, using
 * Rectangle as an example.
 */
/**
 * All shapes must extend exports.Shape.
 */
// A simple Rectangle shape class
class Rectangle extends Shape {
  /** 
   * The constructor defines all the Shape's properties.
   * The constructor must call super(shapeName).
   * The only mandatory property that the constructor has to set
   * is .pos, which is set to a Point as explained below.
   */
  constructor(x, y, w, h) {
    /**
     * The shapeName that must be passed to the super() function
     * is just the class name (here, 'Rectangle').
     */
    super('Rectangle');
    /**
     * The position (.pos) in any shape is at a location determined
     * by the shape. This position is what children and the shape
     * itself are rendered relative to. In this case, the position
     * is in the top left corner of the visible rectangle (but inside
     * the border).
     * This is a mandatory property.
     */
    this.pos = new Point(x, y);
    /**
     * Other rendering properties can also be set, as shown here.
     */
    this.height = h;
    this.width = w;
  }
  /**
   * If you wish your shape to be rendered, you must have a
   * _renderSelf() function defined here, in your class definition.
   */
  _renderSelf() {
    /**
     * The conventions for context and position within _renderSelf()
     * are as shown here. This is both to avoid multiple function/
     * getter calls, as well as for brevity and simplicity.
     * Also, when rendering areas and borders, try to make the code
     * as simple and short as possible.
     */
    var pos = this.getPos(),
        c = this.context;
    /**
     * Save and restore the context as shown to avoid conflicts.
     * Make sure it is saved before you make any changes to it.
     */
    c.save();

    /**
     * Call this.transformContext() to rotate the context properly.
     * It must be called after you save the context and before you
     * draw anything.
     */
    this.transformContext();

    /**
     * Note that the shadow and border are drawn if they are not null
     */
    if (this.shadow) {
      c.shadowBlur = this.shadow.blur;
      c.shadowColor = this.shadow.color;
      c.shadowOffsetX = this.shadow.offsetX;
      c.shadowOffsetY = this.shadow.offsetY;
    }
    /**
     * Borders must be rendered immediately outside of the shape's area.
     * That is, they cannot overlap with the shape's area color, nor can
     * there be any gap between the border and the area.
     */
    if (this.border) {
      c.strokeStyle = this.border.color;
      c.lineWidth = this.border.width;
      c.strokeRect(pos.x - this.border.width / 2, pos.y - this.border.width / 2, this.width + this.border.width, this.height + this.border.width);
    }
    /**
     * Note that the area is drawn regardless of if the user wants it
     * there or not. If you want, you can check to see if the color is
     * transparent (as in the Image class) for performance reasons,
     * but that is not mandatory.
     */
    c.fillStyle = this.color;
    c.fillRect(pos.x, pos.y, this.width, this.height);
    c.restore();
  }
  /**
   * You must have a center getter that gives the centre of your object.
   * (using getPos() to get the absolute position)
   */
  get center() {
    var pos = this.getPos();
    return new Point(pos.x + this.width / 2, pos.y + this.height / 2);
  }
}

module.exports = Rectangle;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(1);
const { Point } = __webpack_require__(0);

class Image extends Shape {
  /**
   * The Image class allows Images to be drawn onto the Scene.
   * @param {object} img The image that will be drawn to the canvas
   * @param {number} x   x position
   * @param {number} y   y position
   * @param {number} w   Optional. Width to scale image to.
   * @param {number} h   Optional. Height to scale image to.
   */
  constructor(img, x, y, w, h) {
    super('Image');
    /**
     * The position in this class is in the top left.
     * Other than the fact that this class has an image capability,
     * it is almost identical to the Rectangle class.
     */
    this.pos = new Point(x, y);
    /**
     * Here we check if the image passed to the constructor is complete
     * (loaded). If it is not, send a warning to the console, but still
     * go ahead with setting this.image.
     * (unloaded images will not draw to the canvas)
     */
    if (img.complete === false) {
      console.warn('c2d.Image - HTMLImageElement not loaded! This may prevent image rendering.');
    }
    this.image = img;
    /**
     * If the height or width is undefined, set it to the image height/width.
     */
    if (typeof h === 'undefined') {
      h = img.height;
    }
    if (typeof w === 'undefined') {
      w = img.width;
    }
    this.height = h;
    this.width = w;
    /**
     * By default, set the color property (background color) to transparent.
     * It provides a way to set a solid background color for the image.
     */
    this.color = 'rgba(0, 0, 0, 0)';
  }
  _renderSelf() {
    var pos = this.getPos(),
        c = this.context;
    c.save();
    this.transformContext();
    if (this.shadow) {
      c.shadowBlur = this.shadow.blur;
      c.shadowColor = this.shadow.color;
      c.shadowOffsetX = this.shadow.offsetX;
      c.shadowOffsetY = this.shadow.offsetY;
    }
    // Only draw the background if it is not transparent
    if (this.color !== 'rgba(0, 0, 0, 0)') {
      c.fillStyle = this.color;
      c.fillRect(pos.x, pos.y, this.width, this.height);
    }
    if (this.border) {
      c.strokeStyle = this.border.color;
      c.strokeRect(pos.x - this.border.width / 2, pos.y - this.border.width / 2, this.width + this.border.width, this.height + this.border.width);
    }
    c.drawImage(this.image, pos.x, pos.y, this.width, this.height);
    c.restore();
  }
  get center() {
    var pos = this.getPos();
    return new Point(pos.x + this.width / 2, pos.y + this.height / 2);
  }
}

module.exports = Image;

/***/ })
/******/ ]);