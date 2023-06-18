import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import {HeartCurve} from 'three/examples/jsm/curves/CurveExtras';

const Page = () => {
  useEffect(() => {
    const $ = {
      cameraIndex:0,
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
        const ambientLight = new THREE.AmbientLight(0xffffff,0.75)
        this.ambientLight = ambientLight

        RectAreaLightUniformsLib.init()


        // 添加面光源
        const rectLight = new THREE.RectAreaLight(0xffffff,10,2,4)
        rectLight.position.set(0,1,5)



        // 
        const rectHelper = new RectAreaLightHelper(rectLight)

        this.rectLight = rectLight
        this.scene.add(ambientLight,rectLight,rectHelper) 
      },
      createTextures(){
        const textureLoader = new THREE.TextureLoader()
        const floorTexture = textureLoader.load('public/textures/floor_tiles_06/floor_tiles_06_diff_2k.jpg')
        const wallTexture = textureLoader.load('public/textures/large_sandstone_blocks/large_sandstone_blocks_diff_2k.jpg')
        const photoTexture = textureLoader.load('public/textures/frames/A02I7634.png')
        this.photoTexture = photoTexture
        this.floorTexture = floorTexture
        this.wallTexture = wallTexture
      },
      createObjects() {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshStandardMaterial({
            color:0x1890ff
          })
        )
        const geometry = new THREE.PlaneGeometry(10,10)
        const material = new THREE.MeshStandardMaterial({
          side:THREE.DoubleSide,
          map:this.wallTexture,
          roughness:0
        })
        const floor = new THREE.Mesh(geometry,
          new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            map:this.floorTexture,
            roughness:0
          }))
        const wall = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
          side:THREE.DoubleSide,
          map:this.wallTexture,
        }))

        box.castShadow = true // 产生阴影

        floor.receiveShadow = true // 接收阴影
        // 添加相框
        const frameGeometry = new THREE.PlaneGeometry(4.4,6.4)
        const frameMaterial = new THREE.MeshStandardMaterial({
          color:0xd08a38,
        })
        const frame = new THREE.Mesh(frameGeometry,frameMaterial)
        const photoGeometry = new THREE.PlaneGeometry(4,6)
        const photoMaterial = new THREE.MeshStandardMaterial({
          map:this.photoTexture,
          roughness:0
        })
        const photo = new THREE.Mesh(photoGeometry,photoMaterial)
        const group = new THREE.Group()

        group.add(frame,photo)
        frame.position.z = 0.001
        photo.position.z = 0.002

        group.position.z = -5
        group.position.y = 5
        floor.rotation.x = Math.PI/2
        floor.position.y = -1
        wall.position.y = 4
        wall.position.z = -5
        wall.receiveShadow = true // 接收阴影


        this.box =box
        // this.dirLight.target = box
        this.scene.add(box,floor,wall,group)
        this.box = box
      },
      createCamera() {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75,this.width/this.height,1,10)
        pCamera.position.set(0,0,3) //
        pCamera.up.set(0,-1,0) //
        pCamera.lookAt(this.scene.position) //
        this.scene.add(pCamera)
        this.pCamera = pCamera;
        // this.camera = pCamera

        // 创建相机对象
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(2,2,6)
        watcherCamera.lookAt(this.scene.position)
        this.watcherCamera = watcherCamera
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;
      },
      datGui(){
        const gui = new dat.GUI();

        const ambientFolder = gui.addFolder('环境光')
        ambientFolder.add(this.ambientLight,'intensity',0,1,0.1).name('环境光强度')
        ambientFolder.add(this.ambientLight,'visible').name('环境光可见性')
        ambientFolder.addColor({color:0xffffff},'color').onChange(val=>{
          this.ambientLight.color = new THREE.Color(val)
        })
        ambientFolder.open()


        const boxFolder = gui.addFolder('box')
        boxFolder.add(this.box.position,'x',-20,20,0.1).onChange(val=>{
          this.rectLight.lookAt(this.box.position)
        })
        boxFolder.add(this.box.position,'y',-20,20,0.1).onChange(val=>{
          this.rectLight.lookAt(this.box.position)
        })
        boxFolder.add(this.box.position,'z',-20,20,0.1).onChange(val=>{
          this.rectLight.lookAt(this.box.position)
        })
        boxFolder.open()



        const r = gui.addFolder('矩形面光源')
        // r.add()

        r.open()
        r.add(this.rectLight,'visible')
        r.add(this.rectLight,'intensity',0,20,0.1)
        r.addColor(this.rectLight,'color').onChange(val=>{
          this.rectLight.color = new THREE.Color(val.r,val.g,val.b)
        })
        r.add(this.rectLight,'width',0,10,0.1)
        r.add(this.rectLight,'height',0,10,0.1)
        r.add(this.rectLight.position,'x',-10,10,0.1)
        r.add(this.rectLight.position,'y',-10,10,0.1)
        r.add(this.rectLight.position,'z',-10,10,0.1)
        r.add(this.rectLight.rotation,'x',-Math.PI,Math.PI,0.1)
        r.add(this.rectLight.rotation,'y',-Math.PI,Math.PI,0.1)
        r.add(this.rectLight.rotation,'z',-Math.PI,Math.PI,0.1)

      },
      helpers() {
        // 创建辅助坐标系
        // 创建辅助平面
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
        });

        // 开启阴影渲染
        renderer.shadowMap.enabled = true

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
      clock: new THREE.Clock(),
      tick() {
        // const elapsedTime = this.clock.getElapsedTime()
        // this.pointLight1.position.x = Math.sin(elapsedTime);
        // this.pointLight1.position.z = Math.cos(elapsedTime);
        // this.sphere1.position.copy(this.pointLight1.position)


        // this.mesh.rotation.y += 0.01;
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView() {
        window.addEventListener('resize', () => {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      },
      init(){
        this.createScene()
        this.createLights()
        this.createTextures()
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
