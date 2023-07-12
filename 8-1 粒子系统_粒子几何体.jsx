import { useEffect } from 'react';
import * as THREE from 'three';
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
        debugger;
  

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
      createObjects() {
          const material = new THREE.PointsMaterial({
            color: 0xffffff * Math.random(),
            size:5,
            sizeAttenuation:false // 指定点的大小是否因相机的深度而衰减（仅限于透视相机
          })
          const sphere = new THREE.Points(new THREE.SphereGeometry(4,32,32),material)
          sphere.position.x = 0
          this.scene.add(sphere)
      },
      createCamera() {
        // 创建相机对象
        const size = 4
        const orthoCamera = new THREE.OrthographicCamera(
          -size, size, size/2, -size/2,0.1, 100); // 画布的宽高比
        // 设置相机位置
        orthoCamera.position.set(2, 2, 3); // x轴2 y轴2 z轴34
        // 设置相机朝向
        orthoCamera.lookAt(this.scene.position);
        // 将相机添加到场景中
        this.scene.add(orthoCamera);
        this.orthoCamera = orthoCamera;


        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,100
        )
        watcherCamera.position.set(2,2,6)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;

      },
      datGui(){
        const gui = new dat.GUI();
        // gui.add(this.sphere.material,'size',0.05,0.5,0.01)


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
      tick() {
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView() {
        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      },
      init(){
        this.createScene()
        this.createLights()
        this.loadTextures()
        this.createObjects()
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
