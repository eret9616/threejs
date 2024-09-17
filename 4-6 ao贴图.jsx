import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
1. 什么是ao贴图？
"AO贴图"是"环境遮挡"（Ambient Occlusion）贴图的简称。它是一种灰度纹理，用于模拟物体表面因周围几何形状遮挡而产生的光照衰减效果。在3D渲染中，AO贴图通过在模型的凹陷、角落和物体接触点添加柔和的阴影，增强视觉真实感和深度感。

使用AO贴图可以提高渲染效率，因为它减少了对复杂全局光照计算的需求，同时还能保持场景的细节丰富度。这在游戏开发、动画制作和视觉效果设计中非常常见。

2. 为什么要设置        boxGeometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
        );


之所以选择 U 和 V，是为了与三维空间中的 X、Y、Z 坐标区分开来。简单来说：
•	U 代表纹理的水平坐标轴。
•	V 代表纹理的垂直坐标轴。
这两个字母只是约定俗成的符号，用于标识 2D 纹理坐标。

在3D图形学中，`UV`属性表示的是用于贴图的纹理坐标。它定义了如何将2D纹理（如图像）映射到3D几何体表面上。`U`和`V`是二维坐标的表示，类似于二维平面上的 `X` 和 `Y` 坐标。
以下是一些关于 `UV` 属性的关键点：
1. **UV坐标系**：UV坐标系是一个二维的坐标系，范围通常是 `[0, 1]`。`U` 是水平方向，`V` 是垂直方向。当你为3D模型定义UV坐标时，模型的每个顶点都会对应到一个二维的 `UV` 坐标，表示它在纹理上的位置。
2. **纹理映射**：当3D物体被贴上纹理时，UV坐标决定了2D图像中的哪一部分被映射到3D物体的哪一个面上。换句话说，UV坐标描述了模型表面的每个顶点在纹理图像中的位置。
3. **UV展开（UV unwrapping）**：在3D建模软件中，通常需要进行UV展开，将3D模型的表面展开成一个2D平面，使其能够很好地与2D图像对齐。展开后，模型的每个三角面或多边形面都会有一组UV坐标来决定它如何映射纹理。
4. **UV坐标属性在THREE.js中的作用**：
   在THREE.js中，UV属性是几何体的顶点属性之一，通常存储在`geometry.attributes.uv`中。每个顶点都有一个 `U` 和 `V` 坐标，用来告诉渲染器如何在该顶点处应用纹理。例如：
   ```javascript
   const geometry = new THREE.BoxGeometry(1, 1, 1);
   console.log(geometry.attributes.uv);  // 打印UV坐标
   ```
5. **UV坐标的范围**：
   - `0, 0` 通常代表纹理的左下角。
   - `1, 1` 通常代表纹理的右上角。
   - 纹理可以重复或者平铺，如果UV坐标超出 `[0, 1]` 的范围，纹理可以根据设置重复显示或拉伸。
简而言之，UV属性是用于将2D纹理正确地映射到3D模型上的坐标系统。通过控制UV坐标，你可以决定3D物体的每个部分如何显示其纹理。



在使用`THREE.js`进行3D场景开发时，`setAttribute`方法用于给几何体对象（如`boxGeometry`）添加额外的顶点属性，而`uv2`是其中的一种用于定义纹理坐标的属性。
以下是设置 `uv2` 的具体原因：
1. **第二组UV坐标**：`uv2` 是一个自定义属性，通常用于储存第二组 UV 纹理坐标。当你使用 AO（环境遮挡）贴图或光照贴图时，通常需要一组单独的 UV 坐标来进行映射。这些 UV 坐标可能不同于用于基础纹理的第一组 UV 坐标（即 `uv` 属性）。
2. **AO贴图和光照贴图支持**：当你在场景中使用 AO 贴图或光照贴图时，THREE.js 需要知道如何将这些贴图映射到几何体上。第一组 UV 坐标（即 `uv`）通常用于基础颜色、漫反射贴图，而第二组 UV 坐标（即 `uv2`）则专门用于 AO 贴图或光照贴图。
3. **使用相同的UV数据**：在这段代码中：
   ```js
   boxGeometry.setAttribute(
     'uv2',
     new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
   );
   ```
   你将第一组 UV 坐标 `geometry.attributes.uv.array` 复制给了 `uv2`。这是因为在某些情况下，你可能没有专门为 AO 贴图或光照贴图创建单独的 UV 坐标，因此你可以直接复用第一组 UV 坐标。如果你有单独的 UV 坐标数据，那就可以将它们传递给 `uv2`。
4. **确保正确的贴图映射**：一些高级的着色器效果（如 AO、光照贴图）需要知道如何使用第二组 UV 坐标来处理这些贴图。因此，如果你没有设置 `uv2`，这些效果可能无法正确应用在几何体上。
简而言之，这段代码的作用是确保为几何体设置第二组 UV 坐标，通常用于AO贴图或光照贴图，以便在渲染时能正确映射这些贴图，提高视觉效果的真实感。



3. 为什么要用2， 用3可以吗，这个2怎么结合后续代码使用？
       boxGeometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
        );


在这段代码中，`new THREE.BufferAttribute(geometry.attributes.uv.array, 2)` 中的 `2` 是指每个顶点的UV坐标有两个分量，即`U` 和 `V`。这是因为纹理坐标是二维的，因此需要两个分量来表示每个顶点的纹理坐标。

