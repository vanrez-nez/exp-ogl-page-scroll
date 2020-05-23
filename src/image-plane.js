import { Plane, Program, Mesh, Texture, Vec2 } from 'ogl';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import { loadTexture } from './base/utils';
import PixelTransform from './pixel-transform';


export default class ImagePlane {

  constructor(gl, { src }) {
    this.gl = gl;
    this.loaded = false;
    this.src = src;
    this.naturalSize = new Vec2();
    this.texture = new Texture(gl);
    this.plane = this.createPlane();
    this.pixelTransform = new PixelTransform(this.plane);
    this.load();
  }

  async load() {
    const { src, texture } = this;
    this.loaded = false;
    await loadTexture(texture, src);
    const { width, height } = texture.image;
    this.naturalSize.set(width, height);
    if (this.size.equals([0, 0])) {
      this.size.copy(this.naturalSize);
    }
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

  update({ renderer, camera }) {
    const { pixelTransform } = this;
    pixelTransform.viewport.set(renderer.width, renderer.height);
    pixelTransform.update(camera);
  }

  get size() {
    return this.pixelTransform.size;
  }

  get position() {
    return this.pixelTransform.position;
  }

  get scale() {
    return this.pixelTransform.scale;
  }
}