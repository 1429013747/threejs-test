import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.devtools = true;
Vue.config.productionTip = false;

// 按需导入echarts
// import * as echarts from 'echarts/core';
// import { BarChart, PieChart, GaugeChart, LineChart } from 'echarts/charts';
// import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, ToolboxComponent, MarkLineComponent } from 'echarts/components';
// import { CanvasRenderer } from 'echarts/renderers';
// echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, PieChart, GaugeChart, LegendComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, LineChart, MarkLineComponent]);
// Vue.prototype.$echarts = echarts;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
