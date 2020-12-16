/* pass interpolated variables to the fragment */
varying vec2 v_uv;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
varying vec3 v_normal;

uniform vec2 point;
uniform float height;

void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;

    float dx = 1.0 - step(uv.x, point.x);
    float dy = 1.0 - step(uv.y, point.y);
    
    float d = step(dx + dy, 0.5);

    vec3 pos = position;
    pos += (d * height) * normal;
    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    v_normal = normalMatrix * normal;
}