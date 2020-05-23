import WebGLCanvas from './webgl-canvas';
import Scroller from './scroller';

class Demo {
  constructor() {
    this.scroller = new Scroller({
      target: document.querySelector('#js-container')
    });
    this.canvas = new WebGLCanvas({});
  }
}

new Demo();