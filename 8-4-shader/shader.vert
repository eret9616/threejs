attribute float size;
varying vec3 vColor;
varying float vSize;

void main(){
    vSize = size;
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = vSize * 30.0;
}


