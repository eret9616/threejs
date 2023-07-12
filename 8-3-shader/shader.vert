/*
    基本语法规则：
    1. 大小写敏感
    2. 语句末尾必须要有分号
    3. main 函数
    4. 支持单行注释及多行注释
    5. 基本数据类型：数值和布尔值，数值只有整形 int和浮点型 float，布尔值只有true和false
    6. 复杂的数据类型：矢量数据 vec3, vec3, vec4等等

    变量声明
    1 attribute
    2 varying 用来从顶点着色器向片元着色器传递数据
    3 uniform 全局变量

    逐顶点，逐片元
    逐顶点：每个顶点都要执行一次顶点着色器主函数main中的程序
    逐片元：设置每个像素的颜色 gl_GragColor：片元像素的颜色，vec4(r,g,b,a)
*/

attribute float alpha;
attribute float size;
varying vec3 vColor;
varying float vApha;

void main(){
    vColor = color;
    vApha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);   
    // 投影变换矩阵 * 模型视图矩阵 * 顶点坐标 =》将3D空间坐标转换为屏幕空间坐标
    gl_PointSize = size * 10.0;
}


