const Shape = require('./Shape');
const { Point } = require('./utils');

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
  constructor (x, y, w, h) {
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
   * The renderSelf() function must be included if you want your shape to be rendered.
   * @param {CanvasRenderingContext2D} c The canvas context.
   * @param {Point} pos A point designating where the Shape must be drawn.
   */
  renderSelf (c, pos) {
    /**
     * Use the naming conventions above (c = context, pos = absolute position)
     * to avoid confusion.
     * Also, when rendering areas and borders, try to make the code as simple
     * and short as possible.
     * The context has already been saved and transformed, and will be restored
     * after this function returns.
     */
    
    /**
     * The shadow and border here are drawn if they are not null.
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
      c.strokeRect(pos.x - (this.border.width / 2), pos.y - (this.border.width / 2), this.width + this.border.width, this.height + this.border.width);
    }
    /**
     * The area is drawn regardless of if the user wants it there or not.
     */
    c.fillStyle = this.color;
    c.fillRect(pos.x, pos.y, this.width, this.height);
  }
  /**
   * You must have a center getter that gives the centre of your object.
   * (using getPos() to get the absolute position)
   */
  get center () {
    let pos = this.getPos();
    return new Point(pos.x + this.width / 2, pos.y + this.height / 2);
  }
}

module.exports = Rectangle;