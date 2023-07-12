void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    vec4 worldPosition = modelMatrix * vec4(position,1.0); // 每个顶点的世界坐标
    vec3 viewVector = cameraPosition - worldPosition.xyz; // 计算相机位置与当前点坐标之间的向量
    float cameraDistance = length(viewVector); // 计算当前点到相机的距离
    gl_PointSize = 100.0 / cameraDistance;
}
