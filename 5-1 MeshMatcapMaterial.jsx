import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*

基础线条材质 LineBasicMaterial
虚线材质 LineDashedMaterial
基础网格材质 MeshBasicMaterial 以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。
深度网格材质 MeshDepthMaterial 按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远。
Lambert网格材质 MeshLambertMaterial 非光泽表面的材质，没有镜面高光。可以很好地模拟某些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）
法线网格材质 MeshNormalMaterial 把法向量映射到RGB颜色的材质。
Phong网格材质 MeshPhongMaterial 用于具有镜面高光的光泽表面的材质。
标准网格材质 MeshStandardMaterial 基于物理(PBR)的标准材质, 使用物理上正确的模型来表示光与表面的相互作用
物理网格材质 MeshPhysicalMaterial 基于物理(PBR)的透明度, 高级光线反射
卡通网格材质 MeshToonMaterial 模拟卡通效果的材质
着色器材质 ShaderMaterial 使用自定义shader渲染的材质
阴影材质 ShadowMaterial 可以接收阴影，但在其他方面完全透明。

*/

const Page = () => {
  useEffect(() => {
    const $ = {
      createScene() {
        const canvas = document.getElementById("c");
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

        this.directionalLight = directionalLight;
        directionalLight.position.set(1, 2, 4);
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures() {
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
        manager.onStart = function (url, itemsLoaded, itemsTotal) {
          console.log(
            "Started loading file: " +
              url +
              ".\nLoaded " +
              itemsLoaded +
              " of " +
              itemsTotal +
              " files."
          );
        };
        manager.onLoad = function () {
          console.log("Loading complete!");
        };
        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
          console.log(
            "Loading file: " +
              url +
              ".\nLoaded " +
              itemsLoaded +
              " of " +
              itemsTotal +
              " files."
          );
        };
        manager.onError = function (url) {
          console.log("There was an error loading " + url);
        };
        const textureLoader = new THREE.TextureLoader(manager);

        const texture = textureLoader.load(
          "/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg"
        );
        const aoTexture = textureLoader.load(
          "/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg"
        );
        const bumpTexture = textureLoader.load(
          "/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png"
        );
        const normalTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg"
        );
        const roughnessTexture = textureLoader.load(
          "/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg"
        );
        const metalTexture = textureLoader.load(
          "/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg"
        );
        const specularTexture = textureLoader.load(
          "/src/assets/textures/earth/earth_specular_2048.jpg"
        );
        const matcapTexture = textureLoader.load(
          "/public/textures/matcaps/BA472D_CA6E67-256px.png"
        );

        // 纹理回环
        texture.repeat.set(2, 2);
        texture.wrapS = THREE.RepeatWrapping; // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping
        texture.wrapT = THREE.RepeatWrapping; // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping

        // 纹理偏移
        texture.offset = new THREE.Vector2(0.5, 0.5);
        // 旋转
        texture.rotation = Math.PI / 12; // 正值：逆时针
        texture.center.set(0.5, 0.5);

        this.matcapTexture = matcapTexture;
        this.aoTexture = aoTexture;
        this.texture = texture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
        this.metalTexture = metalTexture;
        this.specularTexture = specularTexture;

        // 环境贴图加载器
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const envTexture = cubeTextureLoader.load([
          "/src/assets/textures/fullscreen/1.left.jpg",
          "/src/assets/textures/fullscreen/1.right.jpg",
          "/src/assets/textures/fullscreen/1.top.jpg",
          "/src/assets/textures/fullscreen/1.bottom.jpg",
          "/src/assets/textures/fullscreen/1.front.jpg",
          "/src/assets/textures/fullscreen/1.back.jpg",
        ]);
        this.envTexture = envTexture;
      },
      createObjects() {
        const material = new THREE.MeshMatcapMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          // matcap:this.aoTexture,
          map: this.texture,
        });
        const box = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 64),
          material
        ); // 立方体
        const meshMaterial = new THREE.MeshMatcapMaterial({
          matcap: this.matcapTexture,
          // map:this.texture,
          // normalMap:this.normalTexture
        });
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 64),
          meshMaterial
        ); // 立方体
        console.log(meshMaterial);

        box.position.x = -1.2;
        mesh.position.x = 1.2;

        this.meshMaterial = meshMaterial;
        this.material = material;
        this.scene.add(box, mesh);
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          0.1,
          1000
        );
        watcherCamera.position.set(0, 0, 4);
        watcherCamera.lookAt(this.scene.position);
        this.scene.add(watcherCamera);
        this.camera = watcherCamera;
      },
      datGui() {
        const gui = new dat.GUI();
        const params = {
          x: this.meshMaterial.normalScale.x,
          y: this.meshMaterial.normalScale.y,
        };
        gui.add(params, "x", 0, 1, 0.1).onChange((val) => {
          this.meshMaterial.normalScale = new THREE.Vector2(val, params.y);
        });

        gui.add(params, "y", 0, 1, 0.1).onChange((val) => {
          this.meshMaterial.normalScale = new THREE.Vector2(params.x, val);
        });
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
        window.addEventListener("resize", () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      },
      init() {
        this.createScene();
        this.createLights();
        this.loadTextures();
        this.createObjects();
        this.createCamera();
        this.helpers();
        this.render();
        this.controls();
        this.tick();
        this.fitView();
        this.datGui();
      },
    };
    $.init();
  }, []);

  return (
    <>
      <canvas id="c" />;
    </>
  );
};

export default Page;
