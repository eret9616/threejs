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

        const texture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg')
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg')
        const bumpTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png')
        const normalTexture = textureLoader.load('/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg')
        const roughnessTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg')
        const metalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg')
        const specularTexture = textureLoader.load('/src/assets/textures/earth/earth_specular_2048.jpg')

        // 纹理回环
        texture.repeat.set(2,2)
        texture.wrapS = THREE.RepeatWrapping // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping
        texture.wrapT = THREE.RepeatWrapping // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping

        // 纹理偏移
        texture.offset =new THREE.Vector2(0.5,0.5)
        // 旋转
        texture.rotation = Math.PI / 12 // 正值：逆时针
        texture.center.set(0.5,0.5)


        this.aoTexture = aoTexture
        this.texture = texture
        this.bumpTexture = bumpTexture
        this.normalTexture = normalTexture
        this.roughnessTexture = roughnessTexture
        this.metalTexture = metalTexture
        this.specularTexture = specularTexture

        // 环境贴图加载器
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const envTexture = cubeTextureLoader.load([
          '/src/assets/textures/fullscreen/1.left.jpg',
          '/src/assets/textures/fullscreen/1.right.jpg',
          '/src/assets/textures/fullscreen/1.top.jpg',
          '/src/assets/textures/fullscreen/1.bottom.jpg',
          '/src/assets/textures/fullscreen/1.front.jpg',
          '/src/assets/textures/fullscreen/1.back.jpg',
        ])
        this.envTexture = envTexture
      },
      createObjects() {
        const geometry = new THREE.BoxGeometry(2,2,2);
        const material = new THREE.MeshStandardMaterial({
          map:this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -2.5



        const boxGeometry = new THREE.BoxGeometry(2,2,2)
        const boxMaterial = new THREE.MeshStandardMaterial({
          map:this.texture,
          // aoMap:this.aoTexture,
          // aoMapIntensity:0.8,
          // normalMap:this.normalTexture,
          // bumpMap:this.bumpTexture,
          // bumpScale:10
          // displacementMap:this.bumpTexture,
          // displacementBias:0, // 位移贴图在网格顶点上的偏移量
          // displacementScale:0 // 位移贴图对网格的影响程度（黑色无位移，白色是最大位移）
          // displacementMap:this.bumpTexture,
          roughnessMap:this.roughnessTexture,
          metalnessMap:this.metalTexture,
          metalness:0.2,
          roughness:0.6,
          // envMap:this.envTexture
        })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)

        // boxGeometry.setAttribute('uv2',new THREE.BufferAttribute(geometry.attributes.uv.array,2))
        // console.log(boxGeometry);
        box.position.x = 1.7

        this.box = box


        this.scene.add(mesh,box);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(0,0,4)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;

      },
      datGui(){
        const gui = new dat.GUI();

        // gui.add(this.box.material,'roughness',0,1,0.1)
        // gui.add(this.box.material,'metalness',0,1,0.1)
        gui.add(this.texture.repeat,'x',0,10,0.1).name('repeatX')
        gui.add(this.texture.repeat,'y',0,10,0.1).name('repeatY')
        gui.add(this.texture,'wrapS',{
          ClampToEdgeWrapping:'ClampToEdgeWrapping',
          RepeatWrapping:'RepeatWrapping',
          MirroredRepeatWrapping:'MirroredRepeatWrapping'
        }).onChange(val=>{
          this.texture.wrapS = THREE[val]
          this.texture.needsUpdate = true
        })

        gui.add(this.texture,'wrapT',{
          ClampToEdgeWrapping:'ClampToEdgeWrapping',
          RepeatWrapping:'RepeatWrapping',
          MirroredRepeatWrapping:'MirroredRepeatWrapping'
        }).onChange(val=>{
          this.texture.wrapT = THREE[val]
          this.texture.needsUpdate = true
        })

        gui.add(this.texture.offset,'x',0,1,0.1).name('offsetX')
        gui.add(this.texture.offset,'y',0,1,0.1).name('offsetY')
        gui.add(this.texture.center,'x',0,1,0.1).name('centerX')
        gui.add(this.texture.center,'y',0,1,0.1).name('centerY')
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
        // this.texture.offset.x+=0.01
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
