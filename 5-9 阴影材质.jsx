import { useEffect } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
在这段代码中，**阴影**的实现是通过 `THREE.js` 提供的阴影功能完成的。阴影的主要组件包括光源、投射阴影的物体以及接收阴影的物体。下面我会详细讲解代码中如何设置和管理这些阴影的各个部分：

### 1. **开启渲染器的阴影功能**
   首先，为了在场景中启用阴影渲染，你需要让 WebGL 渲染器支持阴影。
   ```javascript
   renderer.shadowMap.enabled = true;
   ```

   这行代码确保渲染器能够处理阴影计算并在场景中正确地绘制出阴影效果。

### 2. **设置光源的阴影属性**
   要在场景中产生阴影，光源必须支持阴影投射。在这段代码中，使用的是 `THREE.DirectionalLight`（方向光），并且启用了它的阴影功能。

   ```javascript
   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
   directionalLight.position.set(1, 2, 2);
   directionalLight.castShadow = true; // 开启方向光的阴影投射
   ```

   `castShadow = true` 告诉渲染器这束光线会在场景中产生阴影。

   然后，方向光的阴影配置还可以进一步优化，包括以下设置：
   - `directionalLight.shadow.camera.near` 和 `directionalLight.shadow.camera.far`: 控制阴影投射区域的近远裁剪平面，确保阴影的精度在合理范围内。
   - `directionalLight.shadow.radius`: 设置阴影边缘的模糊程度，让阴影看起来更自然。
   - `directionalLight.shadow.mapSize.x` 和 `directionalLight.shadow.mapSize.y`: 控制阴影贴图的分辨率。分辨率越高，阴影越清晰，越低则阴影显得模糊。此处设为 `1024`，是常见的中等分辨率。

### 3. **设置物体的阴影属性**
   物体要么是阴影的**投射者**，要么是**接收者**。在 `THREE.js` 中，物体的阴影行为通过 `castShadow` 和 `receiveShadow` 两个属性控制。

   例如，立方体将投射阴影到其他物体上：
   ```javascript
   box.castShadow = true; // 立方体投射阴影
   ```

   地面和墙壁则接收阴影：
   ```javascript
   planeShadow.receiveShadow = true; // 地板接收阴影
   wallShadow.receiveShadow = true;  // 墙面接收阴影
   ```

   这些物体的材质是 `ShadowMaterial`，这是一个专门用于接收阴影的材质：
   ```javascript
   const material = new THREE.ShadowMaterial({
     opacity: 1, // 不透明度
     polygonOffset: true, // 多边形偏移，用于避免 z-fighting
     polygonOffsetFactor: -1 // 偏移因子，控制多边形的深度
   });
   ```

   `ShadowMaterial` 不显示任何颜色或纹理，它只显示物体上接收到的阴影，这可以让阴影在平面上显得更加清晰。

### 4. **物体的阴影配置**
   - **投射阴影的物体**：设置 `castShadow = true`，例如立方体 `box` 会在场景中投射阴影。
   - **接收阴影的物体**：设置 `receiveShadow = true`，例如地板 `planeShadow` 和墙面 `wallShadow` 将接收阴影。

### 5. **物体的布局**
   在场景中，地面、墙壁等接收阴影的物体有特定的摆放位置：
   - 地板是一个平面，并且被放置在 Y 轴的 `-0.8` 位置，稍微低于中心。
     ```javascript
     floor.rotation.x = -Math.PI / 2; // 旋转为水平面
     floor.position.y = -0.8;
     ```

   - 墙面则是垂直于地面的，放置在 Z 轴的 `-2` 位置。
     ```javascript
     wall.position.y = 0.8;
     wall.position.z = -2;
     ```

### 6. **整体阴影流程**
   1. **光源设置**：方向光（`DirectionalLight`）的位置和阴影属性确保它能够投射阴影。
   2. **物体投射阴影**：3D 物体（如立方体 `box`）会根据光线的方向投射阴影。
   3. **接收阴影的物体**：地板、墙壁等物体用 `ShadowMaterial` 接收阴影。
   4. **渲染阴影**：渲染器启用阴影功能后，会根据光源、物体的阴影属性计算并显示阴影效果。

