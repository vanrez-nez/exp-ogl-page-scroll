import { Plane, Program, Mesh, Texture } from 'ogl';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import { loadTexture } from './base/utils';
import Resizer from './resizer';

export default class ImagePlane {

  constructor(gl, { src }) {
    this.gl = gl;
    this.loaded = false;
    this.src = src;
    this.width = 0;
    this.height = 0;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.texture = new Texture(gl);
    this.plane = this.createPlane();
    this.resizer = new Resizer(this.plane);
    this.load();
  }

  async load() {
    const { src, texture } = this;
    this.loaded = false;
    await loadTexture(texture, src);
    const { width, height } = texture.image;
    this.naturalWidth = width;
    this.naturalHeight = height;
    this.width = width;
    this.height = height;
    this.loaded = true;
  }

  createPlane() {
    const { gl, texture } = this;
    const uniforms = { tMap: { value: texture } };
    const program = new Program(gl, { vertex, fragment, uniforms });
    const geometry = new Plane(gl, { width: 1, height: 1 });
    const mesh = new Mesh(gl, { geometry, program });
    return mesh;
  }

  setParent(parentTransform) {
    this.plane.setParent(parentTransform);
  }

  update(camera) {
    this.resizer.update(camera);
  }
}