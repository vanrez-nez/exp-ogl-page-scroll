import WebGLCanvas from './webgl-canvas';
import Scroller from './scroller';

class Demo {
  constructor() {
    this.scroller = new Scroller({
      target: document.querySelector('#js-container'),
      onScrollCallback: this.onScroll.bind(this),
    });
    this.canvas = new WebGLCanvas({});
    this.canvas.addDomImages(document.querySelectorAll('img'));
    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();
  }

  onScroll(top) {
    const { canvas } = this;
    canvas.scrollOffset.y = -top;
  }

  onResize() {
    const { canvas, scroller } = this;
    scroller.firstUpdate = true;
    requestAnimationFrame(() => {
      canvas.updateDomDimensions(true);
    });
  }
}

new Demo();