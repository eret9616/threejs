import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*

1. 这段代码做什么了？

在代码中，两个球使用了不同的材质配置，因此在渲染上会有一些区别。具体来说，第一个球仅使用了基础的颜色纹理（`map`），而第二个球使用了**法线贴图（`normalMap`）**。这种材质上的差异会导致两个球在视觉效果上有明显的不同。

### 两个球的渲染差异：

1. **第一个球（`mesh`）**
   - **使用的材质**：`MeshPhongMaterial`
   - **主要特性**：仅使用了 `map` 属性，这意味着它的表面使用了基础颜色纹理，表现出普通的光照和纹理效果，没有任何额外的表面细节模拟。

   这个球的渲染效果相对简单，物体表面的纹理效果只取决于光照和基础的颜色纹理。没有使用法线贴图，因此表面看起来是平滑的，没有表现出复杂的凹凸或细节。

2. **第二个球（`box`）**
   - **使用的材质**：`MeshPhongMaterial`
   - **主要特性**：除了使用 `map` 属性外，还额外使用了 `normalMap`（法线贴图），用于模拟表面的细节和凹凸感。

   这个球的渲染效果更加复杂，法线贴图提供了对表面细节的模拟，即使这个球的几何结构是光滑的（例如一个简单的球体），通过法线贴图可以让它看起来像是有很多细节和不平整的表面。

### **什么是 `normalMap`（法线贴图）？**

**法线贴图**是一种用于模拟表面细节的技术，通过修改每个像素点的法线方向来影响光照的计算结果，从而创建凹凸感和细节，**而无需增加实际的几何复杂度**。

#### 工作原理：
- **法线**：在 3D 渲染中，法线是指物体表面上每个顶点或像素的垂直方向。光线的反射和阴影效果取决于法线的方向。
- **法线贴图**：法线贴图是一个纹理，其中每个像素的 RGB 值表示该像素上法线的方向（通常是一个归一化的 3D 向量）。这允许渲染引擎计算出比实际几何更复杂的光照效果。
  
尽管几何体（例如球体）可能非常光滑，但使用法线贴图后，它可以模拟出有凹凸感的表面。例如，可以让一个平滑的球体看起来像是粗糙的石头，或者是有很多小细节的表面，而不需要增加实际的顶点或面数。

#### 优点：
- **减少计算量**：相比直接通过增加几何体的细节（如增加面数、顶点数），法线贴图能够通过纹理来模拟出细节，减轻了渲染时的计算负担。
- **更好的光照效果**：使用法线贴图能够更好地模拟出光线在表面上的变化，使得物体看起来更加真实。

#### 使用场景：
- 模拟复杂表面（如墙壁的砖纹、金属的磨损、皮肤的细节等）。
- 在低多边形模型上创造出高多边形模型的效果。

### **两个球的渲染效果对比：**
- 第一个球由于只使用了基本的颜色纹理，表面光滑，细节较少。
- 第二个球由于使用了法线贴图，在光照下会显得更加立体，表面会表现出细微的凹凸感，尽管几何体本身是光滑的球体。

### 总结：

`normalMap`（法线贴图）通过改变每个像素的法线方向来模拟复杂的表面细节，而不增加几何复杂度。两个球的区别在于，第一个球只使用了基本纹理，表面看起来比较平滑；而第二个球使用了法线贴图，使得表面看起来更为细腻和复杂，尽管它们的几何体相同。








2. 这段代码中的用gui调整，都能调整什么东西?

在你提供的代码中，`dat.GUI` 用于提供一个可视化的用户界面，允许用户实时调整 `box` 对象（第二个球）的材质参数。这个 GUI 控件使得开发者或用户可以动态改变一些属性，从而查看实时的渲染效果变化。

具体来说，代码中可以通过 `gui` 调整以下三个属性：

### 1. **aoMapIntensity（环境光遮蔽强度）**
   ```javascript
   gui.add(this.box.material, 'aoMapIntensity', 0, 1, 0.1);
   ```
   - **功能**：调整材质的**环境光遮蔽贴图强度**。
   - **范围**：`0` 到 `1`，每次变化 `0.1`。
   - **效果**：`aoMapIntensity` 控制了环境光遮蔽的强度，它决定了物体表面哪些地方会显得更暗。值越大，遮蔽的效果越强，即凹陷区域会更加暗淡。
   - **注意**：因为代码中注释掉了 `aoMap` 的加载部分，除非启用并加载 `aoMap`，否则此调整没有效果。

