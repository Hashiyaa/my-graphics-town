// the vertex information
varying vec3 v_normal;

// note that this is in VIEW COORDINATES
const vec3 baseColor = vec3(1,0,0);
const vec3 lightDir = vec3(0,1,0);
const vec3 ambient = vec3(0.1,0.1,0.1);

void main()
{
    // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);

    // deal with two sided lighting
    float lightColor = abs(dot(nhat, lightDir));

    gl_FragColor = vec4(lightColor*baseColor+ambient,1);
}