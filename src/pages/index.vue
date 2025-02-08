<template>
  <div class="container">
    <button class="view-switch-btn" @click="switchView">切换第一人称"</button>
    <button
      style="z-index: 99; position: absolute"
      @click="
        () => {
          $router.push('/indexAnimation');
        }
      "
    >
      animation
    </button>
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

    <!-- <DialogListJfjcRecord :popType="JfjcRecordInfo" /> -->
  </div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
//(注：解决加入composer之后，场景变黑问题)
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// SMAA抗锯齿通道
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import * as TWEEN from "@tweenjs/tween.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入gui
import dat from "dat.gui"; // 引入 Axios
import axios from "axios";

// import DialogListJfjcRecord from "@/components/DialogList-JfjcRecord";
import { DragControls } from "three/addons/controls/DragControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

import _ from "lodash";
export default {
  // components: { DialogListJfjcRecord },
  // props: {
  //   popType: { type: Object },
  // },
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
      tweenCamera: null,
      tweenEnter: null,
      deviceList: [],
      ddd: [
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "柏科",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "1u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:27",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "10.71.80.202",
          gasFixedAssetsNum: "CC-0028",
          gasGatName: "柏科存储",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "RD6810F",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 1215,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "A77F3EB38033444FAF725C509480327C",
          gasRelGroupUuid: "15F526E8AE324F61939FF3E5D6183010",
          gasRelModelUuid: "518A95D420BC480D9DDA02EB7012B578",
          gasRemark: "",
          gasSerialNum: "Rd5621730",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "存储设备",
          gasTypeuuid: "DDBDE479A3DE4A18A28878780CE602BE",
          gasUnid: 177085821,
          gasUpdateTime: "2024-05-09 09:51:27",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "52030B1111C54DF7927A36D26E9CCD69",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:27",
          order: 1215,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177085821,
          uuid: "52030B1111C54DF7927A36D26E9CCD69",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "华为",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "10-12u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "59.202.69.79",
          gasFixedAssetsNum: "FWQ-0133",
          gasGatName: "信创服务器（数据3）",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "K22K-02",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3091,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "2102313AQP10M1000398",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086850,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "16982C73F2F24053BBD840DAD52BF7DA",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3091,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086850,
          uuid: "16982C73F2F24053BBD840DAD52BF7DA",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "华为",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "14-15u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "59.202.69.90",
          gasFixedAssetsNum: "FWQ-0132",
          gasGatName: "信创服务器（应用8）",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "K22K-02",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3089,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "2102313AQP10M1000405",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086849,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "A4FC38D217F84A759BFF7B5529E2BDCF",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3089,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086849,
          uuid: "A4FC38D217F84A759BFF7B5529E2BDCF",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "华为",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "18-19u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "59.202.69.107",
          gasFixedAssetsNum: "FWQ-0131",
          gasGatName: "信创服务器（应用4）",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "K22K-02",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3087,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "2102313AQP10M1000396",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086848,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "886D70A9C6284A3C9F86BED1A990BC4C",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3087,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086848,
          uuid: "886D70A9C6284A3C9F86BED1A990BC4C",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "信创国产服务器",
          gasBrandType: "华为",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "20U",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18238084282",
          gasCustodianUser: "朱永坤",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "59.202.69.100",
          gasFixedAssetsNum: "FWQ-0320",
          gasGatName: "集约化管理中心服务器",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "华为K22K-02",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 2771,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "2102313AQP10M1000404",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086690,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "89249DC303CC4ECE9E106E62BC50353F",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 2771,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086690,
          uuid: "89249DC303CC4ECE9E106E62BC50353F",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "戴尔",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "21-22u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "10.71.80.217",
          gasFixedAssetsNum: "FWQ-0130",
          gasGatName: "VMware虚拟化主机",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "R720",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3085,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "BD7G742",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086847,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "49B11899712C415BA6B2BE66F4D33E45",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3085,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086847,
          uuid: "49B11899712C415BA6B2BE66F4D33E45",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "柏科",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "28-29u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:27",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "10.71.80.198",
          gasFixedAssetsNum: "CC-0027",
          gasGatName: "柏科存储虚拟化网关",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "VRD7100",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 1213,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "A77F3EB38033444FAF725C509480327C",
          gasRelGroupUuid: "15F526E8AE324F61939FF3E5D6183010",
          gasRelModelUuid: "518A95D420BC480D9DDA02EB7012B578",
          gasRemark: "",
          gasSerialNum: "Rd5621744",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "CC",
          gasStorage: "",
          gasTypename: "存储设备",
          gasTypeuuid: "DDBDE479A3DE4A18A28878780CE602BE",
          gasUnid: 177085820,
          gasUpdateTime: "2024-05-09 09:51:27",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "FB211399C6D54A5CADC18F2CEDA8F3E4",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:27",
          order: 1213,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177085820,
          uuid: "FB211399C6D54A5CADC18F2CEDA8F3E4",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "华为",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "35-36u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "59..202.69.100",
          gasFixedAssetsNum: "FWQ-0127",
          gasGatName: "信创服务器",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "K22K-02",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3079,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "未配置IP，未在使用；已关停，未下架",
          gasSerialNum: "2102313AQP10M1000404",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086844,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "6483CA6170E14A3C914FE2D07B389A10",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3079,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086844,
          uuid: "6483CA6170E14A3C914FE2D07B389A10",
        },
        {
          ext: {},
          gasAffiliatedDept: "拱墅区数据局",
          gasAssociatedName: "",
          gasBrandType: "科来",
          gasBrandTypeuuid: "",
          gasCabinetOffice: "机柜B7",
          gasCabinteAddress: "42u",
          gasCmmFormUuid: "BB578E51F4204AB9A4E360C71E5F6F25",
          gasCmmGroupUuid: "25EB32A8706A41EABF75B3F2CDF9D735",
          gasComputerRoom: "拱墅区政府中心机房",
          gasCpu: "",
          gasCreateTime: "2024-05-09 09:51:59",
          gasCreator: "CRACT_UUID_1",
          gasCreatorName: "系统管理员",
          gasCustodianContact: "18042302114",
          gasCustodianUser: "刘贤财",
          gasDisk: "",
          gasEquipmentAddress: "",
          gasEquipmentIp: "10.71.80.91",
          gasFixedAssetsNum: "FWQ-0126",
          gasGatName: "科来网络回溯分析系统",
          gasJfuuid: "FEA02F8D097046CCB28959372D680B7C",
          gasJguuid: "5EE8A494BB624CC699257D18F7CF84F3",
          gasMaintenanceContact: "",
          gasMaintenanceContactnumber: "",
          gasMaintenanceStatus: "",
          gasMaintenanceUnit: "",
          gasModelNumberUuid: "RAS3006STX",
          gasModelid: "76D6F33419384ED29AABE7E40AA2668B",
          gasOrder: 3077,
          gasPurchaseManufactor: "",
          gasPurchaseMoney: "",
          gasPurchaseUnit: "区数据局",
          gasRelFormUuid: "918BAD954BC14A38A1B03BCDDBD12761",
          gasRelGroupUuid: "75E433CAE5A94EE888E769ACB4786834",
          gasRelModelUuid: "4957EB01F5994B7A833C29655DC86534",
          gasRemark: "",
          gasSerialNum: "PHRAS3006STX20160505005",
          gasStatus: "1",
          gasStockStatus: "1",
          gasStockType: "FWQ",
          gasStorage: "",
          gasTypename: "物理机",
          gasTypeuuid: "D017A94B87F04E26B6C25B1D2ED09F6D",
          gasUnid: 177086843,
          gasUpdateTime: "2024-05-09 09:51:59",
          gasUpdater: "CRACT_UUID_1",
          gasUpkeepMoney: "",
          gasUse: "",
          gasUuid: "9E42533DFB0B44F0AEE3F2D63B35F446",
          intMap: {},
          lastUpdateTime: "2024-05-09 09:51:59",
          order: 3077,
          status: "1",
          strList: [],
          strMap: {
            cabinetName: "B7",
          },
          unid: 177086843,
          uuid: "9E42533DFB0B44F0AEE3F2D63B35F446",
        },
      ],
      roomId: "FEA02F8D097046CCB28959372D680B7C",
      cachesModels: new Set(),
      cacheId: "", // 缓存id
      manager: null, // 管理器
      JfjcRecordInfo: {
        uuid: "",
        isShow: false,
        isShowEmpty: false,
        JfjcRecordList: [],
        pagination: {
          pageSizes: [10, 15, 20, 25],
          currentPage: 1, // 当前页默认第一页
          pageSize: 10, // 每页数据
          total: 0,
        },
      },
      cameraPosition: null,
      selControls: null, //选中的控件
      moveForward: null, // 前进
      moveBackward: null, // 后退
      moveLeft: null, // 左移
      moveRight: null, // 右移
      canJump: null, // 跳跃
      prevTime: performance.now(), // 上一次时间
      velocity: new THREE.Vector3(), // 移动速度
      direction: new THREE.Vector3(), // 移动方向
      firstPersonPosition: new THREE.Vector3(0, 1700, 0), // 存储第一人称位置
      firstPersonRotation: new THREE.Euler(), // 存储第一人称旋转
      isFirstTime: true, // 是否第一次进入第一人称
    };
  },
  activated() {},
  computed: {},
  wacth: {},
  created() {},
  mounted() {
    this.$refs.threeBox.addEventListener("click", this.onmodelclick);
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.cameraPosition) {
        this.animateCamera(this.cameraPosition, { x: 0, y: 7670, z: 8663 });
        this.camera.lookAt(0, 0, 0); // 设置相机方向
        this.cameraPosition = null;
      }
      if (e.code === "Delete") {
        this.outlinePass.selectedObjects = []; //清除选中模型的效果
      }
    });
    this.clock = new THREE.Clock(); // 创建时钟
    this.init(); // 初始化
  },
  methods: {
    //机房进出记录
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
            this.JfjcRecordInfo.pagination.total = 0;
          }
        });
    },
    //获取设备数据（接口）
    getJgData(roomId, jgId) {
      return new Promise((resolve, reject) => {
        // 发送 GET 请求
        // this.$api.cabinetAssetsList({ roomUuid: roomId, cabinetUuid: jgId }).then((res) => {
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
    //获取详情
    deviceInfo(params) {
      return new Promise((resolve, reject) => {
        this.$api.getAssetsDetail({ assetsNumber: params }).then((res) => {
          if (res.success) {
            resolve(res.data);
          }
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
      this.createManager(); // 控制器
      this.onWindowResize(); //让模型自适应窗口
    },
    effectComposer(element) {
      this.composer = new EffectComposer(this.renderer); // 初始化 EffectComposer
      this.composer.addPass(new RenderPass(this.scene, this.camera)); //渲染通道

      this.outlinePass = new OutlinePass(new THREE.Vector2(element.clientWidth * devicePixelRatio, element.clientHeight * devicePixelRatio), this.scene, this.camera); //轮廓通道
      this.outlinePass.visibleEdgeColor.set(0xfeb009); //设置轮廓颜色
      this.outlinePass.lineWidth = 8; //设置轮廓线宽
      this.outlinePass.edgeGlow = 1; //设置轮廓发光效果
      // this.outlinePass.hiddenEdgeColor.set(0x0000ff); //设置隐藏轮廓颜色
      // this.outlinePass.outlineOpacity = 1; //设置轮廓透明度
      // this.outlinePass.pulsePeriod = 0.5; //设置轮廓闪烁周期
      // this.outlinePass.usePatternTexture = false; //设置是否使用纹理
      // this.outlinePass.visibleEdgeThickness = 1; //设置可见轮廓线宽
      // this.outlinePass.hiddenEdgeThickness = 1; //设置隐藏轮廓线宽
      const outputPass = new OutputPass(); //输出通道(注：解决加入composer之后，场景变黑问题)
      const smaaPass = new SMAAPass(element.clientWidth * devicePixelRatio, element.clientHeight * devicePixelRatio); //SMAA通道
      this.composer.addPass(smaaPass); //添加SMAA通道
      this.composer.addPass(this.outlinePass); //添加轮廓通道
      this.composer.addPass(outputPass); //添加输出通道(注：解决加入composer之后，场景变黑问题)
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
      // this.scene.fog = new THREE.Fog(0xcccccc, 10, 10000);
      // this.scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);
    },
    // 创建管理器
    createManager() {
      this.manager = new THREE.LoadingManager();
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
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 111111111110);
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
        preserveDrawingBuffer: true, // 保存绘图缓冲区
        alpha: false, // 透明背景
        side: THREE.DoubleSide, //双面渲染
        logarithmicDepthBuffer: true, // 对数深度缓冲（让threejs更容易区分模型两个面，谁在前，谁在后,距离太近也没有用了。防止闪烁）
      });
      this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染器大小
      this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
      this.renderer.shadowMap.enabled = true; // 启用阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 阴影类型
      this.renderer.setClearColor(0x2d4057, 0); // 设置渲染器背景颜色
      this.renderer.outputEncoding = THREE.sRGBEncoding; // 设置渲染器输出色彩空间
      element.appendChild(this.renderer.domElement); // 将渲染器添加到页面中
      this.effectComposer(element);
    },
    // 递归渲染
    render() {
      // 获取两帧之间的时间间隔
      const deltaTime = this.clock.getDelta();
      // 更新动画
      this.mixer && this.mixer.update(deltaTime);
      // 每一帧更新渲染
      this.renderer.render(this.scene, this.camera);
      this.center && this.controls.target.copy(this.center);
      this.tweenCamera && this.tweenCamera.update();
      this.tweenEnter && this.tweenEnter.update();
      // 每一帧更新控制器（不然设置控制器属性会是失效）
      this.controls.enabled && this.controls.update();
      this.composer.render();
      // 递归调用渲染函数
      requestAnimationFrame(this.render);
      this.keyboardControl();
    },
    // 创建控件对象
    createControls() {
      // 创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // 打开阻尼(默认false)
      this.controls.dampingFactor = 0.25; // 设置阻尼系数
      // this.controls.enableRotate = true; // 开启旋转(默认true)
      // this.controls.enableZoom = true; // 开启缩放(默认true)
      // this.controls.enablePan = true; // 开启平移(默认true)
      // this.controls.autoRotate = true; // 开启自动旋转(默认false)
      // this.controls.autoRotateSpeed = 2; //设置旋转速度
      this.controls.enabled = true; // 开启控件(默认true)
      // this.controls.target.x = 0; // 设置控件焦点x
      // this.controls.target.y = 0; // 设置控件焦点y
      // this.controls.target.z = 0; // 设置控件焦点z
      // this.controls.object.rotation.set(Math.PI / 4, Math.PI / 4, 0);
      this.controls.update();
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
      // 创建 GLTF 加载器
      const loader = new GLTFLoader();
      // //创建解码器
      // const dracoLoader = new DRACOLoader();
      // // 设置 Draco 解码器的路径
      // dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
      // loader.setDRACOLoader(dracoLoader);
      //加载模型
      loader.load(
        url,
        (gltf) => {
          // console.log("🚀 ~ loader.load ~ gltf:", gltf);
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = false; // 不裁剪
              child.castShadow = true; // 投影
              // child.receiveShadow = false; // 接收投影
              // child.material.side = THREE.DoubleSide; // 双面渲染
              // child.material.flatShading = true; // 平滑着色
              child.material.emissive = child.material.color; // 物体自发光
              child.material.emissiveMap = child.material.map; // 物体自发光贴图
              // child.material.emissiveIntensity = 1.5; // 自发光强度
              // child.material.metalness = 0.5; // 金属度
              // child.material.roughness = 0.5; // 粗糙度
              // child.material.normalMap = child.material.map; // 法线贴图
              // child.material.normalScale.set(1, 1); // 法线贴图缩放
              // child.material.bumpMap = child.material.map; // 凹凸贴图
              // child.material.bumpScale = 1; // 凹凸贴图缩放
              // child.material.alphaMap = child.material.map; // 透明贴图
              // child.material.opacity = 0.5; // 透明度
              // child.material.transparent = true; // 开启透明
              // child.material.side = THREE.DoubleSide; // 双面渲染
              // child.material.flatShading = true; // 平滑着色
              // child.material.wireframe = true; // 网格线
              // child.material.wireframeLinewidth = 2; // 网格线宽度
              // child.material.wireframeLinecap = "round"; // 网格线端点样式
              // child.material.wireframeLinejoin = "round"; // 网格线连接样式
              // child.material.wireframeLinewidth = 2; // 网格线宽度
              // child.material.wireframeLinecap = "round"; // 网格线端点样式
              // child.material.wireframeLinejoin = "round"; // 网格线连接样式
              // child.material.wireframeLinewidth = 2; // 网格线宽度
              // child.material.wireframeLinecap = "round"; // 网格线端点样式
              // child.material.wireframeLinejoin = "round"; // 网格线连接样式
              // child.material.wireframeLinewidth = 2; // 网格线
              child.scale.set(0.999, 0.999, 0.999); // 缩小0.01，防止模型闪烁
              if (child.name.startsWith("door")) {
                child.mark = true;
                child.loaded = false;
                child.rotation.set(0, 0, 0);
              }
              if (child.name.startsWith("sxt")) {
                const cameraPos = child.parent.position;
                this.loadImage("/source/imgs/camera.png", cameraPos, { x: 0, y: 1880, z: 360 });
              }
              if (child.name.startsWith("roomDoor")) {
                const cameraPos = child.parent.position;
                this.loadImage("/source/imgs/accessControl.png", cameraPos, { x: -950, y: 2200, z: -1500 });
              }
            }
          });
          // 创建一个组
          this.buildingGroup = new THREE.Group();
          // 创建一个组 （这样可以移动模型，其他办法暂时没有想到）
          this.buildingGroup.add(...gltf.scene.children);
          this.buildingGroup.position.y = position[1]; // 设置y轴位置
          this.buildingGroup.position.z = position[2]; // 设置y轴位置
          this.buildingGroup.scale.set(...scale); // 设置缩放
          this.scene.add(this.buildingGroup); // 把组添加到场景中
          // 计算组模型的外边框
          const box = new THREE.Box3().setFromObject(this.buildingGroup);
          // 创建一个边框，把模型放进去（就是box）
          const helper = new THREE.Box3Helper(box, 0xffff00);
          // 获取组模型的中心点
          // this.centerJg = box.getCenter(new THREE.Vector3());
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
        this.outlinePass.selectedObjects = [intersects[0].object]; // 设置选中模型高亮

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
          this.destroyScene(this.buildingGroup);
          this.loadGLTF("/source/拱墅中心机房.gltf", [0, 345, 0], [1, 1, 1]);
        }
        // 过滤出设备模型 door3-door
        const door3List = this.filterModel(intersects, "roomDoor-4-door");
        door3List.length > 0 && this.openJfRecordList();
        // 过滤出设备模型 device
        const deviceList = this.filterModel(intersects, "device");
        //创建弹框并设置位置
        if (deviceList.length > 0) {
          // 获取设备详情
          // this.deviceDetail = await this.deviceInfo(
          //   deviceList[0].object.parent.parent.name
          // );
          this.createAdvertisement(e);
        }
        // 过滤出设备模型 door
        const doorList = this.filterModel(intersects, "door");

        if (doorList[0] || this.deviceList.length > 0) {
          this.cacheId = doorList[0].object.name.split("-")[1];
          // 缓存中有则不再允许点击
          if (this.cachesModels.has(this.cacheId)) {
            if (doorList[0].object.loaded) {
              if (doorList[0].object.mark) {
                this.animateModelEnter(doorList[0].object.parent, (Math.PI / 3) * 2, 0);
              } else {
                this.animateModelEnter(doorList[0].object.parent, 0, (Math.PI / 3) * 2);
              }
              doorList[0].object.mark = !doorList[0].object.mark;
              doorList[1].object.mark = !doorList[1].object.mark;
              return;
            }
          }

          this.cachesModels.add(this.cacheId);
          console.log(this.cachesModels);
          // 获取机柜实时数据
          // this.deviceList = await this.getJgData(this.roomId, id);
          // 计算模型的外边框
          const box = new THREE.Box3().setFromObject(doorList[0].object.parent.parent);
          // 通过外边框计算模型的中心点
          const center = box.getCenter(new THREE.Vector3());
          this.center = center;
          // 计算模型的中心点到世界中心的偏移量
          const positionToWorldCenter = new THREE.Vector3().subVectors(center, new THREE.Vector3(0, 0, 0));
          const height = box.max.y - box.min.y; // Y轴偏移
          const offsetX = positionToWorldCenter.x; // X轴偏移
          const offsetZ = positionToWorldCenter.z; // Z轴偏移
          // 1. 获取模型的世界变换矩阵并计算法向量的世界坐标
          const worldNormal = doorList[0].face.normal.clone().transformDirection(doorList[0].object.matrixWorld.clone());
          // 想要的距离，可以根据需要调整
          const distance = 1200;
          // 2. 计算相机在点击面前方的偏移位置
          this.cameraPosition = new THREE.Vector3().addVectors(center, worldNormal.multiplyScalar(distance));
          // 3. 设置相机位置，并使其朝向点击点
          // this.camera.position.copy(cameraPosition);
          await this.animateCamera(this.camera.position, this.cameraPosition);
          this.manager.onLoad = () => {
            this.animateModelEnter(doorList[0].object.parent, 0, (Math.PI / 3) * 2);
            doorList[0].object.loaded = true;
            doorList[1].object.loaded = true;
          };
          // 加载模型
          this.ddd.forEach((el) => {
            const match = el.gasCabinteAddress.match(/^\d+/);
            let offsetY = Number(match[0]);
            const typeUuid = el.gasStockType + "#" + el.uuid;
            if (match) {
              // 判断设备是几u
              const deviceNum = this.computedU(match.input);
              if (deviceNum === "1U") offsetY = offsetY - 0.55;
              // 加载模型
              this.loadModel(`/source/device-${el.gasStockType + deviceNum}.gltf`, true, height, offsetX, offsetY, offsetZ, doorList, typeUuid);
            }
          });
        }
      }
    },
    // 加载设备模型
    loadModel(url, isPlay, height, offsetX, offsetY, offsetZ, model, _uuid) {
      const loader = new GLTFLoader(this.manager);
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
          cityGroup.position.y += (offsetY - 1) * (height / 45) + 60;
          cityGroup.rotateY(Math.PI);
          //给每个设备绑定id
          cityGroup.name = _uuid;

          // 获取模型的世界变换矩阵并计算法向量的世界坐标
          const worldNormal = model[0].face.normal.clone().transformDirection(model[0].object.matrixWorld);
          // 确保朝向正确方向（可根据实际需求调整是否需要乘以 -1）
          // this.worldNormal.multiplyScalar(-1);
          // 假设模型的 Z 轴方向为"正面"，即 (0, 0, 1)
          const modelFrontDirection = new THREE.Vector3(0, 0, 1);
          // 计算旋转轴：使用模型的前向向量和点击面的法向量
          const rotationAxis = new THREE.Vector3().crossVectors(modelFrontDirection, worldNormal).normalize();
          // 计算旋转角度
          let rotationAngle = Math.acos(modelFrontDirection.dot(worldNormal));
          // 将旋转角度四舍五入到最近的 90 度 180 度 270 度 360 度
          rotationAngle = Math.round(rotationAngle / (Math.PI / 2)) * (Math.PI / 2);
          // console.log("🚀 ~ loadModel ~ rotationAngle:", rotationAngle);
          // 创建四元数来表示旋转，并将其应用于 `cityGroup`
          const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);

          // rotationQuaternion.setFromEuler(new THREE.Euler(0, rotationAngle, 0, 'XYZ'));
          // 将旋转应用到模型上
          cityGroup.quaternion.multiply(rotationQuaternion);
          // // 创建辅助线的材质
          // const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
          // // 创建辅助线
          // const lineGeometry = new THREE.BufferGeometry().setFromPoints([cityGroup.position, this.camera.position]);
          // const line = new THREE.Line(lineGeometry, lineMaterial);
          // this.scene.add(line);
          // 把分组后的模型添加到场景中
          this.scene.add(cityGroup);
          // 把模型添加到场景中
          this.scene.add(gltf.scene);

          if (isPlay) {
            // this.action.play();
          }
        },
        (e) => {
          // console.log("模型加载进度：", e.loaded / e.total);
        },
        (error) => {
          console.error("模型加载错误：", error);
        }
      );
    },
    // 修改视角切换方法
    switchView() {
      // 禁用原有的 OrbitControls
      if (this.controls) {
        this.controls.enabled = false;
      }

      // 初始化第一人称控制器
      this.selControls = new PointerLockControls(this.camera, document.body);
 
      // 锁定视角并启用第一人称控制
      this.selControls.lock();
      // 监听解锁事件
      this.selControls.addEventListener("unlock", () => {
        // 移除第一人称控制
        this.selControls = null;

        // 移除键盘控制事件
        // document.removeEventListener("keydown", this.onKeyDown, false);
        // document.removeEventListener("keyup", this.onKeyUp, false);

        // 重新启用 OrbitControls
        if (this.controls) {
          this.controls.enabled = true;

          // 设置 OrbitControls 的目标点
          const direction = new THREE.Vector3(0, 0, -1);
          direction.applyQuaternion(this.camera.quaternion);
          const targetPosition = this.camera.position.clone().add(direction.multiplyScalar(100));
          this.controls.target.copy(targetPosition);

          // 更新控制器
          // this.controls.update();
        }
      });

      // 添加键盘控制事件
      document.addEventListener("keydown", this.onKeyDown, false);
      document.addEventListener("keyup", this.onKeyUp, false);

    },

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
    //camera动画
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
            2000
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
    //模型动画
    animateModelEnter(model, start, end) {
      // const group = new THREE.Group();
      // group.add(model);
      // this.destroyScene(group);
      // console.log("🚀 ~ animateModelEnter ~ model:", model.rotation.y);
      // const computedDeg = (Math.PI / 3) * 2;
      this.tweenEnter = new TWEEN.Tween({
        rotateY: start,
      })
        .to(
          {
            rotateY: end,
          },
          1000
        )
        .onUpdate(({ rotateY }) => {
          model.rotation.set(0, rotateY, 0);
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
        })
        .onComplete(() => {
          this.destroyScene(model);
          this.loadGLTF("/source/中心机房-空机柜.gltf", [0, 345, 0], [1, 1, 1]);
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
      this.$refs.infoRef.style = `transform: translate(${offsetX + 20}px, ${offsetY - 150}px);display:block;`;
      window.addEventListener("mousemove", (e) => {
        if (this.$refs.infoRef) this.$refs.infoRef.style = "display:'';";
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
    // 加载图片加入模型中
    loadImage(url, pos, obj) {
      // 加载图片纹理
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        texture.encoding = THREE.sRGBEncoding; // 设置纹理色彩空间
        // 创建平面几何体
        const geometry = new THREE.PlaneGeometry(450, 600); // 指定平面宽高
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(pos);
        if (obj) {
          plane.position.x += obj.x; // 设置平面位置
          plane.position.y = obj.y; // 设置平面位置
          plane.position.z += obj.z;
        }
        // 将平面添加到场景中
        this.scene.add(plane);
      });
    },
    //过滤模型
    filterModel(intersects, name) {
      if (name === "door") {
        return intersects[0].object.name.split("-")[0] === name ? intersects : [];
      }
      if (name === "device") {
        return intersects[0].object.name.split("-")[0] === name ? intersects : [];
      }
      if (name === "light") {
        return intersects[0].object.name === name ? intersects : [];
      }
      if (name === "roomDoor-4-door") {
        return intersects[0].object.name === name ? intersects : [];
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
    createWebsocket(model) {
      const uuid = model.name.split("-")[1];
      if (this.socket) {
        this.socket.close(1000, "客户端主动断开");
      }
      this.socket = new WebSocket(`wss://gsdyw.gongshu.gov.cn/video/websocket/5?uuid=${uuid}`);

      this.socket.onopen = () => {
        this.socket.send(uuid);
        this.startHeartbeat();
      };
      this.socket.onmessage = (event) => {
        if (event.data == "pong") {
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
        this.socket.send("ping");
        // 心跳包发送后，继续下一次的心跳监测计时
        this.startHeartbeat();
      }, 30000);
    },
    // 重置心跳定时器的函数
    resetHeartbeat() {
      clearTimeout(this.heartbeatTimer);
      this.startHeartbeat();
    },
  },
  beforeDestroy() {
    this.$refs.threeBox.removeEventListener("click", this.onmodelclick);
    window.removeEventListener("resize", this.onWindowResize, false);
    this.cachesModels.clear();
    document.removeEventListener("mousemove", this.onMouseMove, false);
  },
};
</script>

<style scoped>
.container {
  position: relative;

  /* 添加按钮样式 */
  .view-switch-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .view-switch-btn:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  .view-switch-btn:active {
    background-color: #3d8b40;
    transform: scale(0.95);
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
    /* opacity: 0; */
    display: none;
    font-size: 19px;
    color: #000;
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
