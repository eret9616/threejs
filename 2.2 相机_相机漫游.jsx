import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { HeartCurve } from "three/examples/jsm/curves/CurveExtras";

/*
    1. lookAt的作用
    2. 曲线的分解,给取现分成n个段
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
          0.1,
          1000
        );
        pCamera.position.set(0, 0, 20); //
        // pCamera.up.set(0,-1,0) //
        pCamera.lookAt(this.scene.position); //
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;

        // 创建相机对象
        const watcherCamera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          0.1,
          1000
        );
        watcherCamera.position.set(0, 0, 20);
        watcherCamera.lookAt(this.scene.position);
        this.watcherCamera = watcherCamera;
        this.scene.add(watcherCamera);
        // this.camera = watcherCamera;

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
      curveGenerator() {
        const curve = new HeartCurve(1);
        const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.01, 8, true);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
        });
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);

        // 把曲线分割成3000段
        this.points = curve.getPoints(3000);

        // pi是弧度 2pi 是360度，所以pi/2是90度
        tubeMesh.rotation.x = -Math.PI / 2; // 沿x轴旋转90度
        this.scene.add(tubeMesh);
        this.curve = curve;

        const sphereGrometry = new THREE.SphereGeometry(0.5, 32, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const sphereMesh = new THREE.Mesh(sphereGrometry, sphereMaterial);
        // 这个mesh放到p相机的位置
        sphereMesh.position.copy(this.pCamera.position);
        this.sphereMesh = sphereMesh;
        this.scene.add(sphereMesh);
      },
      datGui() {
        const gui = new dat.GUI();
        const params = {
          color: 0x1890ff,
          wireframe: false,
          swatchCamera: () => {
            this.orbitControls.dispose(); // 销毁旧的控制器

            if (this.cameraIndex === 0) {
              // 是第一个相机
              this.camera = this.watcherCamera;
              this.cameraIndex = 1;
            } else {
              this.camera = this.pCamera;
              this.cameraIndex = 0;
            }
            this.orbitControls = new OrbitControls(this.camera, this.canvas);
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
        this.scene.add(axesHelper, cameraHelper);
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
      count: 0, // 当前点的索引
      moveCamera() {
        const index = this.count % this.points.length; //
        const point = this.points[index];
        const nextPoint =
          this.points[index + 1 >= this.points.length ? 0 : index + 1];

        this.pCamera.position.set(point.x, 0, -point.y);
        this.pCamera.lookAt(nextPoint.x, 0, -nextPoint.y); // 让人眼视角沿着路径观察
        this.sphereMesh.position.set(point.x, 0, -point.y);
        this.count++;
      },
      tick() {
        // this.mesh.rotation.y += 0.01;
        // update objects
        this.orbitControls.update();
        this.moveCamera();

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
        this.curveGenerator();
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
