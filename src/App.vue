<template>
  <Login v-if="!userId" :setId="setId" />
</template>

<script>
import Login from "./components/Login.vue";

export default {
  name: "App",
  data() {
    return {
      userId: null,
    };
  },
  components: {
    Login,
  },
  mounted() {
    this.userId = localStorage.getItem("icadPointId");
  },
  methods: {
    setId: function (id) {
      this.userId = id;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
