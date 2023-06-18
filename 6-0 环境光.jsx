import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
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
        const ambientLight = new THREE.AmbientLight(0xffffff,0.95)
        this.ambientLight = ambientLight
        this.scene.add(ambientLight)        
      },
      createObjects() {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshLambertMaterial({
            color:0x1890ff
          })
        )
        const geometry = new THREE.PlaneGeometry(10,10)
        const material = new THREE.MeshLambertMaterial({
          side:THREE.DoubleSide
        })
        const floor = new THREE.Mesh(geometry,material)
        const wall = new THREE.Mesh(geometry,material)

        floor.rotation.x = Math.PI/2
        floor.position.y = -1
        wall.position.y = 4
        wall.position.z = -5

        this.scene.add(box,floor,wall)
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
        gui.add(this.ambientLight,'intensity',0,1,0.1).name('环境光强度')
        gui.add(this.ambientLight,'visible').name('环境光可见性')
        gui.addColor({color:0xffffff},'color').onChange(val=>{
          this.ambientLight.color = new THREE.Color(val)
        })
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
        // this.mesh.rotation.y += 0.01;
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
