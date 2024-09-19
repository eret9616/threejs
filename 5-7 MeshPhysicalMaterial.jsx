import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
1. 介绍一下MeshPhysicalMaterial:
`MeshPhysicalMaterial` 是 `Three.js` 中的一种高级物理材质，用于创建具有更真实光学效果的 3D 对象。它基于物理渲染（PBR, Physically Based Rendering）模型，能够模拟现实世界中材料的物理特性，如金属度、透明度、反射、折射等，从而产生逼真的材质效果。

### 主要特性和属性：
1. **`map`（基础颜色贴图）**：
   - 基础颜色纹理，决定物体的颜色和细节纹理。可以是图片文件加载的纹理。

2. **`envMap`（环境贴图）**：
   - 环境贴图用于模拟物体表面反射周围环境的效果，常用来增加反射和折射效果。

3. **`metalness`（金属度）**：
   - 控制物体的金属感，值在 0 到 1 之间。0 表示非金属材料（如木材或塑料），1 表示纯金属材质。

4. **`roughness`（粗糙度）**：
   - 控制表面光滑度。0 表示完全光滑（镜面反射），1 表示非常粗糙（漫反射）。

5. **`clearcoat`（清漆层）**：
   - 增加一个清漆层，模拟像汽车漆面那样有反光效果的表层。

6. **`clearcoatRoughness`（清漆粗糙度）**：
   - 控制清漆层的粗糙度，影响反射的模糊程度。

7. **`transmission`（透光度）**：
   - 用于模拟透明材质，值在 0 到 1 之间。1 表示完全透明，0 表示完全不透明。常用于模拟玻璃或水等透明物体。

8. **`ior`（折射率）**：
   - 指定材质的折射率（Index of Refraction），用来模拟光线通过材质时的折射现象。通常非金属材料有折射率（如玻璃），而金属材质不需要折射率。

9. **`thickness`（厚度）**：
   - 与 `transmission` 配合使用，控制透明材质的厚度，影响光线通过材质时的折射效果。

10. **`reflectivity`（反射率）**：
    - 用于控制非金属材质的反射率，值越高，物体表面的反射效果越明显。

11. **`sheen`（绒面效果）**：
    - 模拟布料、天鹅绒等材质上的绒面光效，使表面具有微妙的高光效果。

### 使用场景：
- **金属表面**：`metalness` 和 `roughness` 的组合可以很好地模拟金属材质，如钢铁、铜、金等表面。
- **玻璃或水**：通过 `transmission`、`ior` 和 `thickness` 属性，能够实现类似玻璃或水的透明效果。
- **光滑和清漆材质**：使用 `clearcoat` 模拟汽车漆面或其他反光光滑的表面。
- **高光物体**：`envMap` 和 `reflectivity` 可以用来创建镜子等反射物体。

### 示例：
```javascript
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.1,
  clearcoat: 1,
  transmission: 0.8, // 透明度
  ior: 1.5,          // 折射率
  thickness: 0.2,    // 厚度
});
```

`MeshPhysicalMaterial` 是创建高质量、逼真的材质的核心工具，特别适合模拟玻璃、金属、水等物体的材质效果。



2. 和 meshstandard对比呢:
`MeshPhysicalMaterial` 和 `MeshStandardMaterial` 都是基于物理渲染（PBR, Physically Based Rendering）的材质，在模拟现实世界的材质时，都可以实现相对逼真的光照效果。它们的核心渲染模型是相似的，但 `MeshPhysicalMaterial` 提供了更多高级的物理特性，用于模拟更复杂的材质效果。

### 主要区别：

#### 1. **高级物理特性**
   - **`MeshPhysicalMaterial`**：提供更多用于模拟复杂材质的高级特性，比如清漆（`clearcoat`）、透光度（`transmission`）、折射率（`ior`）、厚度（`thickness`）等属性。这些属性允许更精确地模拟透明物体（如玻璃、水）和带有反光表层的物体（如汽车漆面）。
   - **`MeshStandardMaterial`**：提供标准的金属感（`metalness`）和粗糙度（`roughness`）属性，但没有 `MeshPhysicalMaterial` 提供的那些高级特性，适合模拟普通的金属、塑料等材质。

