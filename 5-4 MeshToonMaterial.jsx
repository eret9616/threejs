import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
1. 讲一讲代码中的卡通渲染?

代码中的卡通渲染是通过 `Three.js` 中的 `MeshToonMaterial` 实现的。`MeshToonMaterial` 是一种专门用于创建卡通风格效果的材质，它可以给物体一种“分段式阴影”的视觉效果，使得渲染结果更像是手绘的或卡通的，而不是光滑的渐变效果。下面是具体的卡通渲染相关的关键点：

### 1. **`MeshToonMaterial` 材质**
   - 在 `createObjects` 方法中，代码使用了 `THREE.MeshToonMaterial` 来定义3D物体的材质。`MeshToonMaterial` 与标准的 `MeshPhongMaterial` 类似，但它在光照和阴影的处理上更为简化，以呈现出卡通的效果。
   - 例如，这里定义了两个球体（`SphereGeometry`），并为它们分别设置了 `MeshToonMaterial`。材质属性包括：
     - **透明度（transparent）**：让材质支持透明效果。
     - **双面显示（side: THREE.DoubleSide）**：让材质渲染物体的正面和背面。
     - **纹理贴图（map）**：为物体应用了加载的纹理，进一步增强视觉效果。

### 2. **使用渐变贴图（Gradient Map）**
   - `datGui` 中提供了一个控制选项，让用户可以动态更改材质的 `gradientMap`。`gradientMap` 是一种用于卡通渲染的渐变贴图，它会对物体的光照区域进行分段处理，使得物体的阴影和亮部显示为不连续的渐变，形成一种阶梯状的效果。
   
   - **`threeToneTexture`** 和 **`fiveToneTexture`** 是代码中加载的两种渐变贴图，它们分别对应三色和五色的阴影分段效果。三色和五色的渐变映射意味着阴影被分为三个或五个不同亮度的区域，从而让物体看起来更像卡通或动画风格。
     - 在 GUI 控制中，用户可以在三种选项中切换：
       - **none**：不使用渐变映射。
       - **three**：使用三色渐变贴图。
       - **five**：使用五色渐变贴图。
   
   - 当用户更改 `gradientMap` 时，代码会根据选择重新加载对应的渐变贴图，并设置材质的 `gradientMap` 属性。

### 3. **光照对卡通渲染的影响**
   - `MeshToonMaterial` 的卡通渲染效果很大程度上依赖于场景中的光照条件。代码中设置了全局光照和定向光照，特别是定向光照（`DirectionalLight`）的方向会影响物体表面如何接收到光线，以及光影的分布。
   - 卡通渲染不会像常规的渲染那样使用平滑的阴影过渡，取而代之的是通过光照强度的突变来生成明显的光影分界，这使得物体显得更加二维化，类似于手绘风格。

### 4. **渲染的可调节性**
   - 使用 `dat.GUI` 工具可以实时控制 `MeshToonMaterial` 的 `gradientMap`，也可以通过调整灯光的位置来影响最终的渲染效果。这让用户可以动态地调节物体的视觉风格，体验不同的卡通渲染效果。

### 5. **代码示例：**
   ```js
   const material = new THREE.MeshToonMaterial({
     transparent: true,
     side: THREE.DoubleSide,
     map: this.texture,  // 赋予材质一个纹理贴图
   });
   const meshMaterial = new THREE.MeshToonMaterial({
     map: this.texture,
     gradientMap: this.threeToneTexture,  // 应用三色渐变映射
   });
   ```

### 卡通渲染的效果：
- 这种卡通化渲染能让物体表面呈现清晰的光影分界，使得场景看起来像卡通或者手绘动画场景，而不是通常的 3D 渲染效果。



2. 为什么要设置 THREE.NearestFilter
卡通不能自己设置吗?


`THREE.NearestFilter` 的作用是设置纹理过滤的方式，它决定了当纹理被放大或缩小时，如何从纹理图像中采样像素。`NearestFilter` 使用“最近邻过滤”，即每次采样时选择离采样点最近的像素，不会进行插值或平滑处理。

在卡通渲染中，使用 `THREE.NearestFilter` 是为了达到更清晰的视觉效果，特别是为了避免纹理在缩放时变得模糊或平滑化。这样可以保持图像的边缘清晰、锐利，从而更符合卡通风格的需求。具体原因包括：

