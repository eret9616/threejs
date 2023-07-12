uniform vec3 color;
uniform sampler2D pointTexture;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main(){
    vec4 color = vec4(color,1.0) * texture2D(pointTexture, gl_PointCoord);    

    gl_FragColor = color;

    float depth =   gl_FragCoord.z / gl_FragCoord.w; // 计算片元到相机的距离
     float fogFactor = smoothstep(fogNear,fogFar,depth); 
     // 计算0 - 1 之间的数值，这个值越接近1，表示当前片元越靠近雾的结束位置（也就是我们的相机）
     // 反之越靠近雾的起始位置，雾的强度与雾化因子之间的关联关系
    gl_FragColor.rgb = mix(gl_FragColor.rgb,fogColor,fogFactor); // 将当前片元的颜色与雾的颜色进行混合，从而实现雾化效果
}

