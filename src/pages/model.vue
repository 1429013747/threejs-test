<template>
  <div class="container">
    <div class="map-house-box">
      <div class="mapHouseContainer" ref="threeBox"></div>
    </div>
    <!-- <div v-show="showpage"> -->
    <div v-show="showpage">
      <div v-show="showLeftRight">
        <div class="leftMenu">
          <div class="title">机柜容量</div>
          <div class="jg-capacity">
            <div class="used">
              <div>已使用</div>
              <div class="process">
                <div class="inner-process"></div>
              </div>
              <div class="used-num">1028</div>
            </div>
            <div class="counts">
              <div class="jg-num">机柜总数</div>
              <div class="jg-count">3980</div>
            </div>
            <div class="used">
              <div>未使用</div>
              <div class="process2">
                <div class="inner-process2"></div>
              </div>
              <div class="used-num">2772</div>
            </div>
          </div>
          <div class="title">设备统计</div>
          <div ref="deviceChart" class="device-statistics"></div>
          <div class="title">设备状态统计</div>
          <div ref="deviceStatusChart" class="device-status-statistics"></div>
        </div>
        <div class="rightMenu">
          <div>
            <div v-show="showInfo.totalInfo">
              <div class="title">能耗</div>
              <div class="box">
                <div class="device-energy-efficiency" ref="energyEfficiency"></div>
                <div class="info-tip">
                  <div>
                    <p class="info-text">IT耗电量</p>
                    <p class="info-value">112.80 kWh</p>
                  </div>
                  <div>
                    <p class="info-text">制冷耗电量</p>
                    <p class="info-value">47.80 kWh</p>
                  </div>
                  <div>
                    <p class="info-text">总耗电量</p>
                    <p class="info-value">161.80 kWh</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-show="showInfo.wsdcgq">
              <div class="title">温湿度感应器</div>
              <div class="chart-box">
                <div class="temperature" ref="tempChart"></div>
                <div class="humidity" ref="humidityChart"></div>
              </div>
            </div> -->
            <div>
              <div class="title">PUE</div>
              <div ref="devicePue" class="device-PUE"></div>
            </div>

            <div class="title">设备占用情况</div>
            <div class="device-status">
              <div class="box-cw">
                <div class="circle1">
                  <div class="wave1"></div>
                  <div class="text-process">75%</div>
                </div>
              </div>
              <div class="info-tip">
                <div>
                  <p class="info-text">架式设备<span>89</span>台</p>
                </div>
                <div>
                  <p class="info-text">虚拟机<span>67</span>台</p>
                </div>
                <div>
                  <p class="info-text">机柜<span>44</span>台</p>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-else-if="showInfo.accessControl">
          <div class="title">门禁信息</div>
          <div class="table">
            <el-table :data="tableData">
              <el-table-column width="75" align="center" prop="people" label="人员"> </el-table-column>
              <el-table-column width="75" align="center" label="单位">
                <template slot-scope="scope">
                  <span class="rowWidth">{{ scope.row.company }}</span>
                </template>
              </el-table-column>
              <el-table-column width="105" align="center" prop="time" label="时间"> </el-table-column>
              <el-table-column label="事由">
                <template slot-scope="scope">
                  <span class="rowWidth">{{ scope.row.reason }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> -->
        </div>
      </div>
      <div class="bottomMenu">
        <div class="box-menu">
          <el-button @click="change('动环')">动环</el-button>
          <el-button @click="change('安防')">安防</el-button>
          <el-button @click="change('切换视角')">切换视角</el-button>
          <!-- <i class="el-icon-refresh-right" style="color: #fff; cursor: pointer; font-size: 0.3rem"></i> -->
          <div class="menu" v-show="menuShow">
            <div class="menu-box">
              <div class="menu-content">
                <p v-if="deviceShows.db" @click="showChangeInfo('db')">电表</p>
                <p v-if="deviceShows.sdlt" @click="showChangeInfo('sdlt')">市电列头柜</p>
                <p v-if="deviceShows.kt" @click="showChangeInfo('kt')">空调</p>
                <p v-if="deviceShows.wsdcgq" @click="showChangeInfo('wsdcgq')">温湿度感应器</p>
                <p v-if="deviceShows.lscgq" @click="showChangeInfo('lscgq')">漏水传感器</p>
                <p v-if="deviceShows.UPS" @click="showChangeInfo('UPS')">UPS</p>
                <p v-if="deviceShows.xdc" @click="showChangeInfo('xdc')">电池</p>
                <p v-if="deviceShows.pdg" @click="showChangeInfo('pdg')">配电柜</p>
                <p v-if="deviceShows.dlg" @click="showChangeInfo('dlg')">动力柜</p>
                <p @click="showChangeInfo('primary')">基础信息</p>
              </div>
            </div>
          </div>
          <div class="menu2" v-show="menuShow2">
            <div class="menu-box">
              <div class="menu-content">
                <p @click="showChangeInfo('mj')">门禁</p>
                <p @click="showChangeInfo('sxt')">摄像头</p>
                <p @click="showChangeInfo('xfsb')">消防</p>
              </div>
            </div>
          </div>
          <div class="menu3" v-show="menuShow3">
            <div class="menu-box">
              <div class="menu-content">
                <p @click="toggleView('global')">全局视角</p>
                <p @click="toggleView('prosonal')">第一人称视角</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗start -->
    <div class="info2" ref="infoRef">
      <p>
        名称: <span>{{ deviceDetail.deviceName ? deviceDetail.deviceName : '无' }}</span>
      </p>
      <p>
        所属机柜: <span>{{ deviceDetail.cabinetAddress ? deviceDetail.cabinetAddress : '无' }}</span>
      </p>
      <p>
        IP地址: <span>{{ deviceDetail.deviceIp ? deviceDetail.deviceIp : '无' }}</span>
      </p>
      <p>
        设备类型: <span>{{ deviceDetail.assetsType ? deviceDetail.assetsType : '无' }}</span>
      </p>
      <p>网络连接: <span>正常</span></p>
      <p>
        关联应用系统: <span>{{ deviceDetail.appName ? deviceDetail.appName : '无' }}</span>
      </p>
      <p>
        设备状态: <span>{{ deviceDetail.stockStatus ? deviceDetail.stockStatus : '无' }}</span>
      </p>
      <p>告警数量: <span>0</span></p>

      <p v-if="deviceDetail.deviceName === '迪普交换机'">关联网络设备: <span>迪普核心交换机(主)</span></p>
    </div>
    <div class="info2" ref="infoRef3">
      <p>机柜名称: <span>机柜B7</span></p>
      <p>机柜宽度: <span>800MM</span></p>
      <p>机柜高度: <span>2000MM</span></p>
      <p>机柜深度: <span>600MM</span></p>
      <p>机柜沉重: <span>100KG</span></p>
      <p>机柜材质: <span>镀锌板</span></p>
      <p>机柜容量: <span>42U</span></p>
      <p>已使用: <span>9U</span></p>
      <p>剩余: <span>33U</span></p>
    </div>

    <DialogListJfjcRecord :popType="JfjcRecordInfo" />
    <DialogListCamera :popType="cameraInfo" />
    <!-- 弹窗end -->
  </div>
</template>
<script>
import * as echarts from 'echarts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// SMAA抗锯齿通道
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

import DialogListJfjcRecord from '@/components/DialogList-JfjcRecord';
import DialogListCamera from '@/components/DialogList-camera';

export default {
  components: { DialogListJfjcRecord, DialogListCamera },
  props: {
    popType: { type: Object },
    modelInfo: { type: Object },
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      clock: null,
      mixer: null,
      action: null,
      cameraFolder: null,
      loader: null,
      gui: null,
      deviceList: [],
      showpage: false,
      deviceShows: {
        db: true,
        sdlt: true,
        kt: true,
        wsdcgq: true,
        lscgq: true,
        UPS: true,
        xdc: false,
        pdg: false,
        dlg: true,
      },
      showLeftRight: false,
      cachesModels: new WeakSet(),
      heartbeatTimer: null,
      deviceGroup: [],
      socket: null,
      deciceObject: {},
      cameras: {},
      i: 0,
      buildingGroup: null,
      deviceDetail: {},
      JfjcRecordInfo: {
        uuid: '',
        isShow: false,
        isShowEmpty: false,
        JfjcRecordList: [],
        pagination: {
          pageSizes: [10, 15, 20, 25],
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      },
      cameraInfo: {
        isShow: false,
        type: '',
        videoUrl: '',
      },
      data: [
        { value: 136, name: '服务器' },
        { value: 35, name: '配电柜' },
        { value: 33, name: '路由器' },
        { value: 28, name: '空调' },
      ],
      childNameObjects: {
        sxt: {
          url: '/source/imgs/camera.png',
          pos1: { x: 0, y: 2100, z: 360 },
          pos4: { x: 0, y: 2100, z: 0 },
          pos5: { x: -360, y: 2100, z: -380 },
        },
        mj: {
          url: '/source/imgs/accessControl.png',
          pos1: { x: 0, y: 2200, z: 0 },
          pos4: { x: 0, y: 2200, z: 0 },
          pos5: { x: 0, y: 2200, z: 0 },
        },
        lscgq: {
          url: '/source/imgs/leakageDevice.png',
          pos1: { x: 0, y: 700, z: 0 },
          pos4: { x: 0, y: 700, z: 0 },
          pos5: { x: 0, y: 700, z: 0 },
        },
        sdlt: {
          url: '/source/imgs/sdlt.png',
          pos1: { x: 0, y: 1800, z: 0 },
          pos4: { x: 0, y: 1800, z: 0 },
          pos5: { x: 0, y: 1800, z: 0 },
        },
        wsdcgq: {
          url: '/source/imgs/temperatureAndHumiditySensor.png',
          pos1: { x: -700, y: 2000, z: -260 },
          pos4: { x: -700, y: 2000, z: -260 },
          pos5: { x: -700, y: 2000, z: -260 },
        },
        UPS: {
          url: '/source/imgs/UPS.png',
          pos1: { x: -4400, y: 2100, z: 2100 },
          pos4: { x: -0, y: 2100, z: 0 },
          pos5: { x: 0, y: 2100, z: -160 },
        },
        kt: {
          url: '/source/imgs/airConditioner.png',
          pos1: { x: -200, y: 2100, z: 0 },
          pos4: { x: -200, y: 2100, z: 0 },
          pos5: { x: -1200, y: 2100, z: -300 },
        },
        db: {
          url: '/source/imgs/wattHourMeter.png',
          pos1: { x: 0, y: 2100, z: 100 },
          pos4: { x: 0, y: 2100, z: 100 },
          pos5: { x: 0, y: 2100, z: 100 },
        },
        xfsb: {
          url: '/source/imgs/fireControl.png',
          pos1: { x: 3800, y: 1700, z: 2520 },
          pos4: { x: 0, y: 1700, z: 0 },
          pos5: { x: 0, y: 1700, z: 0 },
        },
        xdc: {
          url: '/source/imgs/fireControl.png',
          pos1: { x: 3800, y: 1700, z: 2400 },
          pos4: { x: 0, y: 1700, z: 0 },
          pos5: { x: 0, y: 1700, z: 0 },
        },
        pdg: {
          url: '/source/imgs/fireControl.png',
          pos1: { x: 3800, y: 1700, z: 2400 },
          pos4: { x: 3800, y: 1700, z: 2400 },
          pos5: { x: -3660, y: 1700, z: 0 },
        },
        dlg: {
          url: '/source/imgs/fireControl.png',
          pos1: { x: 3800, y: 1700, z: 2400 },
          pos4: { x: 3800, y: 1700, z: 2400 },
          pos5: { x: 3800, y: 1700, z: 2400 },
        },
      },
      radio1: '安防',
      selControls: null, //选中的控件
      moveForward: null, // 前进
      moveBackward: null, // 后退
      moveLeft: null, // 左移
      moveRight: null, // 右移
      prevTime: performance.now(), // 上一次时间
      velocity: new THREE.Vector3(), // 移动速度
      direction: new THREE.Vector3(), // 移动方向
      flat: true,
      isLoaded: true,
      menuShow: false,
      menuShow2: false,
      menuShow3: false,
      roomList: [],
      cabinetObject: [],
      showInfo: {
        totalInfo: true,
      },
      tableData: [
        {
          people: '张塞非',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房cvss',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
        {
          people: 'xx',
          company: '森机房',
          time: '10/26 12:00',
          reason: '硬件故障',
        },
      ],
    };
  },
  activated() {},
  computed: {},
  watch: {
    modelInfo: {
      handler(newVal) {
        if (this.isLoaded) {
          while (this.deviceGroup.length > 0) {
            this.destroyScene(this.deviceGroup.shift());
          }
          this.destroyScene(this.buildingGroup);

          this.loadGLTF(`/source/${newVal.lou}.gltf`, [0, 0, -6345], [0.4, 0.4, 0.4]);
          this.showpage = false;
          this.menuShow = false;
          this.menuShow2 = false;
          this.menuShow3 = false;
          this.menuDisplay();
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.$refs.threeBox.addEventListener('dblclick', this.onmodelclick);
    // window.addEventListener('keydown', (e) => {
    //   e.preventDefault();
    //   if (e.code == 'Space') {
    //     this.toggleView('global');
    //     Object.keys(this.deciceObject).forEach((key) => {
    //       this.deciceObject[key].forEach((el) => {
    //         el.clicked = true;
    //         el.visible = true;
    //       });
    //     });
    //   }
    // });
    // window.addEventListener('mousedown', (e) => {
    //   this.menuShow2 = false;
    //   this.menuShow = false;
    // });
    this.clock = new THREE.Clock();
    this.init();
    this.chartUp();
  },
  methods: {
    menuDisplay() {
      const arr = ['拱墅中心机房', '文晖机房', '城运机房', '人防机房', '行政服务中心'];
      if (this.modelInfo.room == arr[0]) {
        this.deviceShows.db = true;
        this.deviceShows.sdlt = true;
        this.deviceShows.kt = true;
        this.deviceShows.wsdcgq = true;
        this.deviceShows.lscgq = true;
        this.deviceShows.UPS = true;
        this.deviceShows.xdc = false;
        this.deviceShows.pdg = false;
        this.deviceShows.dlg = false;
      } else if (this.modelInfo.room == arr[1]) {
        this.deviceShows.db = false;
        this.deviceShows.sdlt = true;
        this.deviceShows.kt = true;
        this.deviceShows.wsdcgq = true;
        this.deviceShows.lscgq = true;
        this.deviceShows.UPS = true;
        this.deviceShows.xdc = true;
        this.deviceShows.pdg = false;
        this.deviceShows.dlg = false;
      } else if (this.modelInfo.room == arr[2]) {
        this.deviceShows.db = false;
        this.deviceShows.sdlt = false;
        this.deviceShows.kt = true;
        this.deviceShows.wsdcgq = true;
        this.deviceShows.lscgq = true;
        this.deviceShows.UPS = false;
        this.deviceShows.xdc = false;
        this.deviceShows.pdg = true;
        this.deviceShows.dlg = false;
      } else if (this.modelInfo.room == arr[3]) {
        this.deviceShows.db = false;
        this.deviceShows.sdlt = false;
        this.deviceShows.kt = false;
        this.deviceShows.wsdcgq = true;
        this.deviceShows.lscgq = false;
        this.deviceShows.UPS = true;
        this.deviceShows.xdc = true;
        this.deviceShows.pdg = false;
        this.deviceShows.dlg = true;
      } else if (this.modelInfo.room == arr[4]) {
        this.deviceShows.db = false;
        this.deviceShows.sdlt = false;
        this.deviceShows.kt = true;
        this.deviceShows.wsdcgq = true;
        this.deviceShows.lscgq = true;
        this.deviceShows.UPS = true;
        this.deviceShows.xdc = true;
        this.deviceShows.pdg = true;
        this.deviceShows.dlg = false;
      }
    },
    clearShowModel() {
      Object.keys(this.deciceObject).forEach((key) => {
        this.deciceObject[key].forEach((el) => {
          this.scene.remove(el);
          el.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              if (object.material && object.material.map) {
                object.material.map.dispose();
              }
              object.material.dispose();
            }
          });
        });
      });
    },
    async toggleView(str) {
      this.menuShow3 = false;
      this.center = null;
      if (str === 'global') {
        this.animateCamera(this.camera.position, { x: 0, y: 7670, z: 8663 });
        this.flat = true;
        this.controls.enabled = true;
        this.controls.target.copy(new THREE.Vector3(0, 0, 0));
      } else {
        if (this.flat) {
          await this.animateCamera(this.camera.position, { x: 2000, y: 800, z: -3000 });
          this.flat = false;
        }
        this.controls.enabled = false;
        this.selView();
      }
    },
    keyboardControl() {
      const time = performance.now(); //eslint-disable-line
      if (this.selControls) {
        if (this.selControls.isLocked) {
          const delta = (time - this.prevTime) / 1000;
          this.velocity.x -= this.velocity.x * 10.0 * delta;
          this.velocity.z -= this.velocity.z * 10.0 * delta;
          this.direction.normalize(); // 这确保了各个方向的一致运动
          if (this.moveForward) {
            this.velocity.z -= this.direction.z + 3400 * delta;
          }
          if (this.moveBackward) {
            this.velocity.z += this.direction.z + 3400 * delta;
          }
          if (this.moveRight) {
            this.velocity.x -= this.direction.x + 3400 * delta;
          }
          if (this.moveLeft) {
            this.velocity.x += this.direction.x + 3400 * delta;
          }
          this.selControls.moveRight(-this.velocity.x * delta);
          this.selControls.moveForward(-this.velocity.z * delta);
          this.selControls.getObject().position.y = 1000;
        }
        this.prevTime = time;
      }
    },
    selView() {
      this.selControls = new PointerLockControls(this.camera, this.$refs.threeBox);
      this.selControls.pointerSpeed = 0.7;
      this.selControls.addEventListener('unlock', this.unlockSelControls);
      document.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('keyup', this.onKeyUp, false);
      this.selControls.lock();
    },

    unlockSelControls() {
      document.removeEventListener('keydown', this.onKeyDown, false);
      document.removeEventListener('keyup', this.onKeyUp, false);
      this.center = null;
      this.controls.enabled = true;
      this.camera.updateMatrixWorld();
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(this.camera.quaternion);
      const targetPosition = this.camera.position.clone().add(direction.multiplyScalar(1));
      this.controls.target.copy(targetPosition);

      this.selControls && this.selControls.dispose();
      this.selControls = null;
    },
    onKeyDown(event) {
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

        case 86: // v
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
    showChangeInfo(type) {
      this.menuShow = false;
      this.menuShow2 = false;
      this.outlinePass.selectedObjects = [];
      Object.keys(this.deciceObject).forEach((key) => {
        this.deciceObject[key].forEach((el) => {
          el.clicked = false;
          el.visible = false;
        });
      });
      if (type === 'primary') {
        this.showInfo.totalInfo = true;
        this.showLeftRight = !this.showLeftRight;
        this.$nextTick(() => {
          this.energyEfficiency();
          this.devicePue();
        });
        return;
      }
      this.deciceObject[type].forEach((el) => {
        el.clicked = true;
        el.visible = true;
      });
    },
    change(val) {
      this.menuShow3 = false;
      this.menuShow2 = false;
      this.menuShow = false;
      if (val == '动环') {
        this.menuShow = true;
      }
      if (val == '安防') {
        this.menuShow2 = true;
      }
      if (val == '切换视角') {
        this.menuShow3 = true;
      }
    },
    chartUp() {
      this.deviceChart();
      this.deviceStatusChart();
      this.energyEfficiency();
      this.devicePue();
      // this.tempChart();
      // this.humidityChart();
    },
    deviceChart() {
      const myChart = this.$echarts.init(this.$refs.deviceChart);
      const option = {
        title: {
          show: true,
          text: '232',
          subtext: 'IT设备总数',
          left: '34%',
          top: '36%',
          textAlign: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '0.2rem',
          },
          subtextStyle: {
            color: '#ccc',
            fontSize: '0.13rem',
          },
        },
        legend: {
          right: 'right',
          top: '20%',
          orient: 'vertical',
          icon: 'circle',
          itemHeight: 5,
          itemWidth: 5,
          textStyle: {
            //图例字体大小
            fontSize: '.1rem',
            color: '#B8DDFF',
            lineHeight: 15,
          },
          formatter: (name) => {
            let target;
            for (let i = 0; i < this.data.length; i++) {
              if (this.data[i].name == name) {
                target = this.data[i].value;
              }
            }
            return `${name}   ${target} `;
          },
        },
        color: ['#fdb876', '#feda70', '#46b29f', '#51a1dc'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              // borderColor: '#fff',
              // borderWidth: 2,
            },
            left: '-30%',
            hoverAnimation: false,
            label: {
              show: false,
              position: 'center',
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: 40,
            //     fontWeight: 'bold',
            //   },
            // },
            labelLine: {
              show: false,
            },
            data: this.data,
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    deviceStatusChart() {
      const myChart = this.$echarts.init(this.$refs.deviceStatusChart);
      const option = {
        legend: {
          top: '5%',
          right: '0',
          orient: 'horizontal',
          icon: 'circle',
          itemHeight: 8,
          itemWidth: 8,
          textStyle: {
            //图例字体大小
            fontSize: '.1rem',
            color: '#B8DDFF',
            lineHeight: 15,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true,
        },
        color: ['#d59e72', '#5fbcae'],
        xAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'gray',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: ['烟感', '摄像头', '空调', 'UPS', '照明'],
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#fff',
          },
        },
        series: [
          {
            name: '正常',
            type: 'bar',
            stack: 'total',
            barWidth: '20%',
            // label: {
            //   show: true,
            // },
            // emphasis: {
            //   focus: 'series',
            // },
            data: [22, 12, 11, 34, 30],
          },
          {
            name: '异常',
            type: 'bar',
            stack: 'total',
            barWidth: '20%',

            // label: {
            //   show: true,
            // },
            // emphasis: {
            //   focus: 'series',
            // },
            data: [12, 13, 10, 13, 20],
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    energyEfficiency() {
      const dom = this.$refs.energyEfficiency;
      const myChart = echarts.init(dom);
      const option = {
        title: {
          show: true,
          text: '1.63',
          subtext: '小时 PUE',
          left: '29%',
          top: '36%',
          textAlign: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '0.2rem',
          },
          subtextStyle: {
            color: '#ccc',
            fontSize: '0.13rem',
          },
        },
        color: ['#5aa99c'],
        series: [
          {
            name: 'Indicator',
            type: 'gauge',
            radius: '70%',
            center: ['30%', '50%'],
            detail: {
              show: false,
            },
            data: [65],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              roundCap: true,
            },
            progress: {
              show: true,
              roundCap: true,
            },
            pointer: {
              show: false,
            },
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    devicePue() {
      const myChart = this.$echarts.init(this.$refs.devicePue);
      const option = {
        grid: {
          top: '6%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
        },
        color: ['#c1895b'],
        xAxis: {
          type: 'category',
          data: ['4:00', '7:00', '10:00', '13:00', '16:00', '19:00', '22:00'],
          axisTick: {
            show: false,
          },
          boundaryGap: false, // 不留白，从原点开始
          axisLabel: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#fff',
              opacity: 0.3,
            },
          },
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            name: '步数',
            data: [1, 1.2, 2, 1.4, 1.5, 1.2, 1.5],
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0.5,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#c1895b',
                },
                {
                  offset: 1,
                  color: 'transparent',
                },
              ]),
            },
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    tempChart() {
      const dom = this.$refs.tempChart;
      const myChart = echarts.init(dom);
      const option = {
        title: {
          text: '温度',
          left: 'center',
          top: '2%',
          textStyle: {
            color: '#fff',
            fontSize: '0.15rem',
          },
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '65%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 120,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91',
            },
            progress: {
              show: true,
              width: 8,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 8,
              },
            },
            axisTick: {
              distance: 0,
              splitNumber: 2,
              lineStyle: {
                width: 1,
                color: '#999',
              },
            },
            splitLine: {
              distance: -16,
              length: 8,
              lineStyle: {
                width: 1,
                color: '#999',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: '0.08rem',
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-10%'],
              fontSize: '0.15rem',
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit',
            },
            data: [
              {
                value: 20,
              },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 湿度图表
    humidityChart() {
      const dom = this.$refs.humidityChart;
      const myChart = echarts.init(dom);
      const option = {
        title: {
          text: '湿度',
          left: 'center',
          top: '2%',
          textStyle: {
            color: '#fff',
            fontSize: '0.15rem',
          },
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '65%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 120,
            splitNumber: 12,
            itemStyle: {
              color: '#09d0c8',
            },
            progress: {
              show: true,
              width: 8,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 8,
              },
            },
            axisTick: {
              distance: 0,
              splitNumber: 2,
              lineStyle: {
                width: 1,
                color: '#999',
              },
            },
            splitLine: {
              distance: -16,
              length: 8,
              lineStyle: {
                width: 1,
                color: '#999',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: '0.08rem',
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-10%'],
              fontSize: '0.15rem',
              fontWeight: 'bolder',
              formatter: '{value} %',
              color: 'inherit',
            },
            data: [
              {
                value: 60,
              },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },

    openJfRecordList() {
      this.JfjcRecordInfo.isShowEmpty = false;
      this.JfjcRecordInfo.JfjcRecordList = [];
      this.JfjcRecordInfo.pagination.currentPage = 1;
      this.JfjcRecordInfo.pagination.pageSize = 10;
      this.JfjcRecordInfo.uuid = this.popType.jfUuid;
      this.$api
        .getComputerRoomStatistics({
          start: 0,
          page: 1,
          limit: 10,
          entityuuid: this.popType.jfUuid,
        })
        .then((res) => {
          this.JfjcRecordInfo.JfjcRecordList = res.data;
          if (res.data && res.data.length > 0) {
            this.JfjcRecordInfo.isShowEmpty = false;
            this.JfjcRecordInfo.pagination.total = res.totalCount;
            this.JfjcRecordInfo.isShow = true;
          } else {
            this.JfjcRecordInfo.isShowEmpty = true;
            this.JfjcRecordInfo.isShow = true;
            this.JfjcRecordInfo.pagination.total = 0;
          }
        });
    },

    getJgData(roomId, jgId) {
      return new Promise((resolve, reject) => {
        this.$api.cabinetAssetsList({ roomUuid: roomId, cabinetUuid: jgId }).then((res) => {
          if (res.success) {
            resolve(res.data);
          }
        });
      });
    },

    deviceInfo(params) {
      return new Promise((resolve, reject) => {
        this.$api.getAssetsDetail({ assetsNumber: params }).then((res) => {
          if (res.success) {
            resolve(res.data);
          }
        });
      });
    },

    init() {
      this.createScene();
      this.createCamera();
      this.createLight();
      this.loadGLTF(`/source/${this.modelInfo.lou}.gltf`, [0, 0, -6345], [0.4, 0.4, 0.4]);
      this.createRender();
      this.createControls();
      this.render();
      this.onWindowResize();
    },
    effectComposer(element) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.outlinePass = new OutlinePass(new THREE.Vector2(element.clientWidth * devicePixelRatio, element.clientHeight * devicePixelRatio), this.scene, this.camera);
      this.outlinePass.visibleEdgeColor.set(0xfeb009);
      this.outlinePass.lineWidth = 8;
      this.outlinePass.edgeGlow = 1;
      const outputPass = new OutputPass();
      const smaaPass = new SMAAPass(element.clientWidth * devicePixelRatio, element.clientHeight * devicePixelRatio);
      this.composer.addPass(smaaPass);
      this.composer.addPass(this.outlinePass);
      this.composer.addPass(outputPass);
    },

    createGui() {
      this.gui = new dat.GUI();

      this.cameraFolder = this.gui.addFolder('Camera');
      this.cameraFolder.add(this.camera.position, 'x', -10000, 10000);
      this.cameraFolder.add(this.camera.position, 'y', -10000, 20000);
      this.cameraFolder.add(this.camera.position, 'z', -10000, 20000);
      this.cameraFolder.add(this.camera.rotation, 'x', 0, Math.PI * 2);
      this.cameraFolder.add(this.camera.rotation, 'y', 0, Math.PI * 2);
      this.cameraFolder.add(this.camera.rotation, 'z', 0, Math.PI * 2);
      this.cameraFolder.open();
    },

    createScene() {
      this.scene = new THREE.Scene();
    },

    createLight() {
      const pointLight = new THREE.PointLight(0xffffff, 1.0);
      pointLight.position.set(40, 10000, 0);

      const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
      this.scene.add(pointLightHelper);
      this.scene.add(pointLight);
    },

    createCamera() {
      const element = this.$refs.threeBox;
      const width = element.clientWidth;
      const height = element.clientHeight;
      const k = width / height;
      this.camera = new THREE.PerspectiveCamera(60, k, 0.1, 120000);
      this.camera.position.set(0, 7670, 8663);
      // this.camera.lookAt(0, 0, 0);

      this.scene.add(this.camera);
    },

    createRender() {
      const axesHelper = new THREE.AxesHelper(100000);
      this.scene.add(axesHelper);
      const element = this.$refs.threeBox;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        side: THREE.DoubleSide,
        logarithmicDepthBuffer: true,
      });
      this.renderer.setSize(element.clientWidth, element.clientHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0x2d4057, 0);
      element.appendChild(this.renderer.domElement);
      this.effectComposer(element);
    },

    render() {
      const deltaTime = this.clock.getDelta();
      this.mixer && this.mixer.update(deltaTime);
      this.renderer.render(this.scene, this.camera);

      if (this.center) {
        this.controls.target.copy(this.center);
      }
      this.tweenCamera && this.tweenCamera.update();
      this.tweenEnter && this.tweenEnter.update();
      if (this.controls.enabled) {
        this.controls.update();
      }
      this.composer.render();
      this.keyboardControl();
      requestAnimationFrame(this.render);
    },

    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.rotateSpeed = 0.35;
      // this.controls.enablePan = true;
      // this.controls.minDistance = 200;
      // this.controls.update();
    },

    createBox() {
      const geometry = new THREE.BoxGeometry(1000, 1000, 100);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.rotateX(Math.PI / 4);
      this.scene.add(cube);
    },

    loadGLTF(url, position, scale) {
      this.manager = new THREE.LoadingManager();
      const loader = new GLTFLoader(this.manager);
      this.cameras = {};
      this.deciceObject = {};
      this.i = 0;
      loader.load(
        url,
        (gltf) => {
          // console.log("🚀 ~ loadGLTF ~ gltf:", gltf)
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = false;
              child.castShadow = true;
              child.material.emissive = child.material.color;
              child.material.emissiveMap = child.material.map;
              this.deal(child);
            }
          });
          this.buildingGroup = new THREE.Group();
          this.buildingGroup.add(...gltf.scene.children);
          this.buildingGroup.position.y = position[1];
          this.buildingGroup.position.z = position[2];
          this.buildingGroup.scale.set(...scale);
          this.scene.add(this.buildingGroup);
          const box = new THREE.Box3().setFromObject(this.buildingGroup);
          const helper = new THREE.Box3Helper(box, 0xffff00);

          this.scene.add(...gltf.scene.children);
          if (gltf.animations.length > 0) {
            const animations = gltf.animations;
            this.mixer = new THREE.AnimationMixer(this.scene);
            this.action = this.mixer.clipAction(animations[0]);
            this.action.loop = THREE.LoopOnce;
            this.action.clampWhenFinished = true;
          }
        },
        () => {},
        (error) => {
          console.error('模型加载错误：', error);
        }
      );
      this.manager.onLoad = () => {
        this.isLoaded = true;
      };
      this.isLoaded = false;
    },

    async onmodelclick(e) {
      e.preventDefault();
      const element = this.$refs.threeBox;
      const rect = element.getBoundingClientRect();
      const mouse = new THREE.Vector2((e.offsetX / rect.width) * 2 - 1, -(e.offsetY / rect.height) * 2 + 1);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children);
      console.log('🚀 ~ onmodelclick ~ intersects:', intersects);
      // this.outlinePass.selectedObjects = [];
      if (intersects.length > 0) {
        const name = intersects[0].object.name;
        const nameStart = intersects[0].object.name.split('-')[0];
        if (nameStart === 'icon' && intersects[0].object.clicked && name !== 'icon-mj96') {
          const key = intersects[0].object.name;
          const type = intersects[0].object.name.split('-')[1];
          console.log(this.cameras);
          console.log(key);
          this.outlinePass.selectedObjects = [this.cameras[key]];
          this.showChangeDialog(this.cameras[key], type);
        }
        const lightList = this.filterModel(intersects, 'light');
        if (lightList.length > 0) {
          this.destroyScene(this.buildingGroup);
          this.loadGLTF(`/source/${this.modelInfo.room}.gltf`, [0, 345, 0], [1, 1, 1]);
          this.showpage = true;
        }
        const lightList1 = this.filterModel(intersects, 'light1');
        if (lightList1.length > 0) {
          this.destroyScene(this.buildingGroup);
          this.loadGLTF(`/source/${this.modelInfo.room}.gltf`, [0, 345, 0], [1, 1, 1]);
          this.showpage = true;
        }

        const door3List = this.filterModel(intersects, 'icon-mj96');
        if (door3List.length > 0) {
          this.openJfRecordList();
        }
        const cabinet = intersects[0].object.name.split('-');
        if (cabinet[1] === 'ti') {
          this.outlinePass.selectedObjects = [intersects[0].object];
          this.createAdvertisement(e, this.$refs.infoRef3);
        }
        const deviceList = this.filterModel(intersects, 'device');

        if (deviceList.length > 0) {
          const id = deviceList[0].object.parent.parent.name.split('#')[1];
          const type = deviceList[0].object.parent.parent.name.split('#')[0];
          // this.deviceDetail = await this.$api.serverDetial({ amsUuid: id });
          // this.deviceDetail = await this.deviceInfo(deviceList[0].object.parent.parent.name);
          this.$emit('getInfoCpuId', { type: type, uuid: id });
          // this.createAdvertisement(e, this.$refs.infoRef);
          this.outlinePass.selectedObjects = [deviceList[0].object];
          return;
        }
        let doorList = this.filterModel(intersects, 'door');
        if (cabinet.length <= 0 && doorList.length <= 0) {
          return;
        }

        let id = '';
        if (doorList.length > 0) {
          id = doorList[0].object.name.split('-')[1];
        } else {
          id = this.cabinetObject[cabinet[0]] && this.cabinetObject[cabinet[0]].name.split('-')[1];
        }
        this.deviceList = await this.getJgData(this.popType.jfUuid, id);
        if ((doorList.length > 0 || cabinet[1] === 'ti') && this.deviceList.length >= 0) {
          let temp = null,
            box = null;
          if (doorList.length > 0) {
            temp = doorList[0].object;
            box = new THREE.Box3().setFromObject(temp.parent.parent);
          } else {
            temp = this.cabinetObject[cabinet[0]];
            box = new THREE.Box3().setFromObject(intersects[0].object);
            this.cachesModels.add(box);
          }
          const center = box.getCenter(new THREE.Vector3());
          this.center = center;
          const positionToWorldCenter = new THREE.Vector3().subVectors(center, new THREE.Vector3(0, 0, 0));
          const height = box.max.y - box.min.y;
          const offsetX = positionToWorldCenter.x;
          const offsetZ = positionToWorldCenter.z;
          let worldNormal = null;
          if (doorList[0]) {
            worldNormal = doorList[0].face.normal.clone().transformDirection(temp.matrixWorld);
          } else {
            doorList = intersects[0].object.name.split('-')[2];
            if (doorList === 'z') {
              worldNormal = new THREE.Vector3(0, 0, 1);
            } else if (doorList === 'Z') {
              worldNormal = new THREE.Vector3(0, 0, -1);
            } else if (doorList === 'x') {
              worldNormal = new THREE.Vector3(1, 0, 0);
            } else {
              worldNormal = new THREE.Vector3(-1, 0, 0);
            }
          }
          const distance = 1200;
          const cameraPosition = new THREE.Vector3().addVectors(center, worldNormal.multiplyScalar(distance));
          await this.animateCamera(this.camera.position, cameraPosition);
          if (!this.cachesModels.has(box)) {
            this.deviceList.forEach((el) => {
              const match = el.gasCabinteAddress.match(/^\d+/);
              let offsetY = Number(match[0]);
              const typeUuid = el.gasStockType + '#' + el.uuid;
              if (match) {
                const deviceNum = this.computedU(match.input);
                if (deviceNum === '1U') offsetY = offsetY - 0.55;
                this.loadModel(`/source/device-${el.gasStockType + deviceNum}.gltf`, true, height, offsetX, offsetY, offsetZ, doorList, typeUuid);
              }
            });

            this.animateModelEnter(temp.parent);
          }
        }
      }
    },

    loadModel(url, isPlay, height, offsetX, offsetY, offsetZ, model, _uuid) {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.frustumCulled = false;
              child.castShadow = true;
              child.material.emissive = child.material.color;
              child.material.emissiveMap = child.material.map;
            }
          });

          const cityGroup = new THREE.Group();

          cityGroup.add(...gltf.scene.children);
          cityGroup.position.x = offsetX;
          cityGroup.position.z = offsetZ;
          cityGroup.position.y += (offsetY - 1) * (height / 45) + 60;
          cityGroup.rotateY(Math.PI);

          cityGroup.name = _uuid;
          this.deviceGroup.push(cityGroup);
          let worldNormal = null;
          if (typeof model !== 'string') {
            worldNormal = model[0].face.normal.clone().transformDirection(model[0].object.matrixWorld);
          } else {
            if (model === 'z') {
              worldNormal = new THREE.Vector3(0, 0, 1);
            } else if (model === 'Z') {
              worldNormal = new THREE.Vector3(0, 0, -1);
            } else if (model === 'x') {
              worldNormal = new THREE.Vector3(1, 0, 0);
            } else {
              worldNormal = new THREE.Vector3(-1, 0, 0);
            }
          }
          const modelFrontDirection = new THREE.Vector3(0, 0, 1);
          const rotationAxis = new THREE.Vector3().crossVectors(modelFrontDirection, worldNormal).normalize();
          let rotationAngle = Math.acos(modelFrontDirection.dot(worldNormal));
          rotationAngle = Math.round(rotationAngle / (Math.PI / 2)) * (Math.PI / 2);
          const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);
          cityGroup.quaternion.multiply(rotationQuaternion);
          this.scene.add(cityGroup);
          this.scene.add(gltf.scene);

          if (isPlay) {
          }
        },
        (e) => {},
        (error) => {
          console.error('模型加载错误：', error);
        }
      );
    },
    blurOtherModels(selectedObject) {
      const selectedName = selectedObject.object.name;
      this.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === selectedName) {
            if (child.material) {
              child.material.opacity = 1.0;
              child.material.transparent = false;
            }
          } else {
            if (child.material) {
              child.material.opacity = 0.3;
              child.material.transparent = true;
            }
          }
        }
      });
    },
    resetModels() {
      this.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = 1;
          child.material.transparent = false;
        }
      });
    },
    destroyScene(group) {
      if (!group) {
        return;
      }
      this.scene.remove(group);
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material && object.material.map) {
            object.material.map.dispose();
          }
          object.material.dispose();
        }
      });
    },

    visibleScene(scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.visible = false;
        }
      });
    },

    animateCamera(currentPosition, targetPosition) {
      return new Promise((resolve, reject) => {
        this.tweenCamera = new TWEEN.Tween({
          x: currentPosition.x,
          y: currentPosition.y,
          z: currentPosition.z,
        })
          .to(
            {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
            },
            1500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(({ x, y, z }) => {
            this.camera.position.set(x, y, z);
          })
          .onComplete(() => {
            this.tweenCamera = null;

            resolve();
          })
          .start();
      });
    },

    animateModelEnter(model) {
      const group = new THREE.Group();
      group.add(model);
      this.destroyScene(group);
      // model.position.z = -300
      // this.visibleScene(model);
    },

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
        })
        .onComplete(() => {
          this.destroyScene(model);
          this.loadGLTF('/source/中心机房-空机柜.gltf', [0, 345, 0], [1, 1, 1]);
        })
        .start();
    },

    createAdvertisement(e, vNode) {
      if (vNode) {
        let offsetX = e.offsetX;
        let offsetY = e.offsetY;
        const infoDomHeight = vNode.clientHeight;
        if (offsetY <= infoDomHeight / 1.5) {
          offsetY = offsetY + infoDomHeight / 1.5;
        }
        vNode.style = `transform: translate(${offsetX - 100}px, ${offsetY - 150}px);display:block;`;
        window.addEventListener('mousemove', (e) => {
          vNode.style = 'display:none';
        });
      }
    },
    deal(child) {
      const iconPosMap = {
        拱墅中心机房: 'pos1',
        文晖机房: 'pos2',
        城运机房: 'pos3',
        人防机房: 'pos4',
        行政服务中心: 'pos5',
      };

      const firstMark = child.name.split('-')[0];
      const iconPosInfo = this.childNameObjects[firstMark];
      if (iconPosInfo) {
        const pos = iconPosInfo[iconPosMap[this.modelInfo.room]];
        this.loadImage(iconPosInfo.url, child, pos, firstMark);
      }

      const regex = /door-([0-9A-Za-z]+)-glass1/;
      if (regex.test(child.name)) {
        const key = child.parent.parent.name.substring(0, 3);
        this.cabinetObject[key] = this.cabinetObject[key] || [];
        this.cabinetObject[key] = child;
      }
    },
    loadImage(url, child, obj, mark) {
      const pos = child.parent.position;
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        // const imageLoader = new THREE.ImageLoader();
        // imageLoader.load(url, (image) => {
        //   const texture = new THREE.Texture(image);
        //   texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry(600, 1000);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(pos);
        if (obj) {
          plane.position.x += obj.x;
          plane.position.y = obj.y;
          plane.position.z += obj.z;
        }

        plane.name = 'icon-' + mark + '-' + this.i;

        plane.clicked = true;
        // plane.visible = false;
        this.cameras[plane.name] = child.parent;
        this.i++;
        this.deciceObject[mark] = this.deciceObject[mark] ? this.deciceObject[mark] : [];
        this.deciceObject[mark].push(plane);

        this.scene.add(plane);
      });
    },
    showChangeDialog(model, type) {
      const deviceObject = {
        sxt: '视频监控',
        UPS: 'UPS',
        kt: '空调状态',
        db: '电表状态',
        sdlt: '市电列头柜',
        xfsb: '消防设备',
        wsdcgq: '温湿度传感器',
        pdg: '配电柜',
        sdlt: '市电列头柜',
        // xdc: '电池状态',
        dlg: '动力柜',
      };
      this.cameraInfo.type = type;
      if (deviceObject[type]) {
        this.cameraInfo.isShow = true;
        this.cameraInfo.title = deviceObject[type];
      }
      if (type === 'sxt') {
        this.createWebsocket(model);
      }
    },
    createWebsocket(model) {
      const uuid = model.name.split('-')[1];
      if (this.socket) {
        this.socket.close(1000, '客户端主动断开');
      }
      this.socket = new WebSocket(`wss://gsdyw.gongshu.gov.cn/video/websocket/5?uuid=${uuid}`);

      this.socket.onopen = () => {
        this.socket.send(uuid);
        this.startHeartbeat();
      };
      this.socket.onmessage = (event) => {
        if (event.data == 'pong') {
          return;
        }
        this.cameraInfo.videoUrl = event.data;

        this.resetHeartbeat();
      };
      this.socket.onclose = () => {
        // 关闭心跳定时器，避免内存泄漏
        clearTimeout(this.heartbeatTimer);
      };
    },
    // 启动心跳监测的函数
    startHeartbeat() {
      this.heartbeatTimer = setTimeout(() => {
        // 发送心跳包，这里简单地发送一个特定格式的消息，可根据服务端要求调整
        this.socket.send('ping');
        // 心跳包发送后，继续下一次的心跳监测计时
        this.startHeartbeat();
      }, 30000);
    },
    // 重置心跳定时器的函数
    resetHeartbeat() {
      clearTimeout(this.heartbeatTimer);
      this.startHeartbeat();
    },
    onDocumentMouseDown(event) {
      event.preventDefault();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.object.name.startsWith('icon-')) {
          const name = intersect.object.name.split('-')[2];
          const type = intersect.object.name.split('-')[1];
          this.showChangeDialog(name, type);
        }
      }
    },
    onDocumentMouseMove(event) {
      event.preventDefault();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.object.name.startsWith('icon-')) {
          const name = intersect.object.name.split('-')[2];
          const type = intersect.object.name.split('-')[1];
          this.showChangeDialog(name, type);
        }
      }
    },
    onDocumentMouseUp(event) {
      event.preventDefault();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster;
    },
    onWindowResize() {
      const element = this.$refs.threeBox;
      if (element) {
        const width = element.clientWidth;
        const height = element.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
      window.addEventListener('resize', this.onWindowResize, false);
    },

    filterModel(intersects, name) {
      if (name === 'door') {
        return intersects[0].object.name.split('-')[0] === name ? intersects : [];
      }
      if (name === 'device') {
        return intersects[0].object.name.split('-')[0] === name ? intersects : [];
      }
      if (name === 'ti') {
        return intersects[0].object.name.split('-')[0] === name ? intersects : [];
      }
      if (name === 'light') {
        return intersects[0].object.name === name ? intersects : [];
      }
      if (name === 'light1') {
        return intersects[0].object.name === name ? intersects : [];
      }
      if (name === 'icon-mj96') {
        return intersects[0].object.name === name ? intersects : [];
      }
    },

    computedU(str) {
      const temp = str.split('-');
      if (temp.length <= 1) {
        return '1U';
      } else {
        const match = temp[1].match(/^\d+/);
        const t = Number(match[0]) - Number(temp[0]) + 1 + 'U';
        return t === '3U' ? '2U' : t;
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    this.$refs.threeBox.removeEventListener('dblclick', this.onmodelclick);
    this.selControls && this.selControls.removeEventListener('unlock', this.unlockSelControls);
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  .map-house-box {
    width: 100%;
    height: 700px;
    position: absolute;
    top: -1.38rem;
    right: 0;
    margin-left: -9rem;
    padding: 1.35rem 0.25rem 2.2rem;
    width: 18rem;
    height: 11rem;
    left: 50%;
    .mapHouseContainer {
      width: 100%;
      height: 100%;
      background: #2d4057 !important;
      border-radius: 2.5rem 2.5rem 2rem 2rem !important;
      box-shadow: 1px 2px 20px 10px #0c1f2d;
      overflow: hidden;
    }
  }
  .leftMenu {
    backdrop-filter: blur(10px);
    position: absolute;
    z-index: 9999999;
    width: 3rem;
    height: 7rem;
    color: #b1b0b3;
    font-size: 0.14rem;
    background-color: rgba(33, 32, 37, 0.7);
    border-radius: 0.06rem;
    padding: 0.07rem 0.11rem;
    .title {
      width: 100%;
      background: linear-gradient(to right, #35363f 50%, transparent);
      border-radius: 0.02rem;
      padding: 0.02rem 0.11rem;
      font-weight: bold;
    }
    .jg-capacity {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.12rem;
      .used {
        margin: 0.2rem 0.1rem 0.1rem 0.2rem;
        .process {
          width: 0.7rem;
          background-color: #4db9a8;
          height: 0.06rem;
          margin: 0.04rem 0;
          .inner-process {
            background-color: #636363;
            width: 20%;
            height: 100%;
          }
        }
        .process2 {
          width: 0.8rem;
          background-color: #636363;
          height: 0.06rem;
          margin: 0.04rem 0;
          .inner-process2 {
            background-color: #f8bc83;
            width: 80%;
            height: 100%;
          }
        }
        .used-num {
          font-weight: bold;
          color: #fff;
        }
      }
      .counts {
        text-align: center;
        .jg-num {
          font-weight: bold;
          font-size: 0.13rem;
        }
        .jg-count {
          font-size: 0.22rem;
          font-weight: bold;
          color: #e0e0e0;
        }
      }
    }
    .device-statistics {
      width: 2.8rem;
      height: 2rem;
    }
    .device-status-statistics {
      width: 2.8rem;
      height: 2rem;
    }
  }
  .rightMenu {
    backdrop-filter: blur(10px);
    position: absolute;
    right: 0;
    z-index: 9999999;
    width: 3rem;
    height: 7rem;
    color: #b1b0b3;
    font-size: 0.14rem;
    background-color: rgba(33, 32, 37, 0.7);
    border-radius: 0.06rem;
    padding: 0.07rem 0.11rem;
    .title {
      width: 100%;
      background: linear-gradient(to right, #35363f 50%, transparent);
      border-radius: 0.02rem;
      padding: 0.02rem 0.11rem;
      font-weight: bold;
    }
    .box {
      position: relative;
      .device-energy-efficiency {
        width: 2.8rem;
        height: 1.5rem;
      }
      .info-tip {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        .info-text {
          font-size: 0.12rem;
        }
        .info-value {
          color: #fff;
          font-size: 0.13rem;
        }
      }
    }
    .table {
      .rowWidth {
        white-space: nowrap;
      }
      /deep/ .el-table tr {
        background-color: transparent; /* 表格背景色设置为白色 */
        color: #fff;
      }
      /deep/ .el-table {
        background-color: transparent; /* 表格背景色设置为白色 */
      }
      /deep/ .el-table .el-table__body-wrapper {
        height: 182px;
        overflow-y: auto;
      }

      /deep/ .el-table tr td {
        font-size: 0.12rem;
        border: none;
        padding: 4px 0;
      }
      /deep/ .el-table th.el-table__cell {
        font-size: 0.12rem;
        border: none;
        background-color: transparent; /* 表格背景色设置为白色 */
        padding: 6px 0;
      }
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table tbody tr:hover > td {
        background-color: transparent !important; //修改成自己想要的颜色即可
      }
    }
    .primary {
      margin: 0.1rem 0.25rem;
      padding: 0.01rem 0.08rem;
      display: flex;
      justify-content: space-between;
      color: #fff;
    }
    .chart-box {
      display: flex;
      justify-content: space-between;
      .temperature {
        height: 1.5rem;
        width: 1.4rem;
      }
      .humidity {
        height: 1.5rem;
        width: 1.4rem;
      }
    }
    .device-PUE {
      width: 2.8rem;
      height: 2rem;
    }
    .device-use {
      width: 100%;
      height: 2rem;
    }
    .device-status {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 0.1rem;
      .box-cw {
        width: 1.2rem;
        height: 1.2rem;
        .circle1 {
          position: relative;
          width: 100%;
          height: 100%;
          background: #53565e;
          border-radius: 50%;
          box-shadow: 0 0 5px 1px #53565e;
          overflow: hidden;
          .text-process {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.2rem;
            font-weight: bold;
            color: #fff;
          }
          .wave1 {
            position: absolute;
            left: -20%;
            bottom: -80%;
            width: 150%;
            height: 150%;
            background: #09d0c8;
            border-radius: 35%;

            /* 波浪动画 */
            animation: wave-animation 6s linear infinite;
          }
        }
      }
      .info-tip {
        color: #fff;
        .info-text {
          font-size: 0.12rem;
          line-height: 0.25rem;
          span {
            font-size: 0.13rem;
            padding: 0 0.16rem;
            font-weight: bold;
          }
        }
      }
    }
  }
  .bottomMenu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 7rem;
    width: 4.05rem;
    height: 0.25rem;
    .box-menu {
      display: flex;
      position: relative;
      /deep/ .el-button {
        width: 100%;
        margin: 0;
        padding: 0.05rem 0.1rem;
        background: #ffb44b;
        color: #000;
        border: none;
      }

      .menu {
        position: absolute;
        top: -0.06rem;
        .menu-box {
          position: relative;
          .menu-content {
            position: absolute;
            bottom: 0;
            font-size: 0.14rem;
            color: #fff;
            text-align: center;
            background: rgba(60, 58, 61, 0.8);
            p {
              padding: 0.036rem 0rem;
              width: 1.34rem;
              cursor: pointer;
            }
            P:hover {
              background-color: #ffb44b;
              color: #000;
            }
          }
        }
      }
      .menu2 {
        position: absolute;
        top: -0.06rem;
        left: 1.35rem;
        .menu-box {
          position: relative;
          .menu-content {
            position: absolute;
            bottom: 0;
            font-size: 0.14rem;
            color: #fff;
            text-align: center;
            background: rgba(60, 58, 61, 0.8);
            p {
              padding: 0.036rem 0rem;
              width: 1.34rem;
              cursor: pointer;
            }
            P:hover {
              background-color: #ffb44b;
              color: #000;
            }
          }
        }
      }
      .menu3 {
        position: absolute;
        top: -0.06rem;
        left: 2.7rem;
        .menu-box {
          position: relative;
          .menu-content {
            position: absolute;
            bottom: 0;
            font-size: 0.14rem;
            color: #fff;
            text-align: center;
            background: rgba(60, 58, 61, 0.8);
            p {
              padding: 0.036rem 0rem;
              width: 1.34rem;
              cursor: pointer;
            }
            P:hover {
              background-color: #ffb44b;
              color: #000;
            }
          }
        }
      }
    }
  }
  .info {
    position: absolute;
    top: 0px;
    left: 0;
    min-width: 220px;
    background-color: rgba(255, 255, 255, 0.7);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    /* opacity: 0; */
    display: none;
    font-size: 16px;
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    p {
      color: #000;
      font-weight: bold;
      span {
        color: rgb(0, 119, 255);
      }
    }
  }
  .info2 {
    position: absolute;
    top: 0px;
    left: 0;
    min-width: 220px;
    background-color: rgba(255, 255, 255, 0.7);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    /* opacity: 0; */
    display: none;
    font-size: 16px;
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    p {
      color: #000;
      font-weight: bold;
      span {
        color: rgb(0, 119, 255);
      }
    }
  }
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
