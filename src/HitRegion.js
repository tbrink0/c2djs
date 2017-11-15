const Shape = require('./Shape');
const { Point } = require('./utils');

module.exports = class HitRegion extends Shape {
  /**
   * HitRegion constructor.
   * @param {Number} x Distance from left
   * @param {Number} y Distance from top
   * @param {Number} w Width of rectangle
   * @param {Number} h Height of rectangle
   */
  constructor(x = 0, y = 0, w = 0, h = 0) {
    super('HitRegion');
    this.pos = new Point(x, y);
    this.height = h;
    this.width = w;

    this.handlers = [];
  }
  addEventListener(eventType, handler) {
    function Handler(e, h) {
      this.eventType = e;
      this.handler = h;
    }

    this.handlers.push(new Handler(eventType, handler));
  }
  listen() {
    if (!this.context) throw new Error('Context is not defined!');

    this.handlers.forEach(h => {
      if (h.eventType === 'c2d-mouseinout') {
        this.context.canvas.addEventListener('mousemove', e => {

          if (typeof window._c2dHandler_wasIn === 'undefined') {
            window._c2dHandler_wasIn = false;
          }

          let pos = this.getPos();

          let isIn = (e.x > pos.x && e.x < pos.x + this.width && e.y > pos.y && e.y < pos.y + this.height);

          if (window._c2dHandler_wasIn && !isIn) {
            h.handler(e, 'mouseout');
          } else if (!window._c2dHandler_wasIn && isIn) {
            h.handler(e, 'mousein');
          }
          window._c2dHandler_wasIn = isIn;
        });
      } else {
        this.context.canvas.addEventListener(h.eventType, e => {
          let pos = this.getPos();
          if (e.x > pos.x && e.x < pos.x + this.width && e.y > pos.y && e.y < pos.y + this.height) {
            h.handler(e);
          }
        });
      }
    });
  }
}