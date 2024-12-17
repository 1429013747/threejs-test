<template>
  <div class="container">
    <button
      style="z-index: 99; position: absolute"
      @click="
        () => {
          $router.push('/');
        }
      "
    >
      index
    </button>
    <div class="blocker" ref="blocker">
      <div class="instructions" ref="instructions">
        <p style="font-size: 36px">Click to play</p>
        <p>
          Move: WASD<br />
          Jump: SPACE<br />
          Look: MOUSE
        </p>
      </div>
    </div>
    <div class="map-house-box">
      <div class="mapHouseContainer" ref="threeBox"></div>
    </div>
    <div class="info2" ref="infoRef">
      <p>名称:服务器</p>
      <p>所属机柜:机柜B7</p>
      <p>IP地址:10.71.80.202</p>
      <p>设备类型:服务器</p>
      <p>网络连接:正常</p>
      <p>关联应用系统:无</p>
      <p>设备状态:正常</p>
      <p>告警数量:0</p>
    </div>
  </div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as TWEEN from "@tweenjs/tween.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入gui
import dat from "dat.gui"; // 引入 Axios
import axios from "axios";

import { throttle } from "@/utils/conmon";

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

      selControls: null, //选中的控件
      moveForward: null, // 前进
      moveBackward: null, // 后退
      moveLeft: null, // 左移
      moveRight: null, // 右移
      canJump: null, // 跳跃
      prevTime: performance.now(), // 上一次时间
      velocity: new THREE.Vector3(), // 移动速度
      direction: new THREE.Vector3(), // 移动方向
      viewBool: true, //true表示第三人称，false表示第一人称
    };
  },
  activated() {},
  computed: {},
  wacth: {},
  created() {},
  mounted() {
    this.$refs.threeBox.addEventListener("click", this.onmodelclick);
    this.clock = new THREE.Clock(); // 创建时钟
    this.init(); // 初始化
  },
  methods: {
    //获取设备数据（接口）
    getJgData(roomId, jgId) {
      return new Promise((resolve, reject) => {
        // 发送 GET 请求
        // this.cabinetAssetsList({ roomUuid: roomId, cabinetUuid: jgId }).then((res) => {
        //   if (res.success) {
        //     resolve(res.data);
        //   }
        // });
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
      this.loadGLTF("/source/拱墅大楼.gltf", [0, 0, -6345], [0.4, 0.4, 0.4]); // 加载 GLTF 模型
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
      const element = this.$refs.threeBox;
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
      // 创建坐标系
      const axesHelper = new THREE.AxesHelper(100000);
      // 把坐标系添加到场景中
      this.scene.add(axesHelper);
      // 创建渲染器
      const element = this.$refs.threeBox;
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
        alpha: false, // 透明背景
        side: THREE.DoubleSide,
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
      // this.controls.update();
      this.keyboardControl();
      // 递归调用渲染函数
      requestAnimationFrame(this.render);
      // 更新 TWEEN
      this.tweenRemove && this.tweenRemove.update();
      this.tweenEnter && this.tweenEnter.update();
    },
    // 创建控件对象
    createControls() {
      // 创建控件对象
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // // this.controls.enableDamping = true; // 打开阻尼(默认false)
      // // this.controls.dampingFactor = 0.25; // 设置阻尼系数
      // // this.controls.enableRotate = true; // 开启旋转(默认true)
      // // this.controls.enableZoom = true; // 开启缩放(默认true)
      // // this.controls.enablePan = true; // 开启平移(默认true)
      // // this.controls.autoRotate = true; // 开启自动旋转(默认false)
      // // this.controls.autoRotateSpeed = 2; //设置旋转速度
      // // this.controls.enabled = true; // 开启控件(默认true)
      // // this.controls.target.x = 0; // 设置控件焦点x
      // // this.controls.target.y = 0; // 设置控件焦点y
      // // this.controls.target.z = 0; // 设置控件焦点z
      // // this.controls.object.rotation.set(Math.PI / 4, Math.PI / 4, 0);
      // this.controls.update();
      this.selView();
    },
    // 键盘控制视角1
    keyboardControl() {
      const time = performance.now(); //eslint-disable-line
      if (this.selControls) {
        if (this.selControls.isLocked) {
          const delta = (time - this.prevTime) / 1000; // 获取两帧之间的时间间隔
          this.velocity.x -= this.velocity.x * 10.0 * delta; // 控制x移动的速度
          this.velocity.z -= this.velocity.z * 10.0 * delta; // 控制z移动的速度
          this.velocity.y -= 9.8 * 200.0 * delta; // 控制跳跃的高度
          this.direction.normalize(); // 这确保了各个方向的一致运动
          if (this.moveForward) {
            this.velocity.z -= this.direction.z + 2100 * delta; // 可控制z移动的速度
          }
          if (this.moveBackward) {
            this.velocity.z += this.direction.z + 2100 * delta; // 可控制z移动的速度
          }
          if (this.moveRight) {
            this.velocity.x -= this.direction.x + 2100 * delta; // 可控制x移动的速度
          }
          if (this.moveLeft) {
            this.velocity.x += this.direction.x + 2100 * delta; // 可控制x移动的速度
          }

          this.selControls.moveRight(-this.velocity.x * delta);
          this.selControls.moveForward(-this.velocity.z * delta);
          this.selControls.getObject().position.y += this.velocity.y * delta; // new behavior

          if (this.selControls.getObject().position.y < 5) {
            this.velocity.y = 0;
            this.selControls.getObject().position.y = 5; // 视角锁定时y轴的高度
            // this.selControls.position.set(0, 5, 10);
            this.canJump = true;
          }
        }
        this.prevTime = time;
      }
    },
    // 键盘控制视角2
    // keyboardControl() {
    //   const time = performance.now(); //eslint-disable-line
    //   if (this.selControls) {
    //     if (this.selControls.isLocked) {
    //       const delta = (time - this.prevTime) / 1000;
    //       // this.direction.setFromMatrixColumn(this.selControls.getObject().matrix, 0); // 右方向
    //       // this.direction.y = 0; // 重置y方向

    //       this.direction.normalize(); // 这确保了各个方向的一致运动
    //       this.velocity = new THREE.Vector3(0, 0, 0);
    //       if (this.moveForward) {
    //         this.velocity.z -= this.direction.z + 2400 * delta;
    //       }
    //       if (this.moveBackward) {
    //         this.velocity.z += this.direction.z + 2400 * delta;
    //       }
    //       if (this.moveRight) {
    //         this.velocity.x -= this.direction.x + 2400 * delta;
    //       }
    //       if (this.moveLeft) {
    //         this.velocity.x += this.direction.x + 2400 * delta;
    //       }
    //       this.selControls.moveForward(-this.velocity.z * delta);
    //       this.selControls.moveRight(-this.velocity.x * delta);
    //       this.selControls.getObject().position.y = 600;
    //     }
    //     this.prevTime = time;
    //   }
    // },
    // 锁定第一视角
    selView() {
      this.selControls = new PointerLockControls(this.camera, document.body);
      console.log(this.selControls.getObject(), "this.selControls.getObject()");
      console.log(this.selControls, "this.selControls.getObject()");
      this.$refs.blocker.addEventListener(
        "click",
        throttle(() => {
          this.selControls.lock(); // 锁定第一视角;
        }, 1500)
      );

      this.selControls.addEventListener("lock", () => {
        if (this.$refs.blocker) this.$refs.blocker.style.display = "none";
      });

      this.selControls.addEventListener("unlock", () => {
        if (this.$refs.blocker) this.$refs.blocker.style.display = "block";
      });

      document.addEventListener("keydown", this.onKeyDown, false);
      document.addEventListener("keyup", this.onKeyUp, false);
    },

    onKeyDown(event) {
      console.log("🚀 ~ onKeyDown ~ event:", event);
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this.moveForward = true;
          break;

        case 37: // left
        case 65: // a
          this.moveLeft = true;
          break;

        case 40: // down
        case 83: // s
          this.moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          this.moveRight = true;
          break;

        case 32: // space
          if (this.canJump === true) this.velocity.y += 950;
          this.canJump = false;
          break;

        case 86: // space
          if (this.viewBool) {
            // 切换到第一人称
            this.camera.position.z = 1; //相机在人前面一点 看不到人模型即可(第一人称)
          } else {
            // 切换到第三人称
            this.camera.position.z = -2.3; //相机在人后面一点（第三人称）
          }
          this.viewBool = !this.viewBool;
          break;
      }
    },
    onKeyUp(event) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          this.moveForward = false;
          break;

        case 37: // left
        case 65: // a
          this.moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          this.moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          this.moveRight = false;
          break;
      }
    },

    // 创建一个长方体
    createBox() {
      // 创建一个几何体
      const geometry = new THREE.BoxGeometry(1000, 1000, 100);
      // 创建一个基础材质
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // 创建一个网格
      const cube = new THREE.Mesh(geometry, material);
      // 旋转网格45°
      cube.rotateX(Math.PI / 4);
      // 将网格添加到场景中
      this.scene.add(cube);
    },
    // 加载建筑模型
    loadGLTF(url, position, scale) {
      //  //创建解码器
      // const dracoLoader = new DRACOLoader();
      // // 设置 Draco 解码器的路径
      // dracoLoader.setDecoderPath(
      //   "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      // );
      // 创建 GLTF 加载器
      const loader = new GLTFLoader();
      //加载模型
      loader.load(
        url,
        (gltf) => {
          console.log("🚀 ~ loader.load ~ gltf:", gltf);
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.frustumCulled = false; // 不裁剪
              child.castShadow = true; // 投影
              // child.receiveShadow = false; // 接收投影
              // child.material.side = THREE.DoubleSide; // 双面渲染
              // child.material.flatShading = true; // 平滑着色
              child.material.emissive = child.material.color; // 物体自发光
              child.material.emissiveMap = child.material.map; // 物体自发光贴图
            }
          });
          // 创建一个组
          this.buildingGroup = new THREE.Group();
          // 创建一个组 （这样可以移动模型，其他办法暂时没有想到）
          this.buildingGroup.add(...gltf.scene.children);
          this.buildingGroup.position.y = position[1]; // 设置y轴位置
          this.buildingGroup.position.z = position[2]; // 设置y轴位置
          this.buildingGroup.scale.set(...scale); // 设置缩放
          this.buildingGroup.visible = false;
          this.scene.add(this.buildingGroup); // 把组添加到场景中
          this.animateModelEnter(this.buildingGroup, scale);
          // 计算组模型的外边框
          const box = new THREE.Box3().setFromObject(this.buildingGroup);
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
      // 阻止默认行为
      e.preventDefault();
      // 获取鼠标在屏幕上的位置
      const element = this.$refs.threeBox;
      const rect = element.getBoundingClientRect();
      // 计算鼠标在屏幕上的位置（注意是加载整个场景的dom元素）
      const mouse = new THREE.Vector2((e.offsetX / rect.width) * 2 - 1, -(e.offsetY / rect.height) * 2 + 1);
      //光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
      const raycaster = new THREE.Raycaster();
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, this.camera);
      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects(this.scene.children);
      console.log("🚀 ~ onmodelclick ~ intersects:", intersects);
      if (intersects.length > 0) {
        // 计算模型的外边框
        // const box = new THREE.Box3().setFromObject(intersects[0].object);
        // // 创建一个边框，把模型放进去（就是box）
        // const helper = new THREE.Box3Helper(box, 0xffff00);
        // // 把计算后有模型的边框添加到场景中
        // this.scene.add(helper);
        // //一秒后删除
        // setTimeout(() => {
        //   this.scene.remove(helper);
        // }, 1000);
        // 过滤出设备模型 light
        const lightList = this.filterModel(intersects, "light");
        if (lightList.length > 0) {
          this.animateModelRemove(this.buildingGroup);
          return;
        }
        // 过滤出设备模型 device
        const deviceList = this.filterModel(intersects, "device");
        //创建弹框并设置位置
        if (deviceList.length > 0) {
          this.createAdvertisement(e);
          return;
        }
        // 过滤出设备模型 door
        const doorList = this.filterModel(intersects, "door");
        // 缓存中有则不再允许点击
        if (doorList.length <= 0 || this.cachesModels.has(doorList[0].object)) {
          return;
        }
        this.cachesModels.add(doorList[0].object);
        const id = doorList[0].object.name.split("-")[1];
        // 获取机柜实时数据
        this.deviceList = await this.getJgData(this.roomId, id);
        if (doorList[0] && this.deviceList.length > 0) {
          // 计算模型的外边框
          const box = new THREE.Box3().setFromObject(doorList[0].object.parent.parent);
          // 通过外边框计算模型的中心点
          const center = box.getCenter(new THREE.Vector3());
          // 计算模型的中心点到世界中心的偏移量
          const positionToWorldCenter = new THREE.Vector3().subVectors(center, new THREE.Vector3(0, 0, 0));
          // console.log(positionToWorldCenter, "positionToWorldCenter");
          const height = box.max.y - box.min.y; // Y轴偏移
          const offsetX = positionToWorldCenter.x; // X轴偏移
          const offsetZ = positionToWorldCenter.z; // Z轴偏移
          // 加载模型
          this.deviceList.forEach((el) => {
            const match = el.gasCabinteAddress.match(/^\d+/);
            const offsetY = Number(match[0]);
            if (match) {
              // 判断设备是几u
              const deviceNum = this.computedU(match.input);
              // 加载模型
              this.loadModel(`/source/device-${el.gasStockType + deviceNum}.gltf`, true, height, offsetX, offsetY, offsetZ, el.uuid);
            }
          });
        }
      }
    },
    // 加载设备模型
    loadModel(url, isPlay, height, offsetX, offsetY, offsetZ, _uuid) {
      const loader = new GLTFLoader();
      loader.load(
        url,
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
          // 创建一个组 （这样可以移动模型，其他办法暂时没有想到）
          const cityGroup = new THREE.Group();
          // 把模型添加到组中
          cityGroup.add(...gltf.scene.children);
          cityGroup.position.x = offsetX;
          cityGroup.position.z = offsetZ;
          cityGroup.position.y += offsetY * (height / 42);
          cityGroup.rotateY(Math.PI);
          //给每个设备绑定id
          cityGroup.name = _uuid;
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
    //移除所有模型(并且释放资源)
    destroyScene(buildingGroup) {
      if (!buildingGroup) {
        return;
      }
      //先移除所有模型
      this.scene.remove(buildingGroup);
      //释放资源
      buildingGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material && object.material.map) {
            object.material.map.dispose();
          }
          object.material.dispose();
        }
      });
    },
    //隐藏所有模型
    visibleScene(scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.visible = false;
        }
      });
    },
    //显示所有模型动画
    animateModelEnter(model, scale) {
      this.tweenEnter = new TWEEN.Tween({
        scale: [0, 0, 0],
      })
        .to(
          {
            scale: scale,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ scale }) => {
          model.scale.set(...scale);
          model.visible = true;
        })
        .onComplete(() => {
          this.tweenEnter = null;
        })
        .start();
    },
    //模型移除动画
    animateModelRemove(model) {
      this.tweenRemove = new TWEEN.Tween({
        z: -6345,
        scale: [0.4, 0.4, 0.4],
      })
        .to(
          {
            z: -12345,
            scale: [0, 0, 0],
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ z, scale }) => {
          model.position.z = z;
          model.scale.set(...scale);
          // model.traverse((object) => {
          //   console.log("🚀 ~ model.traverse ~ object:", object);
          //   if (object instanceof THREE.Mesh) {
          //     object.material.opacity = 0;
          //   }
          // });
        })
        .onComplete(() => {
          this.destroyScene(model);
          this.loadGLTF("/source/拱墅中心机房.gltf", [0, 345, 0], [1, 1, 1]);
        })
        .start();
    },
    //创建弹框并设置位置
    createAdvertisement(e) {
      let offsetX = e.offsetX;
      let offsetY = e.offsetY;
      const infoDomHeight = this.$refs.infoRef.clientHeight;
      if (offsetY <= infoDomHeight / 1.5) {
        offsetY = offsetY + infoDomHeight / 1.5;
      }
      if (offsetX <= infoDomHeight) {
        offsetX = offsetX + infoDomHeight;
      }
      this.$refs.infoRef.style = `transform: translate(${offsetX + 20}px, ${offsetY - 150}px);opacity:1;`;
      window.addEventListener("mousemove", (e) => {
        if (this.$refs.infoRef) this.$refs.infoRef.style = "opacity:0";
      });
    },
    //让模型自适应窗口
    onWindowResize() {
      const element = this.$refs.threeBox;
      if (element) {
        const width = element.clientWidth; // 窗口宽度
        const height = element.clientHeight; // 窗口高度
        this.camera.aspect = width / height; // 设置相机宽高比
        this.camera.updateProjectionMatrix(); // 更新相机投影矩阵
        this.renderer.setSize(width, height); // 设置渲染器大小
      }
      window.addEventListener("resize", this.onWindowResize, false);
    },
    //过滤模型
    filterModel(intersects, name) {
      if (name === "door") {
        return intersects.filter((el) => el.object.name.split("-")[0] === name);
      }
      if (name === "device") {
        return intersects.filter((el) => el.object.name.split("-")[0] === name);
      }
      if (name === "light") {
        return intersects.filter((el) => el.object.name.split("-")[0] === name);
      }
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
  beforeDestroy() {
    this.$refs.threeBox.removeEventListener("click", this.onmodelclick, false);
    window.removeEventListener("resize", this.onWindowResize, false);
    document.removeEventListener("keydown", this.onKeyDown, false);
    document.removeEventListener("keyup", this.onKeyUp, false);
  },
};
</script>

<style scoped>
.container {
  position: relative;

  .blocker {
    position: absolute;
    width: 100%;
    height: 700px;
    background-color: rgba(138, 135, 135, 0.5);
    border-radius: 2.5rem 2.5rem 2rem 2rem !important;
    z-index: 2;
  }

  .instructions {
    width: 100%;
    height: 700px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }

  .map-house-box {
    /* width: 18rem;
    height: 11rem;
    left: 50%; */
    width: 100%;
    height: 700px;
    position: absolute;
    top: -1.38rem;
    right: 0;
    margin-left: -9rem;
    padding: 1.35rem 0.25rem 2.2rem;

    .mapHouseContainer {
      width: 100%;
      height: 100%;
      background: #2d4057 !important;
      border-radius: 2.5rem 2.5rem 2rem 2rem !important;
      box-shadow: 1px 2px 20px 10px #0c1f2d;
      overflow: hidden;
    }
  }

  .info2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 220px;
    background-color: rgba(255, 255, 255, 0.5);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    opacity: 0;
    font-size: 19px;
    color: #000;
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