#### 2. **清漆层 (`clearcoat`)**
   - **`MeshPhysicalMaterial`**：有一个专门的 `clearcoat` 属性，允许为物体增加一个光滑的反光层，类似于汽车漆面或镜面反射。还有 `clearcoatRoughness` 属性来控制这个清漆层的粗糙度。
   - **`MeshStandardMaterial`**：不支持清漆层的效果。如果想要类似的高光反射，需要依赖环境贴图（`envMap`）来模拟，但效果不如 `MeshPhysicalMaterial` 细致。

#### 3. **透明度和折射 (`transmission` 和 `ior`)**
   - **`MeshPhysicalMaterial`**：支持更复杂的透明效果。`transmission` 属性用于控制透光性，而 `ior`（折射率）属性可以模拟光线在材质表面的折射行为，适合玻璃、水等材质。`thickness` 属性进一步控制透明材质的厚度效果。
   - **`MeshStandardMaterial`**：支持基本的透明度（通过 `opacity` 和 `transparent` 属性），但无法模拟复杂的光折射和透光性，也没有折射率或厚度属性。

#### 4. **适用场景**
   - **`MeshPhysicalMaterial`**：适用于需要高度真实感的场景，尤其是模拟玻璃、透明塑料、带有反光层的汽车漆面、钻石等需要透明和折射效果的材质。
   - **`MeshStandardMaterial`**：适用于大多数一般场景，模拟常见的金属、木材、塑料、石材等材质。当不需要复杂的透明或反射效果时，`MeshStandardMaterial` 更轻量且性能更好。

#### 5. **性能**
   - **`MeshPhysicalMaterial`**：由于包含了更多高级属性和计算，因此性能开销较大，渲染速度相对较慢，特别是当场景中有许多复杂的透明和反射物体时。
   - **`MeshStandardMaterial`**：由于特性较少，计算开销较小，性能更优，适合大规模或复杂场景的快速渲染。

### 相似之处：
1. **金属度 (`metalness`) 和粗糙度 (`roughness`)**：这两种材质都支持 `metalness` 和 `roughness`，可以很好地模拟物体的金属感和表面光滑度。
2. **环境贴图 (`envMap`)**：两者都支持 `envMap`，可用于反射环境中的光线，从而增强反射效果。

### 代码对比：

**MeshStandardMaterial 示例：**
```javascript
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.2,
});
```

**MeshPhysicalMaterial 示例：**
```javascript
const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.2,
  clearcoat: 1,           // 反光清漆层
  transmission: 0.8,      // 透明度
  ior: 1.5,               // 折射率
  thickness: 0.2,         // 透明材质厚度
});
```

### 总结：
- 如果你的场景需要复杂的光学效果（如玻璃、透明塑料、清漆层等），选择 `MeshPhysicalMaterial`。
- 如果只需要基础的 PBR 材质效果（如金属、塑料等），且需要更好的性能，`MeshStandardMaterial` 是更合适的选择。


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

        scene.background = new THREE.Color(0xffffff);
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
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg"
        );
        const aoTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_ambientOcclusion.jpg"
        );
        const bumpTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png"
        );
        const normalTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg"
        );
        const roughnessTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg"
        );
        const metalTexture = textureLoader.load(
          "/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg"
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
        const material = new THREE.MeshPhysicalMaterial({
          map: this.texture,
        });
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 16),
          material
        ); // 球体
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 64, 16),
          new THREE.MeshPhysicalMaterial({
            // map:this.texture,
            envMap: this.envTexture,
            envMapIntensity: 1,
            // metalnessMap:this.metalTexture,
            // metalness:1,
            roughnessMap: this.roughnessTexture,
            roughness: 0.1,
            clearcoat: true, // 具有反光特性
            transmission: 0.8, // 厚薄程度
            ior: 1.0, // 非金属材质的反射率
            thickness: 1.0, // 曲面下体积的厚度
          })
        ); // 球体

        sphere.position.x = -1.5;
        mesh.position.x = 1.5;

        this.material = material;
        this.sphere = sphere;
        this.mesh = mesh;
        this.scene.add(sphere, mesh);
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

        gui.add(this.mesh.material, "envMapIntensity", 0, 1, 0.1);
        gui.add(this.mesh.material, "metalness", 0, 1, 0.1);
        gui.add(this.mesh.material, "roughness", 0, 1, 0.1);
        gui.add(this.mesh.material, "clearcoat");
        gui.add(this.mesh.material, "transmission", 0, 1, 0.1);
        gui.add(this.mesh.material, "ior", 1, 2.333, 0.01);
        gui.add(this.mesh.material, "thickness", 0, 1, 0.01);
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
