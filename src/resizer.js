import { Vec2 } from 'ogl';

export function getSizeToCover(width, height, maxWidth, maxHeight) {
  var ratio = Math.max(maxWidth / width, maxHeight / height);
  return [ width * ratio, height * ratio ];
}

export function visibleHeightAtZDepth(camera, depth = 0) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
}

export function visibleWidthAtZDepth( camera, depth = 0 ) {
  const height = visibleHeightAtZDepth( camera, depth );
  return height * camera.aspect;
}

export default class Resizer {
  constructor(obj) {
    this.obj = obj;
    this.scale = new Vec2(1, 1);
  }

  setSize(width, height) {
    this.scale.set(width, height);
    this.update();
  }

  update(camera) {
    const { obj, scale } = this;
    const w = visibleWidthAtZDepth(camera, obj.position.z);
    const h = visibleHeightAtZDepth(camera, obj.position.z);
    obj.scale.x = w * scale.x;
    obj.scale.y = h * scale.y;
  }
}