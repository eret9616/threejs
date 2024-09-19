import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
**MeshPhongMaterial** 是三维图形渲染中常见的一种材质类型，主要用于表现光滑表面、光照和反射效果。它通常应用于 **WebGL** 或 **Three.js** 等图形引擎中，渲染具有光泽的物体，比如金属、塑料等。**Phong** 指的是一种基于 **Phong Shading**（冯氏着色）的材质模型，它通过计算光的反射来生成光照效果，特别适合表现光滑、反光的材质。

### Phong的来源与背景

**Phong Shading**（冯氏着色）得名于越南裔计算机科学家 **Bui Tuong Phong**，他在1973年提出了一种新的光照模型来更好地模拟物体表面的光照和反射。这种模型对计算机图形学的渲染技术产生了深远影响。Phong的贡献在于：

1. **Phong反射模型（Phong Reflection Model）**：这是一种模拟光线在光滑表面上的反射方式的模型，它结合了**环境光**（ambient）、**漫反射光**（diffuse）和**镜面反射光**（specular）的计算。通过这三种光照分量，Phong反射模型可以模拟现实世界中物体如何在不同光照条件下呈现。
   
2. **Phong着色（Phong Shading）**：这是一种插值着色方法。它在每个像素级别计算法线，并应用反射模型，从而在物体表面上生成更平滑和逼真的光照效果。相对于早期的 Gouraud Shading，Phong Shading 计算每个像素的光照，这使得高光区域更加清晰和真实。

### MeshPhongMaterial的特点
在 **Three.js** 中，**MeshPhongMaterial** 使用 **Phong反射模型** 来渲染物体，具有以下特性：

1. **镜面反射**：它能够模拟物体表面的光泽，高光区域会显示得更加明显。比如金属、塑料等材料通常会使用这个材质。
   
2. **环境光、漫反射光和镜面反射光**：通过 `ambient`, `diffuse`, `specular` 三种光照模式，Phong模型能更好地表现物体在不同光线下的反射效果。

3. **可调参数**：MeshPhongMaterial 允许用户通过参数控制不同的光照特性，例如：
   - **color**：物体的基本颜色。
   - **specular**：高光颜色，即反光的颜色。
   - **shininess**：物体表面的光泽度，数值越高，表面越光滑，反射的光斑越小且亮。

### 总结
**MeshPhongMaterial** 是基于 **Phong反射模型** 的材质，用于表现具有光泽、反光的表面。**Phong** 来自于 Bui Tuong Phong 提出的光照和着色方法，解决了在计算机图形学中如何模拟光线与物体表面交互的问题，使得渲染更加逼真和细腻。



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
        const material = new THREE.MeshPhongMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          map: this.texture,
        });
        const box = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 64),
          material
        ); // 立方体
        const meshMaterial = new THREE.MeshPhongMaterial({
          map: this.texture,
          // normalMap:this.normalTexture,
          specular: 0x00ffff,
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
        gui.add(this.directionalLight.position, "x", -10, 10, 0.1);
        gui.add(this.directionalLight.position, "y", -10, 10, 0.1);
        gui.add(this.directionalLight.position, "z", -10, 10, 0.1);
        gui.add(this.meshMaterial, "shininess", 0, 100, 0.1);
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