### 7. **动态效果和调试**
   使用了 `dat.GUI` 调试工具，可以动态调整光源的 `x`、`y`、`z` 位置，用户可以实时看到光源位置变化如何影响场景中的阴影。
   ```javascript
   gui.add(this.directionalLight.position, 'x', -10, 10, 0.1);
   gui.add(this.directionalLight.position, 'y', -10, 10, 0.1);
   gui.add(this.directionalLight.position, 'z', -10, 10, 0.1);
   ```

### 8. **阴影效果展示**
   最终，阴影的效果会根据光源的方向、投射阴影的物体位置以及接收阴影的物体的表面材质，在场景中呈现出逼真的阴影效果。阴影让整个场景的光照和物体之间的互动更加自然，也增加了场景的真实感。

### 总结
阴影部分的核心工作在于：
1. 启用渲染器的阴影支持。
2. 设置光源可以投射阴影，并配置光源的阴影贴图大小和其他属性。
3. 为需要投射阴影的物体开启 `castShadow` 属性。
4. 为接收阴影的物体开启 `receiveShadow` 属性，并使用 `ShadowMaterial` 渲染阴影。
5. 使用 `requestAnimationFrame` 实现动画，让阴影随光源和物体的动态变化实时渲染。



在 `THREE.js` 和其他 3D 渲染引擎中，**`polygonOffset`** 和 **`polygonOffsetFactor`** 是用于解决一种常见的视觉问题，叫做 **Z-fighting**（深度冲突或Z-冲突）。Z-fighting 是指两个或多个几何体表面非常接近或重叠时，渲染器在决定哪些表面应该显示时出现的冲突。这通常会导致物体表面出现闪烁或瑕疵，像是在不同几何面之间快速切换一样。

### Z-fighting 详解
**Z-fighting** 通常出现在：
- 两个平行或接近的平面（例如，两个平面几何体在同一个位置，或者距离非常小）。
- 渲染器在计算物体表面的深度值时，由于精度不足，会在这两个表面之间不断切换，从而导致渲染结果出现闪烁。

这种现象常见于阴影、贴花（decals）或透明物体等情况下。

### `polygonOffset` 和 `polygonOffsetFactor` 作用

`polygonOffset` 和 `polygonOffsetFactor` 提供了一种解决 Z-fighting 问题的办法。通过**多边形偏移**（polygon offset），可以让一个几何体在渲染时稍微“向前”或“向后”移动一点，避免与另一个几何体产生深度冲突。

- **`polygonOffset: true`**：
  这行代码的作用是启用多边形偏移功能。通过开启这个选项，可以告诉渲染器对该几何体的深度值进行偏移处理，以避免 Z-fighting。

- **`polygonOffsetFactor: -1`**：
  这个参数决定了偏移的大小，具体是通过控制深度缓冲区的值来调整物体的“深度位置”。`polygonOffsetFactor` 值的大小和正负影响物体的偏移方向。
  
  - 如果 `polygonOffsetFactor` 是负值（如 `-1`），则几何体在渲染时会向后偏移，即距离相机更远。
  - 如果 `polygonOffsetFactor` 是正值，则几何体会向前偏移，即距离相机更近。

### 深入解释 `polygonOffset` 的原理
当渲染器决定每个像素的深度时，它会为每个片元（fragment）计算一个深度值。开启 `polygonOffset` 后，深度值会根据以下公式被调整：

```text
newDepth = originalDepth + (factor * slope) + units
```

其中：
- `originalDepth` 是片元最初的深度值。
- `factor` 是 `polygonOffsetFactor`，它决定了偏移量和表面斜率（slope）的乘积，特别适用于有斜坡或倾斜面的几何体。
- `units` 是一个常数，控制深度缓冲区的单位偏移，但它在这段代码中没有被设置，默认是 0。