### 2. **displacementBias（位移贴图偏移量）**
   ```javascript
   gui.add(this.box.material, 'displacementBias', 0, 1, 0.1);
   ```
   - **功能**：调整材质的**位移贴图偏移量**。
   - **范围**：`0` 到 `1`，每次变化 `0.1`。
   - **效果**：`displacementBias` 控制位移贴图在物体表面上的偏移量。当应用位移贴图时，它会影响物体的几何形状，使表面看起来更凹凸不平。该参数控制偏移量的大小，数值越大，偏移效果越明显。
   - **注意**：由于代码中没有实际应用 `displacementMap`（位移贴图被注释掉了），因此这项调整默认也是无效的，除非启用并加载相应的位移贴图。

### 3. **normalScale（法线贴图的缩放比例）**
   ```javascript
   gui
     .add(this.box.material.normalScale, 'x', 0, 1, 0.1)
     .onChange((val) => {
       this.box.material.normalScale = new THREE.Vector2(
         val,
         this.box.material.normalScale.y
       );
     });
   gui
     .add(this.box.material.normalScale, 'y', 0, 1, 0.1)
     .onChange((val) => {
       this.box.material.normalScale = new THREE.Vector2(
         this.box.material.normalScale.y,
         val
       );
     });
   ```
   - **功能**：调整法线贴图的缩放比例。
   - **范围**：`0` 到 `1`，每次变化 `0.1`。
   - **效果**：`normalScale` 控制法线贴图的缩放比例，分为 `x` 和 `y` 两个方向。法线贴图用于模拟表面细节，`normalScale` 控制细节的强度。当数值接近 `0` 时，法线贴图的影响变弱；当数值接近 `1` 时，法线贴图的细节表现更强烈。
   - **具体调整**：代码中通过 GUI 控件调整法线缩放的 `x` 和 `y` 两个分量。用户调整这些值会改变表面细节在两个方向上的表现，允许法线贴图在不同轴向上有不同的影响。

### 总结：
通过 `dat.GUI`，用户可以实时调整以下三个材质属性：
- **aoMapIntensity**：调整环境光遮蔽的强度（目前功能未启用）。
- **displacementBias**：调整位移贴图的偏移量（目前功能未启用）。
- **normalScale**：调整法线贴图在 `x` 和 `y` 方向上的缩放比例，从而影响表面的凹凸细节表现。

这些调整允许用户在渲染时动态查看材质属性的变化，特别是法线贴图的效果
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

        directionalLight.position.set(1, 2, 4);
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures() {
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
          "/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_basecolor.jpg"
        );
        const aoTexture = textureLoader.load(
          "/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg"
        );
        const bumpTexture = textureLoader.load(
          "/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png"
        );
        const normalTexture = textureLoader.load(
          "/src/assets/textures/Glass_Vintage_001/Glass_Vintage_001_normal.jpg"
        );

        this.aoTexture = aoTexture;
        this.texture = texture;
        this.bumpTexture = bumpTexture;
        this.normalTexture = normalTexture;
      },
      createObjects() {
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const material = new THREE.MeshPhongMaterial({
          map: this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -2.5;

        const boxGeometry = new THREE.SphereGeometry(2, 64, 64);
        const boxMaterial = new THREE.MeshPhongMaterial({
          map: this.texture,
          // aoMap:this.aoTexture,
          // aoMapIntensity:0.8,
          normalMap: this.normalTexture,
          // bumpMap:this.bumpTexture,
          // bumpScale:10
          // displacementMap:this.bumpTexture,
          // displacementBias:0, // 位移贴图在网格顶点上的偏移量
          // displacementScale:0 // 位移贴图对网格的影响程度（黑色无位移，白色是最大位移）
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        // boxGeometry.setAttribute('uv2',new THREE.BufferAttribute(geometry.attributes.uv.array,2))
        // console.log(boxGeometry);
        box.position.x = 2.5;

        this.box = box;

        this.scene.add(mesh, box);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          0.1,
          1000
        );
        watcherCamera.position.set(0, 1, 8);
        watcherCamera.lookAt(this.scene.position);
        this.scene.add(watcherCamera);
        this.camera = watcherCamera;
      },
      datGui() {
        const gui = new dat.GUI();

        gui.add(this.box.material, "aoMapIntensity", 0, 1, 0.1);
        gui.add(this.box.material, "displacementBias", 0, 1, 0.1);
        gui
          .add(this.box.material.normalScale, "x", 0, 1, 0.1)
          .onChange((val) => {
            this.box.material.normalScale = new THREE.Vector2(
              val,
              this.box.material.normalScale.y
            );
            console.log(this.box.material.normalScale);
          });
        gui
          .add(this.box.material.normalScale, "y", 0, 1, 0.1)
          .onChange((val) => {
            this.box.material.normalScale = new THREE.Vector2(
              this.box.material.normalScale.y,
              val
            );
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