### 1. **保持卡通风格的锐利边缘**
   - `MeshToonMaterial` 追求的是卡通风格，而卡通风格通常有较为清晰、分明的阴影和边缘线条。`NearestFilter` 可以避免在放大纹理时产生平滑过渡，保持边缘的硬朗和锐利，符合卡通的特点。
   - 使用 `NearestFilter` 可以防止纹理在放大时被模糊化，从而让渲染的视觉效果更加清晰有力，保持卡通的视觉风格。

### 2. **减少插值的影响**
   - 当使用默认的过滤模式（如 `LinearFilter`）时，Three.js 会对纹理进行双线性插值，使得纹理在放大或缩小时看起来更加平滑。然而，这种平滑效果对于卡通渲染是不理想的，因为卡通效果需要明确的色彩分界和硬朗的轮廓。
   - `NearestFilter` 不会进行任何插值，它只是直接从纹理中取最近的像素颜色，这种不平滑的效果能让纹理的细节更加符合卡通渲染的风格。

### 3. **渐变映射的分段效果**
   - 在代码中，使用了 `gradientMap` 来创建分段式的卡通阴影效果。如果使用 `LinearFilter`，阴影过渡可能会被平滑处理，导致分段效果不够明显。而 `NearestFilter` 可以保证在渐变贴图中，每个颜色区域的过渡是清晰的，确保卡通的阴影层次感更加鲜明。
   
   例如，加载三色和五色的渐变映射时：
   ```js
   threeToneTexture.magFilter = THREE.NearestFilter; // 设置为 NearestFilter
   this.mesh.material.gradientMap = threeToneTexture;
   ```
   这会让三色或五色的渐变纹理在渲染时呈现出清晰的层次效果，而不会被模糊化。

### **卡通是否可以不使用 `NearestFilter`？**
   是的，卡通渲染理论上可以不使用 `NearestFilter`，但这样做会影响最终的视觉效果。如果不使用 `NearestFilter`，会出现以下情况：
   - 纹理在物体上应用时，边缘会变得模糊，影响卡通渲染的清晰度。
   - 渐变映射的阴影过渡变得平滑，失去了分明的分段感，整体看起来会更像是普通的3D渲染，而不是卡通风格。

因此，虽然可以不使用 `NearestFilter`，但如果追求清晰、锐利的卡通效果，还是推荐使用它。

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

        directionalLight.position.set(2, 2, 0);

        this.directionalLight = directionalLight;
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
          "/public/textures/Glass_Vintage_001/Glass_Vintage_001_basecolor.jpg"
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

        const threeToneTexture = textureLoader.load(
          "/public/textures/threeTone.jpg"
        );
        const fiveToneTexture = textureLoader.load(
          "/public/textures/fiveTone.jpg"
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

        this.textureLoader = textureLoader;
        this.matcapTexture = matcapTexture;
        this.aoTexture = aoTexture;
        this.texture = texture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
        this.roughnessTexture = roughnessTexture;
        this.metalTexture = metalTexture;
        this.specularTexture = specularTexture;
        this.threeToneTexture = threeToneTexture;
        this.fiveToneTexture = fiveToneTexture;

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
        const material = new THREE.MeshToonMaterial({
          transparent: true,
          side: THREE.DoubleSide,
          map: this.texture,
        });
        const box = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 64),
          material
        ); // 立方体
        const meshMaterial = new THREE.MeshToonMaterial({
          map: this.texture,
          gradientMap: this.threeToneTexture,
          // normalMap:this.normalTexture,
          // specular:0x00ffff,
        });
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 64),
          meshMaterial
        ); // 立方体
        console.log(meshMaterial);

        console.log(meshMaterial);
        box.position.x = -1.2;
        mesh.position.x = 1.2;

        this.mesh = mesh;
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

        gui.add(this.directionalLight.position, "x", -10, 10, 0.1);
        gui.add(this.directionalLight.position, "y", -10, 10, 0.1);
        gui.add(this.directionalLight.position, "z", -10, 10, 0.1);
        gui
          .add(this.mesh.material, "gradientMap", ["none", "three", "five"])
          .onChange((val) => {
            if (val === "none") {
              this.mesh.material.gradientMap = null;
            } else if (val === "three") {
              this.threeToneTexture.dispose(); // 从内存中销毁纹理对象

              const threeToneTexture = this.textureLoader.load(
                "/public/textures/threeTone.jpg"
              );

              threeToneTexture.magFilter = THREE.NearestFilter;
              this.mesh.material.gradientMap = threeToneTexture;
            } else {
              this.fiveToneTexture.magFilter = THREE.NearestFilter;
              this.mesh.material.gradientMap = this.fiveToneTexture;
            }
            this.mesh.material.needsUpdate = true;
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
