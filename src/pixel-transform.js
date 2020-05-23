import { Vec2 } from 'ogl';

function visibleHeightAtZDepth(camera, distance = 0) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (distance < cameraOffset) distance -= cameraOffset;
  else distance += cameraOffset;
  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180;
  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(distance);
}

function getFrustumDimensions(camera, distance) {
  const h = visibleHeightAtZDepth(camera, distance);
  return [h * camera.aspect, h];
}

export default class PixelTransform {
  constructor(obj) {
    this.target = obj;
    this.position = new Vec2();
    this.size = new Vec2();
    this.scale = new Vec2(1);
    this.viewport = new Vec2();
    this.frustumRect = new Vec2();
  }

  /**
   * Updates the frustum rect with the given camera and target's z position
   * @param {object} camera Projection camera used to render
   */
  updateFrustumRect(camera) {
    const { target, frustumRect } = this;
    const [x, y] = getFrustumDimensions(camera, target.position.z);
    frustumRect.set(x, y);
  }

  updateSize() {
    const { target, size, scale, frustumRect, viewport } = this;
    const scaleX = size.x / viewport.x;
    const scaleY = size.y / viewport.y;
    target.scale.x = frustumRect.x * scaleX * scale.x;
    target.scale.y = frustumRect.y * scaleY * scale.y;
  }

  updatePosition() {
    const { target, position, frustumRect, viewport } = this;
    const { scale } = target;
    const halfScaleX = scale.x * 0.5;
    const halfScaleY = scale.y * 0.5;
    const posX = position.x / viewport.x - 0.5;
    const posY = -position.y / viewport.y + 0.5;
    target.position.x = posX * frustumRect.x + halfScaleX;
    target.position.y = posY * frustumRect.y - halfScaleY;
  }

  update(camera) {
    this.updateFrustumRect(camera);
    this.updateSize();
    this.updatePosition();
  }
}
