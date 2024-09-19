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

/*

Matcap（Material Capture）材质是一种用于3D渲染和建模的特殊着色技术，主要应用于实时预览、雕刻和快速材质表现中。它的独特之处在于，它利用预先生成的纹理来直接映射物体表面的光照和材质效果，而不需要进行复杂的实时光照计算。以下是对Matcap材质的详细介绍：
material captures
MatCaps, or "material captures" allows you to create a surface material and lighting environment simply by painting an object so that it looks like how you want your surface to appear.
https://learn.foundry.com/modo/content/help/pages/shading_lighting/shader_items/matcap.html


### 1. **工作原理**
Matcap材质通过使用一张包含光照和材质信息的球形纹理（Matcap纹理），将这个纹理映射到3D模型的表面。模型表面的法线方向决定了如何采样这张纹理，从而为每个表面点提供颜色、亮度和反射效果。因此，Matcap纹理包含了环境的光照效果以及材质属性（如金属感、光泽感等）。

简而言之，Matcap材质将整个环境的光照和反射效果“捕捉”到一张2D图像中，并通过简单的映射实现复杂的材质效果。

### 2. **应用场景**
- **雕刻和建模预览**：在3D雕刻和建模工具中（如ZBrush、Blender），Matcap材质广泛用于提供快速的视觉反馈，帮助艺术家看到物体的形状、细节和反射效果。
- **实时渲染**：由于Matcap材质计算简单，非常适合实时渲染，尤其是在不需要动态光照变化的场景中，比如角色预览或静态物体展示。
- **游戏开发**：在一些轻量化的游戏场景中，也可能使用Matcap材质来减少实时计算压力。

### 3. **优势**
- **计算效率高**：与基于物理的渲染（PBR）相比，Matcap材质不需要动态计算光照，因此非常节省计算资源，适合用于实时渲染和轻量场景。
- **容易实现复杂效果**：通过精心制作的Matcap纹理，可以快速实现金属、玻璃、陶瓷等材质的视觉效果，而无需复杂的材质设置。
- **简单易用**：艺术家只需选择一个合适的Matcap纹理，即可立即得到具有光照和反射效果的材质预览。

### 4. **局限性**
- **不适应动态光照变化**：Matcap材质依赖于固定的纹理映射，因此在场景光照变化时无法做出动态响应，这限制了其在高动态环境中的应用。
- **缺乏真实物理效果**：由于Matcap材质是预先捕捉好的纹理，没有考虑真实的光线反射、折射等物理现象，因此无法与基于物理的材质匹敌。

### 5. **常见使用方式**
- **雕刻软件（如ZBrush）**：雕刻过程中，使用Matcap材质可以帮助艺术家看到形体的轮廓和细节。
- **Blender中的Matcap**：Blender提供了多个内置的Matcap材质，便于用户在建模过程中快速预览不同的材质效果。
  
总的来说，Matcap材质是一种高效的3D材质表现方式，适用于实时预览和低计算资源的场景，但在要求真实动态光照的场合，可能需要与其他渲染方法配合使用。

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
