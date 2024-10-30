<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入gui
import dat from "dat.gui"; // 引入 Axios
import axios from "axios";

export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      controls: null, // 控件
      clock: null, // 时钟
      mixer: null, // 动画混合器
      action: null, // 动画
      cameraFolder: null, // 相机gui
      loader: null, // 加载器
      gui: null, // gui
      deviceList: {},
      roomId: "FEA02F8D097046CCB28959372D680B7C",
      cachesModels: new WeakSet(),
    };
  },
  activated() {},
  computed: {},
  wacth: {},
  created() {},
  mounted() {
    const element = document.getElementById("container");
    element.addEventListener("click", this.onmodelclick);
    this.clock = new THREE.Clock(); // 创建时钟
    this.init(); // 初始化
  },
  methods: {
    //获取设备数据（接口）
    getJgData(roomId, jgId) {
      return new Promise((resolve, reject) => {
        // 发送 GET 请求
        axios({
          url: `/risen-dyw-api/public/cockpit/assets/cabinetAssetsList?roomUuid=${roomId}&cabinetUuid=${jgId}`,
          method: "post", //get
        })
          .then(async (response) => {
            const { data } = response;
            if (data.success) {
              // this.deviceList = await data.data;
              resolve(data.data);
            }
          })
          .catch((error) => {
            console.error("请求出错：", error);
          });
      });
    },
    // 初始化
    init() {
      this.createScene(); // 创建场景
      this.createCamera(); // 创建相机
      this.createLight(); // 创建光源
      this.loadGLTF(); // 加载 GLTF 模型
      // this.createBox(); // 加载 GLTF 模型
      // this.gui(); // 创建GUI
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      this.render(); // 渲染
      this.onWindowResize(); //让模型自适应窗口
    },
    // 创建GUI
    createGui() {
      this.gui = new dat.GUI();
      // 调整相机gui
      this.cameraFolder = this.gui.addFolder("Camera");
      this.cameraFolder.add(this.camera.position, "x", -10000, 10000);
      this.cameraFolder.add(this.camera.position, "y", -10000, 20000);
      this.cameraFolder.add(this.camera.position, "z", -10000, 20000);
      this.cameraFolder.add(this.camera.rotation, "x", 0, Math.PI * 2);
      this.cameraFolder.add(this.camera.rotation, "y", 0, Math.PI * 2);
      this.cameraFolder.add(this.camera.rotation, "z", 0, Math.PI * 2);
      this.cameraFolder.open();
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene();
    },
    // 创建光源
    createLight() {
      const pointLight = new THREE.PointLight(0xffffff, 1.0); // 点光源
      pointLight.position.set(40, 10000, 0); // 设置光源位置
      // pointLight.castShadow = true; // 允许光源产生阴影
      // pointLight.shadow.mapSize.width = 1024; // 设置阴影贴图宽度
      // pointLight.shadow.mapSize.height = 1024; // 设置阴影贴图高度
      // pointLight.shadow.camera.near = 1; // 设置阴影相机近裁剪面
      // pointLight.shadow.camera.far = 100000; // 设置阴影相机远裁剪面
      // pointLight.shadow.camera.left = -10000; // 设置阴影相机左裁剪面
      // pointLight.shadow.camera.right = 10000; // 设置阴影相机右裁剪面
      // pointLight.shadow.camera.top = 10000; // 设置阴影相机上裁剪面
      // pointLight.shadow.camera.bottom = -10000; // 设置阴影相机下裁剪面
      //创建一个虚拟的球形网格 Mesh 的辅助对象来模拟 点光源 PointLight.
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
      this.scene.add(pointLightHelper);
      this.scene.add(pointLight);
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(60, k, 0.1, 120000);
      // this.camera.position.set(0, 2, 0); // 设置相机位置
      this.camera.position.set(0, 7670, 8663); // 设置相机位置
      this.camera.lookAt(0, 0, 0); // 设置相机方向
      // this.camera.rotationX = 5.5;
      //展示相机
      // const cameraHelper = new THREE.CameraHelper(this.camera);
      // this.scene.add(cameraHelper);

      this.scene.add(this.camera);
    },
    // 创建渲染器
    createRender() {
      // 创建标尺
      const axesHelper = new THREE.AxesHelper(100000);
      // 把标尺添加到场景中
      this.scene.add(axesHelper);
      // 创建渲染器
      const element = document.getElementById("container");
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
        alpha: false, // 透明背景
      });
      this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染器大小
      this.renderer.shadowMap.enabled = true; // 启用阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 阴影类型
      this.renderer.setClearColor(0x2d4057, 1); // 设置渲染器背景颜色
      element.appendChild(this.renderer.domElement); // 将渲染器添加到页面中
    },
    // 渲染
    render() {
      // 获取两帧之间的时间间隔
      const deltaTime = this.clock.getDelta();
      // 更新动画
      this.mixer && this.mixer.update(deltaTime);
      // this.camera.lookAt(0, 0, 0); // 设置相机方向看向世界中心
      // 每一帧更新渲染
      this.renderer.render(this.scene, this.camera);
      // 每一帧更新控制器（不然设置控制器属性会是失效）
      this.controls.update();
      // 递归调用渲染函数
      requestAnimationFrame(this.render);
    },
    // 创建控件对象
    createControls() {
      // 创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.enableDamping = true; // 打开阻尼(默认false)
      // this.controls.dampingFactor = 0.25; // 设置阻尼系数
      // this.controls.enableRotate = true; // 开启旋转(默认true)
      // this.controls.enableZoom = true; // 开启缩放(默认true)
      // this.controls.enablePan = true; // 开启平移(默认true)
      // this.controls.autoRotate = true; // 开启自动旋转(默认false)
      // this.controls.autoRotateSpeed = 2; //设置旋转速度
      // this.controls.enabled = true; // 开启控件(默认true)
      // this.controls.target.x = 0; // 设置控件焦点x
      // this.controls.target.y = 0; // 设置控件焦点y
      // this.controls.target.z = 0; // 设置控件焦点z
      // this.controls.object.rotation.set(Math.PI / 4, Math.PI / 4, 0);
      this.controls.update();
    },
    // 创建一个长方体
    createBox() {
      // 创建一个几何体
      const geometry = new THREE.BoxGeometry(10, 10, 1);
      // 创建一个基础材质
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // 创建一个网格
      const cube = new THREE.Mesh(geometry, material);
      // 旋转网格45°
      cube.rotateX(Math.PI / 4);
      // 将网格添加到场景中
      this.scene.add(cube);
    },
    // 加载 GLTF 模型
    loadGLTF() {
      //  //创建解码器
      // const dracoLoader = new DRACOLoader();
      // // 设置 Draco 解码器的路径
      // dracoLoader.setDecoderPath(
      //   "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      // );
      // 创建 GLTF 加载器
      this.loader = new GLTFLoader();
      //加载模型
      this.loader.load(
        "/source/中心机房-空机柜(5).gltf",
        (gltf) => {
          console.log("🚀 ~ loader.load ~ gltf:", gltf);
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.frustumCulled = false; // 不裁剪
              child.castShadow = true; // 投影
              child.material.emissive = child.material.color; // 物体自发光
              child.material.emissiveMap = child.material.map; // 物体自发光贴图
            }
          });
          // 创建一个组
          const cityGroup = new THREE.Group();
          // 创建一个组 （这样可以移动模型，其他办法暂时没有想到）
          cityGroup.add(...gltf.scene.children);
          cityGroup.position.y = 345; // 设置y轴位置
          this.scene.add(cityGroup); // 把组添加到场景中
          // 计算组模型的外边框
          const box = new THREE.Box3().setFromObject(cityGroup);
          // 创建一个边框，把模型放进去（就是box）
          const helper = new THREE.Box3Helper(box, 0xffff00);
          // 获取组模型的中心点
          // this.centerJg = box.getCenter(new THREE.Vector3());
          // console.log("🚀 ~ loadGLTF ~ centerJg:", this.centerJg);
          // this.scene.add(helper);
          this.scene.add(...gltf.scene.children); // 把模型添加到场景中
          if (gltf.animations.length > 0) {
            // 获取模型中的动画
            const animations = gltf.animations;
            // 创建动画混合器
            this.mixer = new THREE.AnimationMixer(this.scene);
            // 创建动画动作
            this.action = this.mixer.clipAction(animations[0]);
            this.action.loop = THREE.LoopOnce; // 设置动画循环模式（一次）
            // this.action.loop = THREE.LoopRepeat; // 设置动画循环模式（重复）
            // this.action.play(); //播放动画
            this.action.clampWhenFinished = true; // 动画停留在最后一帧
          }
        },
        () => {
          // console.log("🚀 ~ //loader.load ~ xhr:", xhr);
        },
        (error) => {
          console.error("模型加载错误：", error);
        }
      );
    },
    // 点击模型
    async onmodelclick(e) {
      e.preventDefault();
      const element = document.getElementById("container");
      const rect = element.getBoundingClientRect();
      // 计算鼠标在屏幕上的位置（注意是加载整个场景的dom元素）
      const mouse = new THREE.Vector2(
        (e.offsetX / rect.width) * 2 - 1,
        -(e.offsetY / rect.height) * 2 + 1
      );
      //光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
      const raycaster = new THREE.Raycaster();
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, this.camera);
      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects(this.scene.children);
      console.log("🚀 ~ onmodelclick ~ intersects:", intersects);
      if (intersects.length > 0) {
        const temp = intersects.filter(
          (el) => el.object.name.split("-")[0] === "door"
        );
        console.log("🚀 ~ onmodelclick ~ temp:", temp);
        const object = temp[0];
        if (temp.length <= 0) return;
        if (this.cachesModels.has(object.object)) return;
        this.cachesModels.add(object.object);
        const id = object.object.name.split("-")[1];
        // 获取机柜实时数据
        this.deviceList = await this.getJgData(this.roomId, id);
        if (object && this.deviceList.length > 0) {
          // 计算模型的外边框
          const box = new THREE.Box3().setFromObject(object.object);
          // 通过外边框计算模型的中心点
          const center = box.getCenter(new THREE.Vector3());
          // 计算模型的中心点到世界中心的偏移量
          const positionToWorldCenter = new THREE.Vector3().subVectors(
            center,
            new THREE.Vector3(0, 0, 0)
          );
          // console.log(positionToWorldCenter, "positionToWorldCenter");
          const height = box.max.y - box.min.y; // Y轴偏移
          const offsetX = positionToWorldCenter.x; // X轴偏移
          const offsetZ = positionToWorldCenter.z - 200; // Z轴偏移
          // 加载模型
          this.deviceList.forEach((el) => {
            const match = el.gasCabinteAddress.match(/^\d+/);
            const offsetY = Number(match[0]);
            if (match) {
              // 判断设备是几u
              const deviceNum = this.computedU(match.input);
              // 加载模型
              this.loadModel(
                // `/source/FWQ${deviceNum}.gltf`,
                `/source/${el.gasStockType + deviceNum}.gltf`,
                true,
                height,
                offsetX,
                offsetY,
                offsetZ,
                object
              );
            }
          });
        }
        // 给点击到的模型添加一个边框
        if (intersects.length > 0) {
          // 计算模型的外边框
          const box = new THREE.Box3().setFromObject(intersects[0].object);
          // 创建一个边框，把模型放进去（就是box）
          const helper = new THREE.Box3Helper(box, 0xffff00);
          // 把计算后有模型的边框添加到场景中
          this.scene.add(helper);
          //一秒后删除
          setTimeout(() => {
            this.scene.remove(helper);
          }, 1000);
        }
      }
    },
    // 加载模型
    loadModel(url, isPlay, height, offsetX, offsetY, offsetZ, model) {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          // console.log("🚀 ~ loader.load ~ gltf:", gltf);
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.frustumCulled = false; // 不裁剪
              child.castShadow = true; // 投影
              child.material.emissive = child.material.color; // 物体自发光
              child.material.emissiveMap = child.material.map; // 物体自发光贴图
            }
          });
          // 创建一个组 （这样可以移动模型，其他办法暂时没有想到）
          const cityGroup = new THREE.Group();
          // 把模型添加到组中
          cityGroup.add(...gltf.scene.children);
          cityGroup.position.x = offsetX;
          cityGroup.position.z = offsetZ;
          cityGroup.position.y += offsetY * (height / 42);
          cityGroup.rotateY(Math.PI);
          // this.adjustModelAngle(cityGroup, offsetX);
          // 把分组后的模型添加到场景中
          this.scene.add(cityGroup);
          // 把模型添加到场景中
          this.scene.add(gltf.scene);

          if (isPlay) {
            this.action.play();
          }
        },
        () => {
          // console.log("🚀 ~ //loader.load ~ xhr:", xhr);
        },
        (error) => {
          console.error("模型加载错误：", error);
        }
      );
    },
    //调整模型角度
    adjustModelAngle(model, position) {
      console.log("🚀 ~ adjustModelAngle ~ position:", position);
    },
    //让模型自适应窗口
    onWindowResize() {
      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      this.camera.aspect = width / height; // 设置相机宽高比
      this.camera.updateProjectionMatrix(); // 更新相机投影矩阵
      this.renderer.setSize(width, height); // 设置渲染器大小
      window.addEventListener("resize", this.onWindowResize, false);
    },
    // 计算设备是几U
    computedU(str) {
      const temp = str.split("-");
      if (temp.length <= 1) {
        return "1U";
      } else {
        const match = temp[1].match(/^\d+/);
        const t = Number(match[0]) - Number(temp[0]) + 1 + "U";
        return t === "3U" ? "2U" : t;
      }
    },
  },
};
</script>
<style scoped>
#container {
  text-align: center;
  font-size: 20px;
  width: 100%;
  height: 600px;
}
</style>
