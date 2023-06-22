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

        // 创建雾
        const fog = new THREE.FogExp2(0xe0e0e0,0.04)
        fog.name='fog'
        scene.fog = fog
        scene.background = new THREE.Color(0xe0e0e0)


        this.scene = scene;
      },
      createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff,0.95)
        this.ambientLight = ambientLight
        this.scene.add(ambientLight)        
      },
      createMeshes(matcapTexture,z=1){
        const geometry = new THREE.TorusGeometry(Math.random(),Math.abs(Math.random()-0.5),32)
        const mesh =  new THREE.Mesh(
          geometry,
          new THREE.MeshMatcapMaterial({
            color:0xffffff,
            matcap:matcapTexture,
            fog:z<0,
          })
        )
        mesh.position.x = (Math.random() - 0.5)*50
        mesh.position.y = 1
        mesh.position.z = Math.random() * 50 * z
        mesh.rotation.x = Math.random() * Math.PI
        mesh.rotation.y = Math.random() * Math.PI
        mesh.rotation.z = Math.random() * Math.PI
        mesh.scale.x = Math.random() * 0.3 + 0.5
        mesh.scale.y = Math.random() * 0.3 + 0.5
        mesh.scale.z = Math.random() * 0.3 + 0.5


        this.scene.add(mesh)
      },
      createObjects() {


        const textureLoader = new THREE.TextureLoader()
        const matcapTexture = textureLoader.load('public/textures/matcaps/BA472D_CA6E67-256px.png')
        const wallTexture = textureLoader.load('public/textures/large_sandstone_blocks/large_sandstone_blocks_diff_2k.jpg')

        wallTexture.rotation = Math.PI/4
        wallTexture.wrapT = THREE.RepeatWrapping


        for(let i = 0;i<300;i++){
          this.createMeshes(matcapTexture,1)  // 室内的物体
          this.createMeshes(matcapTexture,-1) // 室外的物体
        }



        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshLambertMaterial({
            color:0x1890ff
          })
        )

        const geometry = new THREE.PlaneGeometry(1000,1000)
        const out = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial({
            color:0xd0d0d0,
            side:THREE.DoubleSide
          })
        )
        const floor = new THREE.Mesh(geometry,
          new THREE.MeshLambertMaterial({
            color:0x666666,
            side:THREE.DoubleSide,
            fog:false
          }))

        const wall = new THREE.Mesh(
            new THREE.RingGeometry(10,50,4,8),
            new THREE.MeshLambertMaterial({
              color:0x666666,
              side:THREE.DoubleSide,
              map:wallTexture,
              fog:false
            }),
        )

        floor.rotation.x = -Math.PI/2
        floor.position.z = 500
        floor.position.y = -1

        out.rotation.x = -Math.PI/2
        out.position.z = -500
        wall.rotation.z = -Math.PI/4
        wall.position.y = 10 

        this.scene.add(box,floor,wall,out)
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
          


        const boxFolder = gui.addFolder('box')
        boxFolder.open()
        boxFolder.add(this.box.material,'fog').onChange(val=>{
          const material = new THREE.MeshLambertMaterial({
            color:0x1890ff
          })
          material.fog = val
          this.box.material = material
        })
        boxFolder.add(this.box.position,'z',-100,100,0.1)




        gui.add(this.ambientLight,'intensity',0,1,0.1).name('环境光强度')
        gui.add(this.ambientLight,'visible').name('环境光可见性')
        gui.addColor({color:0xffffff},'color').onChange(val=>{
          this.ambientLight.color = new THREE.Color(val)
        })

        const fogFolder = gui.addFolder('fog')
        fogFolder.open()

        fogFolder.addColor(this.scene.fog,'color').onChange(val=>{
         const color = new THREE.Color(val.r,val.g,val.b)
         this.scene.fog.color = color
         this.scene.background = color
        })
        fogFolder.add(this.scene.fog,'density',0,0.5,0.01)
        // fogFolder.add(this.scene.fog,'far',10,100,0.1)
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
