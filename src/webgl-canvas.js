import OGLApp from './base/ogl-app';
//import imageTest from '../assets/image_test.jpg';
import ImagePlane from './image-plane';

export default class WebGLCanvas {
  constructor({ imageElements = [] }) {
    this.imagePlanes = [];
    this.imageElements = imageElements;
    this.app = new OGLApp({
      canvas: document.querySelector('#gl-canvas'),
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: false,
    });
    this.initImagePlanes();
    this.setup();
    this.app.start();
  }

  initImagePlanes() {
    const { gl, scene, imagePlanes, imageElements } = this;
    imageElements.forEach(el => {
      // const plane = new ImagePlane(gl, { src: imageTest });
      // plane.size.set(100, 100);
      // plane.position.set(100, 100);
      // plane.scale.set(1.5, 1.5);
      // plane.setParent(scene);
      // imagePlanes.push(plane);
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
    const { imagePlanes } = this;
    for (let i = 0; i < imagePlanes.length; i++) {
      imagePlanes[i].update({ render, camera });
    }
    renderer.render({ scene, camera });
  }
}
