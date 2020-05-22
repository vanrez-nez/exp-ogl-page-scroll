import OGLApp from './base/ogl-app';
import { Program, Mesh, Texture } from 'ogl';
import imageTest from '../assets/image_test.jpg';
import ImagePlane from './image-plane';

class Demo {
  constructor() {
    this.app = new OGLApp({
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: false,
    });
    this.setup();
    this.app.start();
  }

  setup() {
    const { gl, scene, camera } = this.app;
    camera.position.set(0, 0, 1);
    camera.lookAt([0, 0, 0]);
    const images = [];
    const img = new ImagePlane(gl, { src: imageTest });
    img.setParent(scene);
    this.img = img;
  }

  onResize(width, height) {
    console.log('Resize', width, height);
  }

  onRender({ elapsedTime, delta, scene, camera, renderer }) {
    this.img.update(camera);
    renderer.render({ scene, camera });
  }
}

new Demo();