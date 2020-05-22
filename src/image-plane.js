import { Plane, Program, Mesh, Texture } from 'ogl';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import { loadTexture } from './base/utils';

export default class ImagePlane {

  constructor(gl, { src }) {
    this.gl = gl;
    this.loaded = false;
    this.src = src;
    this.texture = new Texture(gl);
    this.plane = this.createPlane();
    this.load();
  }

  async load() {
    const { src, texture } = this;
    this.loaded = false;
    await loadTexture(texture, src);
    this.loaded = true;
  }

  createPlane() {
    const { gl, texture } = this;
    const uniforms = { tMap: { value: texture } };
    const program = new Program(gl, { vertex, fragment, uniforms });
    const geometry = new Plane(gl, { width: 0.1, height: 0.1 });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.position.set(0, 0, 0);
    return mesh;
  }

  setParent(parentTransform) {
    this.plane.setParent(parentTransform);
  }

  update(scene, camera) {
  }
}