### 为什么要用 `2`？
`2` 代表的是每个顶点的UV坐标有两个值：一个 `U` 值和一个 `V` 值，表示在2D纹理上对应的位置。每个顶点的纹理坐标数据是通过这些两个数值来定义的。THREE.js 中的 `BufferAttribute` 是用来描述几何体的属性（如顶点位置、法线、纹理坐标等），而纹理坐标通常是二维的，所以需要两个分量（`U` 和 `V`）。

### 用 `3` 可以吗？
不可以。用 `3` 是不正确的，因为 `uv2` 是用于存储第二组UV坐标的，而UV坐标本质上是二维的（`U` 和 `V`），并不是三维的。如果你设置 `3`，THREE.js 期望每个顶点有三个分量（如3D坐标），但是UV纹理坐标只有两个分量，设置 `3` 会导致数据不匹配，渲染结果可能出错，甚至报错。

### `2` 怎么结合后续代码使用？

1. **纹理映射**：你为 `boxGeometry` 设置了第二组UV坐标（`uv2`），这通常在高级渲染技术中使用，例如环境遮挡（AO）贴图或光照贴图。后续代码中，如果使用 AO 贴图或光照贴图时，THREE.js 渲染器会使用 `uv2` 来获取这些贴图的纹理坐标。通常，AO 或光照贴图的坐标与基础纹理的UV坐标不同，因此你需要第二组UV来正确地映射这些特殊的贴图。

2. **渲染器如何使用**：
   - 当你设置材质属性时，例如AO贴图的属性 `aoMap`，THREE.js 会自动使用 `uv2` 来获取AO贴图的纹理坐标。例如：
     ```javascript
     const material = new THREE.MeshStandardMaterial({
       map: texture, // 基础纹理
       aoMap: aoTexture // AO贴图
     });
     ```

   在这种情况下，AO贴图的坐标将从 `uv2` 属性中读取。

### 总结

- `2` 是指每个顶点的UV坐标有两个分量（`U` 和 `V`），用于表示二维纹理坐标。
- 设置为 `3` 是不正确的，因为UV坐标是二维的，而不是三维的。
- `uv2` 用于存储第二组UV坐标，通常用于高级渲染技术，如AO贴图或光照贴图，THREE.js 渲染器在这些贴图的映射中会使用 `uv2`。




4. 'uv3'可以吗?

在 THREE.js 中，`uv2` 是常用于存储第二组 UV 坐标的属性，主要应用于一些特定的纹理映射技术，如 AO（环境遮挡）贴图和光照贴图。至于 `uv3`，THREE.js 本身并没有默认支持的 `uv3` 属性。

不过，你**可以**为几何体添加 `uv3` 或其他自定义的 UV 属性，但它不会被 THREE.js 默认的材质系统（如 `MeshStandardMaterial`）自动使用。你需要自己通过着色器（Shader）进行处理。也就是说，如果你有特殊的需求，并且自己编写或修改了着色器，你可以使用 `uv3` 或更多的 UV 坐标组。

### 如果想使用 `uv3`，可以这样做：

1. **设置 `uv3`**：
   和 `uv2` 类似，你可以通过以下方式为几何体设置 `uv3` 属性：
   ```javascript
   boxGeometry.setAttribute(
     'uv3',
     new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
   );
   ```

2. **自定义着色器**：
   如果你想在渲染中使用 `uv3`，需要自己编写 GLSL 着色器并在着色器中使用这第三组 UV 坐标。这里是一个简单的示例：

   ```javascript
   const customMaterial = new THREE.ShaderMaterial({
     vertexShader: `
       varying vec2 vUv3;
       void main() {
         vUv3 = uv3;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
       }
     `,
     fragmentShader: `
       varying vec2 vUv3;
       void main() {
         // 使用 uv3 坐标进行纹理采样或其他操作
         gl_FragColor = vec4(vUv3, 0.0, 1.0); // 仅作示例
       }
     `
   });
   ```

在这个例子中，`uv3` 需要通过 `setAttribute` 设置，并在顶点着色器和片段着色器中引用。这种方式可以让你在自定义着色器中完全控制如何使用第三组或更多的 UV 坐标。

### 总结：
- THREE.js 默认不支持 `uv3`（默认的材质系统不会自动处理）。
- 你可以通过 `setAttribute` 自定义添加 `uv3`。
- 如果想使用 `uv3`，需要通过自定义着色器（`ShaderMaterial`）来处理和使用这些额外的 UV 坐标。

如果你需要处理更复杂的渲染效果，使用 `uv3` 是可以的，但需要更多手动操作和自定义的着色器代码。

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // this.scene.add(ambientLight, directionalLight);
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
          "/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg"
        );
        // const sword = textureLoader.load('/src/assets/textures/sword.png')
        // sword.magFilter = THREE.NearestFilter
        // this.sword = sword

        const aoTexture = textureLoader.load(
          "/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg"
        );

        this.aoTexture = aoTexture;
        this.texture = texture;
      },
      createObjects() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
          map: this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -1.5;

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshBasicMaterial({
          map: this.texture,
          aoMap: this.aoTexture,
          aoMapIntensity: 1,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        boxGeometry.setAttribute(
          "uv2",
          new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
        );
        console.log(boxGeometry);
        box.position.x = 1;

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
        watcherCamera.position.set(0, 1, 3);
        watcherCamera.lookAt(this.scene.position);
        this.scene.add(watcherCamera);
        this.camera = watcherCamera;
      },
      datGui() {
        const gui = new dat.GUI();

        gui.add(this.box.material, "aoMapIntensity", 0, 1, 0.1);
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
