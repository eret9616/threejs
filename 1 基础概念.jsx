import { useEffect } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const Page = () => {
  useEffect(() => {
    console.log(THREE);
    const canvas = document.getElementById('c');


    // const canvas = document.getElementById("canvas")
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // threejs codes
    /*
      1 有锯齿
      2 没有3d立体效果
      3 6个面能不能有不同颜色
    */
    // 1 创建3D场景对象
    const scene = new THREE.Scene()
    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper()
    // 创建辅助平面
    const gridHelper = new THREE.GridHelper()


    scene.add(axesHelper,gridHelper)

    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
    const directionalLight = new THREE.DirectionalLight(0xffffff,0.5)
    scene.add(ambientLight,directionalLight)

    // 2 创建立方体的几何体
    const geometry = new THREE.BoxGeometry(1,1,1)
    console.log(geometry)



    const faces = []
    for(let i = 0;i<geometry.groups.length;i++){
      const material = new THREE.MeshBasicMaterial({
        color:0xffffff*Math.random()
      })
      faces.push(material)
    }



    // 3 创建立方体的基础材质
    // const material = new THREE.MeshLambertMaterial({
    //     color:0x1890ff
    // })
    // 4 创建3d物体对象
    const mesh = new THREE.Mesh(geometry,faces)


    scene.add(mesh)

    // 创建相机对象
    const camera = new THREE.PerspectiveCamera(75,width / height) // 画布的宽高比

    // 设置相机位置
    camera.position.set(2,2,3) // x轴2 y轴2 z轴34

    // 设置相机朝向
    camera.lookAt(scene.position)
    // 将相机添加到场景中
    scene.add(camera)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias:true
    })
    // 设置渲染器屏幕像素比
    renderer.setPixelRatio(window.devicePixelRatio || 1)

    // 设置渲染器大小
    renderer.setSize(width,height)
    // 执行渲染
    renderer.render(scene,camera)


    const orbitControls = new OrbitControls(camera,canvas)
    orbitControls.enableDamping = true

    // 添加性能监控器
    const stats = new Stats();
    stats.setMode(0)
    document.body.appendChild(stats.domElement)

    const clock = new THREE.Clock()

    const tick = ()=>{
      const elapsedTime = clock.getElapsedTime()
      console.log(elapsedTime);

      // mesh.rotation.y+= elapsedTime / 1000
      // mesh.position.x += elapsedTime / 1000
      // mesh.scale.x += elapsedTime / 1000
      // mesh.position.x = Math.cos(elapsedTime)
      // mesh.position.y = Math.sin(elapsedTime)
      camera.position.x = Math.cos(elapsedTime)
      camera.position.y = Math.sin(elapsedTime)
      // 常用的是让相机运动

      orbitControls.update()
      stats.update()
      renderer.render(scene,camera)
      window.requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('resize',()=>{
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth,window.innerHeight)
    })
  }, []);

  return <>
    <canvas id="c" />;
  </>
};

export default Page;
