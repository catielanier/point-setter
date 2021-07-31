<template>
  <div class="main-container">
    <h1>Point Setter</h1>
    <Login v-if="!userId" :setId="setId" />
    <Setter v-else />
  </div>
</template>

<script>
import Login from "./components/Login.vue";
import Setter from "./components/Setter.vue";

export default {
  name: "App",
  data() {
    return {
      userId: null,
    };
  },
  components: {
    Login,
    Setter,
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
body {
  background: wheat;
}
.main-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.6rem;
  text-align: center;
  color: black;
  margin-top: 60px;
}
</style>
