precision highp float;
precision highp int;
uniform float uTime;
uniform sampler2D tMap;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 normal = normalize(vNormal);
    vec4 texel = texture2D(tMap, vUv);
    texel.rgb *= vec3(1.0, 0.5, 0.5);
    gl_FragColor = texel;
}