通过调整这个公式，渲染器可以确保一个几何体在深度缓冲区中有一点偏移，避免 Z-fighting。

### 应用场景

在你的代码中，`polygonOffset` 和 `polygonOffsetFactor` 被用来解决阴影接收平面与其他几何体的 Z-fighting 问题。

1. **阴影的接收面**（`planeShadow` 和 `wallShadow`）使用了 `ShadowMaterial`，该材质用于接收阴影。当阴影被投射到这些平面上时，阴影的接收平面可能会和其他几何体（比如地面或墙壁）非常接近，可能会发生 Z-fighting。
2. 通过设置 `polygonOffset: true` 和 `polygonOffsetFactor: -1`，接收阴影的平面被稍微“向后”移动了一点，使得它与其他几何体不会发生深度冲突，从而避免了 Z-fighting。

### Z-fighting 的常见场景和解决方法
以下是常见的 Z-fighting 场景，以及如何使用 `polygonOffset` 来解决它：

- **多层几何体或贴花**：在同一平面上渲染多个贴花或重叠的几何体时，容易出现 Z-fighting。通过启用 `polygonOffset`，可以对几何体进行轻微偏移，使它们在渲染时不会互相冲突。
- **阴影问题**：当一个物体投射阴影到另一个表面上时，阴影和表面之间可能会出现深度冲突，导致阴影不稳定。通过对接收阴影的表面进行偏移，可以消除这种冲突。

### 总结
1. **`polygonOffset: true`**：启用多边形偏移功能，让几何体的深度值根据偏移进行调整，以避免 Z-fighting。
2. **`polygonOffsetFactor: -1`**：设置几何体的偏移因子为 `-1`，让该几何体在深度缓冲中稍微向后偏移，避免与其他几何体在渲染时产生冲突。

这些设置使得场景中的阴影接收面能够正确接收阴影，而不会和其他表面产生 Z-fighting，从而让渲染结果更稳定、更真实。

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

        scene.background = new THREE.Color(0xeeeeee);
        this.scene = scene;
      },
      createLights() {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(1, 2, 2);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 40;
        directionalLight.shadow.radius = 1.5;
        directionalLight.shadow.mapSize.x = 1024;
        directionalLight.shadow.mapSize.y = 1024;

        console.log(directionalLight);
        this.directionalLight = directionalLight;
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load(
          "/public/textures/floor_tiles_06/floor_tiles_06_diff_2k.jpg"
        );
        const wallTexture = textureLoader.load(
          "/public/textures/large_sandstone_blocks/large_sandstone_blocks_diff_2k.jpg"
        );
        this.floorTexture = floorTexture;
        this.wallTexture = wallTexture;
      },
      createObjects() {
        const material = new THREE.ShadowMaterial({
          opacity: 1,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        });

        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0x1890ff })
        );
        const geometry = new THREE.PlaneGeometry(10, 10);

        const planeShadow = new THREE.Mesh(geometry, material);
        const wallShadow = new THREE.Mesh(geometry, material);

        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshBasicMaterial({
            map: this.floorTexture,
          })
        );
        const wall = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshBasicMaterial({
            map: this.wallTexture,
          })
        );

        box.castShadow = true; // 产生阴影
        planeShadow.rotation.x = -Math.PI / 2;
        planeShadow.position.y = -0.8;
        planeShadow.receiveShadow = true; // 接收阴影阴影
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.8;
        floor.position.z = -2;
        wallShadow.position.y = 0.8;
        wallShadow.position.z = -2;
        wallShadow.receiveShadow = true;
        wall.position.y = 0.8;
        wall.position.z = -2;

        this.scene.add(box, planeShadow, floor, wallShadow, wall);
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
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const size = 100;
        const divisions = 10;
        const gridHelper = new THREE.GridHelper(size, divisions);
        // 创建辅助平面
        this.scene.add(axesHelper, gridHelper);
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
        });

        // 开启阴影渲染
        renderer.shadowMap.enabled = true;

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
