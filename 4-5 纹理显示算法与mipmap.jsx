import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/*
// mipmap介绍
https://zh.wikipedia.org/wiki/Mipmap
https://3dbooks.netlify.app/categories/threejs/basis/4


// mipmap默认会生成多少个level？
mipmap默认会生成多少个level
默认情况下，当为纹理生成 mipmap 时，生成的层级数量取决于纹理的原始尺寸。具体来说，生成的层级数量为 **log₂(最大边长)** 加 1，其中“最大边长”是纹理的宽度或高度中较大的那个值。
**计算方式：**
层级数量 = ⎣log₂(最大边长)⎦ + 1
其中，⎣ ⎦ 表示向下取整。
**举例说明：**
- 如果纹理尺寸为 **256×256** 像素：
  ```
  层级数量 = log₂(256) + 1 = 8 + 1 = 9 层
  ```
  生成的 mipmap 层级尺寸依次为：
  - Level 0: 256×256
  - Level 1: 128×128
  - Level 2: 64×64
  - Level 3: 32×32
  - Level 4: 16×16
  - Level 5: 8×8
  - Level 6: 4×4
  - Level 7: 2×2
  - Level 8: 1×1
- 如果纹理尺寸为 **300×200** 像素，最大边长为 300：
  ```
  层级数量 = ⎣log₂(300)⎦ + 1 ≈ ⎣8.23⎦ + 1 = 8 + 1 = 9 层
  ```
  层级尺寸将从 300×200 开始，每次尺寸减半，直到最小的一边缩小到 1 像素。
**总结：**
- **默认生成的 mipmap 层级数量取决于原始纹理的最大尺寸**，并会一直生成到 1×1 的纹理为止。
- **每个层级的纹理尺寸是上一层级的一半（向下取整）**。
- **总层级数通常为 log₂(最大边长) + 1**。


// 关闭mipmap
// 设置纹理显示算法
colorTexture1.minFilter = THREE.NearestFilter; // 缩小滤镜, 当纹理图片对于物体的面过大时使用(在纹理中选择最近的像素)
colorTexture1.magFilter = THREE.NearestFilter; // 放大滤镜, 当纹理图片对于物体的面过小时使用(从纹理中选择4个像素，然后混合)
colorTexture1.generateMipmaps = false; // minFilter属性使用了NearestFilter, 可以按需为该纹理停用mipmapping，使得GPU不再处理其mip映射




// 这些level如何使用？
当为纹理生成了 mipmap 后，这些不同级别（levels）的纹理会在渲染过程中根据需要自动使用，以优化渲染性能和提升图像质量。
**这些级别的使用方式如下：**
1. **自动选择适当的级别：**
   - **基于距离和屏幕尺寸：** 当一个物体离摄像机较近，或者在屏幕上占据较大面积时，渲染器会选择较高分辨率的 mipmap 级别（例如 Level 0，即原始纹理）来显示更多细节。
   - **基于缩放和远距离：** 当物体离摄像机较远，或者在屏幕上占据很小的面积时，渲染器会选择较低分辨率的 mipmap 级别（例如 Level 5、Level 6），以减少过多的细节导致的纹理闪烁和提升性能。
2. **纹理过滤和过渡：**
   - **三线性过滤（Trilinear Filtering）：** 渲染器在相邻的 mipmap 级别之间进行插值，确保不同级别之间过渡平滑，避免明显的切换痕迹。
   - **各向异性过滤（Anisotropic Filtering）：** 在视角倾斜时提高纹理的清晰度，尤其对于贴图在斜角度观看时效果更佳。
**使用这些级别的目的：**
- **提高渲染性能：**
  - 通过在远距离使用低分辨率纹理，可以减少显存带宽的消耗和渲染计算量，提高帧率。
- **减少纹理失真和闪烁：**
  - 防止在渲染远处细小纹理细节时出现的摩尔纹和闪烁现象，提升视觉质量。
- **优化内存使用：**
  - 低分辨率的纹理占用更少的内存，有助于在大型场景中管理显存资源。
**工作原理示例：**
- **近距离物体：**
  - 玩家靠近一堵墙时，墙面的纹理在屏幕上显示得很大，此时使用最高分辨率的 Level 0 纹理，展示清晰的细节。
- **远距离物体：**
  - 远处的建筑物在屏幕上只占很小的区域，渲染器会自动选择较低分辨率的 Level 5 或 Level 6 纹理，既满足视觉需求，又节省了资源。
**技术细节：**
- **GPU 自动选择：**
  - GPU 根据纹理坐标在屏幕空间的变化率（也称为纹理梯度）自动计算并选择合适的 mipmap 级别。
- **LOD（细节层次）：**
  - 纹理的 LOD 值决定了使用哪个 mipmap 级别，LOD 值由渲染器实时计算。
**总结：**
- **多级纹理优化：** Mipmap 的各个级别通过匹配物体在屏幕上的尺寸，提供了一个从高分辨率到低分辨率的纹理序列，确保在不同距离下都有最佳的渲染效果。
- **自动化处理：** 一旦为纹理生成了 mipmap，渲染器会自动处理级别的选择，无需手动干预。
- **平衡性能和质量：** 通过合理使用 mipmap 级别，既能保持图像质量，又能提高渲染性能，是现代图形渲染中常用的优化手段。
**额外提示：**
- **开启 mipmapping：** 在使用纹理时，需要确保渲染器或材质设置中启用了 mipmapping 功能。
- **注意纹理尺寸：** 为了充分利用 mipmapping，纹理的尺寸最好是 2 的幂次方（如 256×256、512×512），以确保各级别正确生成和使用。




// 为什么使用NerestFilter就不需要mipmap了
**为什么 NearestFilter 不需要 mipmaps？**
在计算机图形学中，纹理映射时需要解决纹理的采样和过滤问题，以在不同的屏幕分辨率和距离下获得最佳的视觉效果。纹理过滤器（Texture Filters）决定了在纹理映射过程中如何采样和过滤纹理数据。
**NearestFilter（最近邻过滤）**是一种最简单的纹理过滤方式。当进行纹理采样时，NearestFilter 只选择最接近纹理坐标的那个像素（texel），不进行任何插值或混合。这意味着每个屏幕像素只对应一个纹理像素，直接映射，不涉及周围像素的计算。
**Mipmaps（多重贴图）**是一系列预先计算好的、分辨率逐渐降低的纹理图像集合。它们用于在纹理被缩小时（远离摄像机或以小尺寸显示）减少纹理失真和提升渲染性能。当使用纹理过滤器如 **LinearFilter（线性过滤）** 或 **TrilinearFilter（三线性过滤）** 时，渲染器会根据需要选择适当的 mipmap 级别，并对相邻像素进行插值，以获得平滑的视觉效果。
**那么，为什么 NearestFilter 不需要 mipmaps 呢？**
1. **采样方式简单，不支持 mipmap 级别间的过渡：**
   - **NearestFilter** 只从原始纹理中选择最接近的像素，不进行任何插值或混合。
   - 由于它不涉及周围像素或不同 mipmap 级别之间的计算，因此即使存在 mipmaps，它也不会使用。
   - 使用 mipmaps 的一个主要目的是在不同距离下选择合适的纹理分辨率，并通过插值获得平滑的过渡。但 NearestFilter 不进行插值，无法实现 mipmap 级别间的过渡。
2. **性能和视觉效果考虑：**
   - **性能优势有限：** NearestFilter 的计算非常简单，使用 mipmaps 并不会显著提高性能，反而会增加内存占用（存储 mipmap 级别）。
   - **视觉效果特性：** NearestFilter 的特点是保持纹理的锐利和像素化外观，对于需要保留清晰边缘和像素细节的场景（如像素艺术或复古游戏），使用 mipmaps 可能会导致纹理变得模糊，反而不符合预期。
3. **避免不必要的内存消耗：**
   - 生成 mipmaps 会增加纹理的内存占用，通常约为原始纹理的三分之一额外空间。
   - 如果过滤器不会使用 mipmaps，那么生成它们只是浪费资源。
4. **避免潜在的视觉瑕疵：**
   - 当使用 NearestFilter 时，切换不同的 mipmap 级别可能会导致明显的纹理跳跃或闪烁，因为没有插值来平滑过渡。
   - 为了保持一致的纹理显示，避免使用 mipmaps 可以防止这些问题。
**总结：**
- **NearestFilter** 不需要 mipmaps，因为它的采样方式不支持也不利用 mipmaps 的特性。
- 使用 mipmaps 的主要目的是在缩小纹理时减少失真和提升性能，但 NearestFilter 对于这些优势的利用有限。
- 为了节省内存和保持预期的视觉效果，在使用 NearestFilter 时通常不生成或使用 mipmaps。
**补充说明：**
如果您在项目中使用 NearestFilter 并且纹理出现了缩小时的失真或闪烁问题，可以考虑以下解决方案：
- **切换到 LinearFilter：** 线性过滤会对邻近像素进行插值，能够在纹理缩小时提供更平滑的视觉效果，并充分利用 mipmaps。
- **手动调整纹理：** 如果需要保持 NearestFilter，可以根据需要手动创建适合不同距离的纹理版本，并在渲染过程中切换。
- **使用各向异性过滤（Anisotropic Filtering）：** 提高纹理在倾斜角度下的清晰度，但需要注意的是，这通常与线性过滤结合使用。
总之，选择适当的纹理过滤方式和是否使用 mipmaps，应根据具体的视觉需求和性能考虑来决定。



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

        const texture = textureLoader.load("/src/assets/textures/sword.png");
        const sword = textureLoader.load("/src/assets/textures/sword.png");
        sword.magFilter = THREE.NearestFilter;
        this.sword = sword;
        this.texture = texture;
        console.log(texture);
      },
      createObjects() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshLambertMaterial({
          map: this.texture,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -1.5;

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshBasicMaterial({
          map: this.sword,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = 1;

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
        gui.add(this.camera.position, "x", 0.1, 10, 0.1);
        gui.add(this.camera, "near", 0.01, 10, 0.01).onChange((val) => {
          console.log(val);
          this.camera.near = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(this.camera, "far", 1, 100, 1).onChange((val) => {
          console.log(val);
          this.camera.far = val;
          this.camera.updateProjectionMatrix();
        });

        gui.add(this.camera, "zoom", 0.1, 10, 0.1).onChange((val) => {
          console.log(val);
          this.camera.zoom = val;
          this.camera.updateProjectionMatrix();
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
