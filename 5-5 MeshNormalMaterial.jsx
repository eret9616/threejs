import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*

1. 这段代码的物体是什么颜色？？ 怎么设置的，实际效果是渐变 好漂亮


这段代码中的物体使用了 `THREE.MeshNormalMaterial` 作为材质，而 `MeshNormalMaterial` 是一种特殊的材质，它的颜色并不是通过指定固定的颜色值来设置的。相反，它根据物体表面法向量的方向，自动为每个像素分配不同的颜色。这样在渲染时，表面会呈现出一种彩虹渐变效果，通常会有很多鲜艳的颜色。

### 渲染出渐变颜色的原因：
1. **`MeshNormalMaterial`** 材质根据物体表面的法线方向来着色，不同方向的法线对应不同的颜色。这种效果通常会让物体看起来像是渐变的彩虹色。
2. **`side: THREE.DoubleSide`** 设置让材质在物体的正面和背面都可见，也增强了这种渐变效果。

### 渐变效果的设置：
代码中 `MeshNormalMaterial` 的配置如下：
```js
const material = new THREE.MeshNormalMaterial({
  color: 0x1890ff, // 虽然指定了颜色，但不会影响显示，因为 MeshNormalMaterial 忽略 color 属性
  transparent: true,
  side: THREE.DoubleSide, // 让材质双面可见
});
```

这里虽然给 `MeshNormalMaterial` 设置了 `color` 属性为 `0x1890ff`（蓝色），但这个颜色不会影响实际显示，因为 `MeshNormalMaterial` 忽略了颜色属性，依然只根据法向量着色。

### 如何调整颜色效果：
如果你想要手动控制物体的颜色而不是使用 `MeshNormalMaterial`，你可以改为使用 `MeshStandardMaterial` 或 `MeshPhongMaterial`，并且设置 `color` 属性。例如：
```js
const material = new THREE.MeshStandardMaterial({
  color: 0x1890ff, // 你可以在这里设置物体的颜色
  roughness: 0.5, // 调整粗糙度
  metalness: 0.3, // 调整金属质感
});
```

这样你可以得到一个手动控制的颜色，但如果你喜欢渐变效果，那 `MeshNormalMaterial` 是一个简单的选择。

你觉得效果漂亮主要是因为 `MeshNormalMaterial` 在不同的光照和视角下会呈现非常丰富的渐变色调。这种效果特别适合展示几何形状的表面细节和法向量的变化。





2. flatshading heightsegments是怎么东西，怎么弄的。有什么效果?


在你的代码中，`flatShading` 和 `heightSegments` 是与几何体的外观和细节相关的参数。下面是它们的详细解释以及它们的效果。

### 1. `flatShading`（平面着色）

- **定义**：`flatShading` 是 `Three.js` 中的一种着色方式，当启用平面着色时，每个多边形的表面会使用统一的法线来计算光照。这样会使得每个面都显得更加“平”，边缘清晰，物体看起来像是由多个平面组成。
- **效果**：当 `flatShading` 启用后，物体的表面会显得更“锐利”，表面不再光滑，每个面会有较为明显的亮度和颜色差异。这种效果常用于低多边形风格（low-poly）的艺术风格。
  
**代码示例**：
```js
const material = new THREE.MeshStandardMaterial({
  color: 0x1890ff,
  flatShading: true, // 启用平面着色
});
```

**效果**：每个三角面都显得非常平坦，边缘非常锐利，给人一种棱角分明的感觉，物体看起来会比较粗糙，不像默认的光滑表面。

### 2. `heightSegments`（高度分段）

- **定义**：`heightSegments` 是 `SphereGeometry`（球体几何体）的一个参数，表示球体垂直方向上的分段数。它决定了几何体在高度方向上有多少个小段（三角形网格）。分段数越高，几何体的表面就越光滑和精细；分段数越低，几何体的表面就越粗糙和棱角分明。
  
- **效果**：当你增加 `heightSegments` 时，球体几何体会变得更加平滑，因为每个三角形网格的尺寸变小了。相反，减少 `heightSegments` 会让球体看起来更像是由平面拼接而成的，显得更加棱角分明。

**代码示例**：
```js
const geometry = new THREE.SphereGeometry(0.5, 16, 16); // 创建一个半径为0.5，宽度分段和高度分段都为16的球体
```
在这里，`16` 是 `heightSegments` 的值。如果你把它增加到 50，那么球体会更加光滑；如果减少到 8，球体就会显得更加有棱角。

### 在你的代码中的应用

```js
meshFolder
  .add(this.sphere.geometry.parameters, 'heightSegments', 16, 100, 1)
  .onChange((val) => {
    this.sphere.geometry.dispose(); // 销毁旧的几何体
    const geometry = new THREE.SphereGeometry(0.5, 16, val); // 重新创建一个新的球体，使用新的heightSegments
    this.sphere.geometry = geometry; // 应用新的几何体
  });
```
这段代码允许你通过 `dat.gui` 来动态调整球体的 `heightSegments`。当你增加或减少 `heightSegments` 时，球体的表面会相应地变得更光滑或更粗糙。

### 总结
- **`flatShading`**：使得物体表面呈现出每个多边形的平坦感，效果上会让物体显得棱角分明。
- **`heightSegments`**：控制几何体垂直方向上的分段数，分段数越高，表面越光滑；分段数越低，表面越粗糙。

你可以通过调整这两个参数实现不同的视觉效果。比如，`flatShading` 结合较低的 `heightSegments` 会呈现一种非常鲜明的低多边形风格，而禁用 `flatShading` 并提高 `heightSegments` 会让物体更趋近于光滑的球体。

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

        // 纹理回环
        texture.repeat.set(2, 2);
        texture.wrapS = THREE.RepeatWrapping; // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping
        texture.wrapT = THREE.RepeatWrapping; // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping

        // 纹理偏移
        texture.offset = new THREE.Vector2(0.5, 0.5);
        // 旋转
        texture.rotation = Math.PI / 12; // 正值：逆时针
        texture.center.set(0.5, 0.5);

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
        const material = new THREE.MeshNormalMaterial({
          color: 0xfff, // 这里color没用
          transparent: true,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material); // 平面
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 16, 16),
          material
        ); // 球体
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material); // 立方体
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(0.4, 0.2, 16, 32),
          material
        ); // 圆环

        console.log(material);
        console.log(THREE.DoubleSide);
        plane.position.z = -1;
        box.position.z = 1;
        sphere.position.x = -1.5;
        torus.position.x = 1.5;

        this.material = material;
        this.torus = torus;
        this.sphere = sphere;
        this.scene.add(plane, sphere, box, torus);
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

        gui.add(this.directionalLight.position, "x", -20, 20, 0.1);
        gui.add(this.directionalLight.position, "y", -20, 20, 0.1);
        gui.add(this.directionalLight.position, "z", -20, 20, 0.1);

        const meshFolder = gui.addFolder("物体");
        meshFolder.add(this.material, "wireframe");
        meshFolder.add(this.material, "flatShading").onChange((val) => {
          this.material.needUpdate = true;
        });

        console.log(this.sphere.geometry);
        meshFolder
          .add(this.sphere.geometry.parameters, "heightSegments", 16, 100, 1)
          .onChange((val) => {
            this.sphere.geometry.dispose();
            const geometry = new THREE.SphereGeometry(0.5, 16, val);
            this.sphere.geometry = geometry;
          });
        meshFolder.open();
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
