<template>
  <div class="hello">
    hello
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  mounted() {
    this.deay("2021年01月01日");
  },
  methods: {
    deay(dateStr) {
      // 使用正则表达式提取年份、月份和日期
      const dateParts = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
      // /(ain|bb)/g; // 匹配ain或者bb
      // 提取年份、月份和日期，并将月份和日期格式化为两位数
      const year = dateParts[1];
      const month = ("0" + dateParts[2]).slice(-2);
      const day = ("0" + dateParts[3]).slice(-2);
      // 构建新的日期字符串
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
  },
};
</script>

<style scoped>
.hello {
  display: flex;
}
h1 {
  margin: 40px auto;
}
</style>
