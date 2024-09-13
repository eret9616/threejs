import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { HeartCurve } from "three/examples/jsm/curves/CurveExtras";

/*
笔记：
1. 为什么鼠标可以拖拽？ 因为用了使用了 OrbitControls 控件

2. 这段代码设置了两个相机，设置了其中一个相机的视椎体camerahelper可以看到视椎体，通过data.gui库动态调整这个视椎体，
  通过点击swatchCamera(拼写错误)可以切换两个相机，查看到不在视椎体中的元素被截断

  3.  mesh.geometry.computeBoundingBox();作用是什么
	•	包围盒是一个能够完全包裹几何体的最小轴对齐立方体（AABB，Axis-Aligned Bounding Box）。
	•	计算包围盒后，geometry.boundingBox 属性将被赋值，包含了几何体在三维空间中的最小和最大坐标。
	•	因为后续的代码中需要使用这个包围盒来进行视锥体裁剪（Frustum Culling）或碰撞检测等操作。
const result = frustum.intersectsBox(this.mesh.geometry.boundingBox);
console.log(result); // 输出 true 或 false，表示物体是否在相机视野内
•	这里使用了 frustum.intersectsBox() 方法，判断物体的包围盒是否与相机的视锥体相交。
•	如果未提前计算包围盒，this.mesh.geometry.boundingBox 将为 null，导致无法正确进行判断。
由于计算包围盒会消耗一定的性能，Three.js 默认不会自动计算，只有在需要时才手动调用。


4. 
  // 通过camera计算出视锥
        const frustum = new THREE.Frustum();
        this.pCamera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果
        frustum.setFromProjectionMatrix(
          new THREE.Matrix4().multiplyMatrices(
            this.pCamera.projectionMatrix,
            this.pCamera.matrixWorldInverse
          )
        ); // 得到视锥体的矩阵

这个作用是什么?

为什么即使我注释了，调整datagui还是能看到视椎体的变化？
即使您注释掉了手动计算视锥体的代码（即创建 THREE.Frustum 并从相机矩阵中设置它的部分），在界面中调整 GUI 时仍然能够看到视锥体，这是因为 CameraHelper 会自动根据相机的变化更新其显示的视锥体，而 不依赖于您手动计算的视锥体对象。

总结
	•	手动计算的 Frustum 对象 是用于逻辑运算的，与场景的渲染和显示无直接关系。
	•	CameraHelper 是一个可视化工具，会根据相机的变化自动更新，无需手动计算视锥体。
	•	因此，即使您注释掉了手动计算视锥体的代码，CameraHelper 仍然能够显示并更新相机的视锥体。
额外说明：
	•	为什么需要手动计算视锥体？
	•	在需要进行 视锥体裁剪（Frustum Culling） 或 碰撞检测 等逻辑判断时，手动计算视锥体是必要的。
	•	例如，您可能需要判断某个物体是否在相机的视野内，以决定是否对其进行渲染或执行特定逻辑。
	•	CameraHelper 的局限性：
	•	CameraHelper 仅用于 可视化，不会提供视锥体的数学数据供逻辑判断使用。
	•	如果您需要进行逻辑判断，仍然需要手动计算 Frustum。

    不同的目的：
	•	CameraHelper 的计算： 用于视觉显示，帮助开发者在场景中直观地看到相机的视锥体。它的计算结果不对外部逻辑提供。
	•	手动计算的视锥体： 用于逻辑判断，如检测物体是否在视野内，这需要精确的数学数据。
	•	计算过程的区别：
	•	CameraHelper： 内部进行了一些计算来生成用于显示的几何体，但这些计算是为渲染服务的，且经过了优化，不会存储或暴露完整的视锥体数据。
	•	手动计算： 我们需要完整的视锥体平面数据，因此必须通过相机的矩阵手动计算。
	•	性能考虑：
	•	避免不必要的性能开销： 如果相机或 CameraHelper 默认就计算并存储了视锥体的数学数据，那么对于不需要这些数据的应用来说，是一种性能浪费。
	•	按需计算： Three.js 的设计原则是让开发者根据需要自行计算，避免在底层封装过多的功能，从而提高性能和灵活性。

*/
const Page = () => {
  useEffect(() => {
    const $ = {
      cameraIndex: 0,
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
      createObjects() {
        // 2 创建立方体的几何体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        console.log(geometry);
        // 3 创建立方体的基础材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
        });
        // 4 创建3d物体对象
        const mesh = new THREE.Mesh(geometry, material);

        mesh.geometry.computeBoundingBox();

        console.log(mesh);

        this.scene.add(mesh);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          1,
          10
        );
        pCamera.position.set(0, 0, 3); //
        pCamera.up.set(0, -1, 0); //
        pCamera.lookAt(this.scene.position); //
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        // this.camera = pCamera

        // 创建相机对象
        const watcherCamera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          0.1,
          1000
        );
        watcherCamera.position.set(2, 2, 6);
        watcherCamera.lookAt(this.scene.position);
        this.watcherCamera = watcherCamera;
        this.scene.add(watcherCamera);
        this.camera = watcherCamera;

        // 通过camera计算出视锥
        const frustum = new THREE.Frustum();
        this.pCamera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果
        frustum.setFromProjectionMatrix(
          new THREE.Matrix4().multiplyMatrices(
            this.pCamera.projectionMatrix,
            this.pCamera.matrixWorldInverse
          )
        ); // 得到视锥体的矩阵

        const result = frustum.intersectsBox(this.mesh.geometry.boundingBox);

        console.log(result); // true为相交或包含
      },
      datGui() {
        const gui = new dat.GUI();
        const params = {
          color: 0x1890ff,
          wireframe: false,
          swatchCamera: () => {
            if (this.cameraIndex === 0) {
              // 是第一个相机
              this.camera = this.watcherCamera;
              this.cameraIndex = 1;
            } else {
              this.camera = this.pCamera;
              this.cameraIndex = 0;
            }
          },
        };

        // gui.add(this.camera.position,'x',0.1,10,0.1).name('positionX')
        gui
          .add(this.camera.position, "x")
          .min(-10)
          .max(10)
          .step(0.1)
          .name("positionX");
        gui.add(this.camera.rotation, "x", 0.1, 10, 0.1).name("rotationX");
        gui.add(this.pCamera, "near", 0.01, 10, 0.01).onChange((val) => {
          console.log(val);
          this.pCamera.near = val;
          this.pCamera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果

          this.camera.updateProjectionMatrix();
          this.cameraHelper.update();

          // 通过camera计算出视锥
          const frustum = new THREE.Frustum();

          this.pCamera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果
          // frustum.setFromProjectionMatrix(
          //   new THREE.Matrix4().multiplyMatrices(
          //     this.pCamera.projectionMatrix,
          //     this.pCamera.matrixWorldInverse
          //   )
          // ); // 得到视锥体的矩阵

          // const result = frustum.intersectsBox(this.mesh.geometry.boundingBox);

          // console.log(result); // true为相交或包含
        });
        gui.add(this.pCamera, "far", 1, 100, 1).onChange((val) => {
          console.log(val);
          this.pCamera.far = val;
          this.pCamera.updateProjectionMatrix();
        });

        gui.add(this.camera, "zoom", 0.1, 10, 0.1).onChange((val) => {
          console.log(val);
          this.camera.zoom = val;
          this.camera.updateProjectionMatrix();
        });

        gui.add(params, "wireframe").onChange((val) => {
          this.mesh.material.wireframe = val;
        });
        console.log(this.camera);
        gui.add(this.camera, "fov", 40, 150, 1).onChange((val) => {
          this.camera.fov = val;
          this.camera.updateProjectionMatrix();
        });

        gui.add(params, "swatchCamera").onChange((val) => {});
        gui.addColor(params, "color").onChange((val) => {
          console.log(val, this.mesh);
          this.mesh.material.color.set(val);
        });
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const cameraHelper = new THREE.CameraHelper(this.pCamera);
        // 创建辅助平面
        // const gridHelper = new THREE.GridHelper()
        this.scene.add(axesHelper, cameraHelper);

        this.cameraHelper = cameraHelper;
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
        // this.mesh.rotation.y += 0.01;
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
