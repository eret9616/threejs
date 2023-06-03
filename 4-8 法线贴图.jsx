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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(1,2,4)
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures(){
        debugger;
        // const img = new Image()
        // const texture = new THREE.Texture(img)
        // img.src = '/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg'
        // img.onload = function(){
        //   texture.needsUpdate = true
        // }


        // const textLoader = new THREE.TextureLoader()
        // this.texture = textLoader.setCrossOrigin('anonymous').load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg',
        // // onload 回调
        //   function(texture){
        //   },
        //   null,
        //   (err)=>{
        //     console.log(err);
        //   }
        // )

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

        const texture = textureLoader.load('/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_basecolor.jpg')
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg')
        const bumpTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png')
        const normalTexture = textureLoader.load('/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_normal.jpg')

        this.aoTexture = aoTexture
        this.texture = texture
        this.bumpTexture = bumpTexture
        this.normalTexture = normalTexture
      },
      createObjects() {
        const geometry = new THREE.SphereGeometry(2,64,64);
        const material = new THREE.MeshPhongMaterial({
          map:this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -2.5




        const boxGeometry = new THREE.SphereGeometry(2,64,64)
        const boxMaterial = new THREE.MeshPhongMaterial({
          map:this.texture,
          // aoMap:this.aoTexture,
          // aoMapIntensity:0.8,
          normalMap:this.normalTexture
          // bumpMap:this.bumpTexture,
          // bumpScale:10
          // displacementMap:this.bumpTexture,
          // displacementBias:0, // 位移贴图在网格顶点上的偏移量
          // displacementScale:0 // 位移贴图对网格的影响程度（黑色无位移，白色是最大位移）

        })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)

        // boxGeometry.setAttribute('uv2',new THREE.BufferAttribute(geometry.attributes.uv.array,2))
        // console.log(boxGeometry);
        box.position.x = 2.5

        this.box = box


        this.scene.add(mesh,box);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(0,1,8)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;

      },
      datGui(){
        const gui = new dat.GUI();

        gui.add(this.box.material,'aoMapIntensity',0,1,0.1)
        gui.add(this.box.material,'displacementBias',0,1,0.1)
        gui.add(this.box.material.normalScale,'x',0,1,0.1).onChange(val=>{
          this.box.material.normalScale = new THREE.Vector2(val,this.box.material.normalScale.y)
          console.log(this.box.material.normalScale);
        })
        gui.add(this.box.material.normalScale,'y',0,1,0.1).onChange(val=>{
          this.box.material.normalScale = new THREE.Vector2(this.box.material.normalScale.y,val)
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
