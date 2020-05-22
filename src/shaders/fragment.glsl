precision highp float;
precision highp int;
uniform float uTime;
uniform sampler2D tMap;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
    vec3 normal = normalize(vNormal);
    gl_FragColor = texture2D(tMap, vUv);
}