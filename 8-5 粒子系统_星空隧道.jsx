import { useEffect } from 'react';
import * as THREE from 'three';
import vertShader from './8-5-shader/shader.vert'
import fragShader from './8-5-shader/shader.frag'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'


const Page = () => {
  useEffect(() => {
    const $ = {
      createScene() {
        const canvas = document.getElementById('c');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        // 创建3D场景对象
        const scene = new THREE.Scene();
        this.scene = scene;
      },
      createLights() {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures(){
        const manager = new THREE.LoadingManager();
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
          console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        manager.onLoad = function ( ) {
          console.log( 'Loading complete!');
        };
        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
          console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        manager.onError = function ( url ) {
          console.log( 'There was an error loading ' + url );
        };
        const textureLoader = new THREE.TextureLoader(manager)
        const texture =  textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg')

        textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg')

        this.texture = texture
      },
      // 生成两数之间的随机数
      random:(min,max)=> min + Math.random() * (max-min),
      createGeometry(numbers){
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(numbers*3)
        // 创建numbers个顶点
        for(let i =0;i<numbers;i++){
          // 三个一组赋值r
          positions[i*3] = Math.sin(i)// 0 ~ 60
          positions[i*3 + 1] = Math.cos(i)
          positions[i*3 + 2] = this.random(-50,0) // -50 - 0
        }
        geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
        // alpha就是自定义属性
        geometry.computeBoundingSphere()
        return geometry
      },
      createObjects(numbers) {
        const texture = new THREE.TextureLoader().load('public/textures/star_1.png')
        const material = new THREE.ShaderMaterial({
          vertexShader:vertShader,
          fragmentShader:fragShader,
          transparent:true,
          depthTest:true, // 深度测试
          depthWrite:false, // 材质是否对深度缓冲区有影响 
          blending: THREE.AdditiveBlending,
          uniforms:{
            color:{
              value: new THREE.Color(0xffffff)
            },
            pointTexture:{
              value: texture
            },
            fogColor:{
              value: new THREE.Color(0x000)
            },
            fogNear:{
              value:0
            },
            fogFar:{
              value:20
            }
          }
        })
        const point = new THREE.Points(this.createGeometry(numbers),material)
        this.point = point
        this.scene.add(point)
      },
      createCamera() {
        // 创建相机对象
        const size = 4
        const orthoCamera = new THREE.OrthographicCamera(
          -size, size, size/2, -size/2,0.1, 1000); // 画布的宽高比
        // 设置相机位置
        orthoCamera.position.set(0, 0,0); // x轴2 y轴2 z轴34
        // 设置相机朝向
        orthoCamera.lookAt(this.scene.position);
        // 将相机添加到场景中
        this.scene.add(orthoCamera);
        this.orthoCamera = orthoCamera;
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(0,0,0)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;
      },
      params:{
        particles:1000,
        vertexColors:true
      },
      datGui(){
        const gui = new dat.GUI();

        gui.add(this.params,'vertexColors').name('顶点着色').onChange(val=>{
          console.log(this.point.material);
          this.point.material.vertexColors = val
          this.point.material.needsUpdate = true
        })

        gui.add(this.params,'particles',1,5000,1).name('粒子数量').onChange((val)=>{
          // 先销毁旧的粒子
          console.log(this.scene.children);
          const point = this.scene.children.find(child=>child.isPoints)
          // 销毁point对象
          point.removeFromParent()

          // 重新生成粒子系统
          this.createObjects(val)
        })

      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        // 创建辅助平面
        this.scene.add(axesHelper);
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
        });
        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(window.devicePixelRatio || 1);

        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
        this.renderer = renderer;
      },
      controls() {
        // 创建轨道控制器
        const orbitControls = new OrbitControls(this.camera, this.canvas);
        orbitControls.enableDamping = true;
        this.orbitControls = orbitControls;
      },
      clock:new THREE.Clock(),
      tick() {
        const point = this.scene.children.find(x=> x.type === 'Points')
        const { attributes:attrs} = point.geometry

        point.rotation.z += 0.01
        for(let i = 0;i<attrs.position.array.length;i++){
          if( i % 3 === 2){
            // 判断当前粒子是否在相机后面
            const z = attrs.position.array[i]
            const distance = z - this.camera.position.z
            if(distance >= 0){
              attrs.position.array[i] = -50 + Math.random() * 2
            }
            // 移动粒子z轴坐标
            attrs.position.array[i] += 0.05
          }
        }

        attrs.position.needsUpdate = true 

        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView() {
        window.addEventListener('resize', () => {
          // camera.aspect = window.innerWidth / window.innerHeight;
          // camera.updateProjectionMatrix();
          // renderer.setSize(window.innerWidth, window.innerHeight);
        });
      },
      init(){
        this.createScene()
        this.createLights()
        this.loadTextures()
        this.createObjects(this.params.particles)
        this.createCamera()
        this.helpers()
        this.render()
        this.controls()
        this.tick()
        this.fitView()
        this.datGui()
      }
    };
    $.init()
  }, []);


  return (
    <>
      <canvas id="c" />;
    </>
  );
};

export default Page;
