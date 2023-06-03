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
        const texture =  textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg')

        textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg')

        this.texture = texture
        this.textureLoader = textureLoader
      },
      createObjects() {
        // 2 创建立方体的几何体
        const geometry = new THREE.CylinderGeometry(1, 1, 1);
        // 3 创建立方体的基础材质
        const material = new THREE.MeshLambertMaterial({
          map:this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -1.5
        const boxGeometry = new THREE.BoxGeometry(2,2,2)
        const boxMaterial = new THREE.MeshBasicMaterial({
          map:this.texture
        })
        const materials = []

        for( let i = 0;i<boxGeometry.groups.length;i++){
          // 使用 textLoader加载每张纹理图片
          const texture = this.textureLoader.load(`/src/assets/textures/fullscreen/0${i+1}.jpg`)

          materials.push(new THREE.MeshBasicMaterial({
            map:texture
          }))
        }

        const box = new THREE.Mesh(boxGeometry, materials)
        box.position.x = 1
        this.scene.add(mesh,box);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(0,1,3)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;

      },
      datGui(){
        const gui = new dat.GUI();
        gui.add(this.camera.position,'x',0.1,10,0.1)
        gui.add(this.camera,'near',0.01,10,0.01).onChange(val=>{
          console.log(val);
          this.camera.near = val
          this.camera.updateProjectionMatrix()
        })
        gui.add(this.camera,'far',1,100,1).onChange(val=>{
          console.log(val);
          this.camera.far = val
          this.camera.updateProjectionMatrix()
        })

        gui.add(this.camera,'zoom',0.1,10,0.1).onChange(val=>{
          console.log(val);
          this.camera.zoom = val
          this.camera.updateProjectionMatrix()
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
