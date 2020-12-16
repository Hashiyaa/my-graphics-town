#extension GL_OES_standard_derivatives : enable

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

/* colors for the checkerboard */
uniform vec3 light;
uniform vec3 dark;

/* number of checks over the UV range */
uniform float checks;

void main()
{
    float x = v_uv.x * checks;
    float y = v_uv.y * checks;

    float xc = floor(x);
    float yc = floor(y);

    float dx = x - xc - 0.5;
    float dy = y - yc - 0.5;

    float d = max(abs(dx), abs(dy));

    float a = fwidth(d);
    float dc = smoothstep(0.5-a, 0.5+a, d);
    
    if (mod(xc + yc, 2.0) == 1.0) {
        dc = 1.0 - dc;
    }

    gl_FragColor = vec4(mix(light, dark, dc), 1.0);
}