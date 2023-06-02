import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import * as dat from 'dat.gui'
import gsap from 'gsap'


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
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(ambientLight, directionalLight);
      },
      createObjects() {
        // 创建几何体
        const sphereGeometry = new THREE.SphereGeometry(1,16,64);
        // 创建材质
        const material = new THREE.MeshLambertMaterial({
          color:0x1890ff
        })
        const mesh = new THREE.Mesh(sphereGeometry,material)
        this.scene.add(mesh)
        this.mesh =mesh

      },
      createCamera() {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75,this.width/this.height,1,100)

        pCamera.position.set(0,1,5)
        pCamera.lookAt(this.scene.position)
        this.scene.add(pCamera)
        this.pCamera = pCamera;
        this.camera = pCamera
      },
      datGui(){
        const gui = new dat.GUI();
        const params = {
          x:0,

          widthSegments:this.mesh.geometry.parameters.widthSegments,
          heightSegments:this.mesh.geometry.parameters.heightSegments,
          generateGeometry:()=>{
            this.mesh.geometry.dispose()
            const geometry = new THREE.SphereGeometry(1,params.widthSegments,params.heightSegments)
            this.mesh.geometry = geometry
          },
          rotation:()=>{
             // 绕y轴旋转半周
            gsap.to(this.mesh.rotation, { duration: 1, delay: 0, y: this.mesh.rotation.y + Math.PI });
          },
        }
        gui.add(this.orbitControls,'enabled')
        gui.add(this.mesh,'visible')
        gui.add(this.mesh.material,'wireframe')
        gui.add(this.mesh.geometry.parameters,'widthSegments',3,100,1).onChange(val=>{
          params.widthSegments = val
          params.generateGeometry()
        })
        gui.add(this.mesh.geometry.parameters,'heightSegments',3,100,1).onChange(val=>{
          params.heightSegments = val
          params.generateGeometry()
        })
        gui.add(params,'rotation')
        gui.add(this.mesh.position,'x',-3,3,0.1)
        gui.add(params,'x',-3,3,0.1).name('translateX').onChange(val=>{
          params.x = val
          this.mesh.geometry.translate(params.x,0,0)
          console.log(this.mesh.position);
          console.log(this.mesh.geometry);
        })
        gui.add(this.mesh.scale,'x',0,3,0.1).name('scaleX')
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        // 创建辅助平面
        this.scene.add(axesHelper);
      },
      clipScene(renderer){
        const dpr = window.devicePixelRatio || 1
        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(dpr);
        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
      },
      render() {
        // 创建渲染器
        if(!this.renderer){
          this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
          });

        }
        // 全局剪裁
        this.clipScene(this.renderer)

      },
      controls() {
        // 创建轨道控制器
        const orbitControls = new OrbitControls(this.camera, this.canvas);
        orbitControls.enableDamping = true;
        this.orbitControls = orbitControls;
        // 拖拽控制器
        // const dragControls = new DragControls([this.mesh],this.camera,this.canvas)

      },
      count:0, // 当前点的索引
      moveCamera(){
          const index = this.count % this.points.length; //
          const point = this.points[index]
          const nextPoint = this.points[index+1 >= this.points.length? 0 : index+1]


          this.pCamera.position.set(point.x,0,-point.y)
          this.pCamera.lookAt(nextPoint.x,0,-nextPoint.y) // 让人眼视角沿着路径观察
          this.sphereMesh.position.set(point.x,0,-point.y)
          this.count++
      },
      tick() {
        // this.mesh.rotation.y += 0.01;
        // update objects
        this.orbitControls.update();
        // this.moveCamera()

        this.render()
        // this.renderer.render(this.scene, this.camera);
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

