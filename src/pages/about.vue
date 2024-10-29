<template>
  <div class="container">about</div>
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
    console.log(this.$route.query, "this.$route.query");
  },
  methods: {},
};
</script>
<style scoped>
.container {
  text-align: center;
  font-size: 20px;
}
</style>
