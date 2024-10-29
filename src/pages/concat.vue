<template>
  <div class="container">
    <p>concat</p>
    <img ref="img" alt="" srcset="" />
    <button @click="close">close</button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  activated() {},
  computed: {},
  wacth: {},
  created() {},
  mounted() {
    // 调用函数并传入图片URL
    this.downloadImageAsFile(
      "/api/public/service/download2.action?serverPath=/ueditor/data/20240829/1724895585518000168.jpg&token=Fry4mO4ygq34q1GpgPsi456sCekz+XRC"
    ).then((file) => {
      this.convertFileToBase64(file);
    });
  },
  methods: {
    close() {
      window.close();
    },
    convertFileToBase64(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 当文件读取完成时，触发回调函数
        console.log(e, "ccccccccccc");
        this.$refs.img.src = e.target.result;
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
      // 读取文件为DataURL格式，即Base64编码
      reader.readAsDataURL(file);
    },
    async downloadImageAsFile(url) {
      try {
        // 使用fetch API发起GET请求
        const response = await fetch(url, {
          // credentials: "omit",
        });
        // 检查响应状态
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        // 从响应体中读取Blob数据
        const blob = await response.blob();

        // 创建File对象
        // `image/jpeg` 是一个假设的MIME类型，根据实际情况调整
        // `imageName` 是一个假设的文件名，根据实际情况调整
        const file = new File([blob], "imageName.jpg", { type: "image/jpeg" });

        return file;
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    },
  },
};
</script>
<style scoped>
.container {
  text-align: center;
  font-size: 20px;
}
</style>
