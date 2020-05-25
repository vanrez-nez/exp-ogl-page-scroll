import { Vec2 } from 'ogl';
import OGLApp from './base/ogl-app';
import ImagePlane from './image-plane';

export default class WebGLCanvas {
  constructor() {
    this.scrollingObjects = [];
    this.scrollOffset = new Vec2();
    this.app = new OGLApp({
      canvas: document.querySelector('#gl-canvas'),
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: false,
    });
    this.setup();
    this.app.start();
  }

  addDomImages(images) {
    const { app, scrollingObjects } = this;
    images.forEach(el => {
      const plane = new ImagePlane(app.gl, { src: el.src });
      plane.setParent(app.scene);
      scrollingObjects.push({
        mesh: plane,
        domElement: el,
        initialPosition: new Vec2(),
      });
    });
    this.updateDomDimensions();
  }

  updateDomDimensions(recomputeStyle = false) {
    /*
      TODO: considering the parent offset (HTMLElement.OffsetParent) recursively
      could handle edge cases where nesting and borders displace the
      children positions.
    */
    const { scrollingObjects } = this;
    scrollingObjects.forEach(obj => {
      const { mesh, domElement, initialPosition } = obj;
      const { width, height, top, left } = domElement.getBoundingClientRect();
      const x = left + window.scrollX;
      const y = top + window.scrollY;
      mesh.size.set(width, height);
      initialPosition.set(x, y);

      /*
        Handle clases where elements have CSS box-size property set to border-box
        HTMLElement.getBoundingClientRect wont report these offsets.
      */
      if (recomputeStyle) {
        const style = window.getComputedStyle(domElement);
        if ( style.boxSizing === 'border-box') {
          const { paddingLeft, paddingRight, paddingTop, paddingBottom } = style;
          const wPad = Number.parseFloat(paddingLeft) + Number.parseFloat(paddingRight);
          const hPad = Number.parseFloat(paddingTop) + Number.parseFloat(paddingBottom);
          const w = width - wPad;
          const h = height - hPad;
          mesh.size.set(w, h);
          initialPosition.set(x + wPad / 2, y + hPad / 2);
        }
      }
    });
  }

  setup() {
    const { camera } = this.app;
    camera.position.set(0, 0, 1);
    camera.lookAt([0, 0, 0]);
  }

  onResize(width, height) {
    // console.log('Resize', width, height);
  }

  onRender({ elapsedTime, delta, scene, camera, renderer }) {
    const { scrollingObjects, scrollOffset } = this;
    for (let i = 0; i < scrollingObjects.length; i++) {
      const { mesh, initialPosition } = this.scrollingObjects[i];
      mesh.position.copy(initialPosition).add(scrollOffset)
      mesh.update({ renderer, camera });
    }
    renderer.render({ scene, camera });
  }
}
