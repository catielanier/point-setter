<template>
  <form @submit.prevent="login">
    <input type="text" name="email" placeholder="Email" v-model="email" />
    <input
      type="password"
      name="password"
      placeholder="Password"
      v-model="password"
    />
    <button type="submit">Login</button>
  </form>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      success: false,
      error: null,
    };
  },
  methods: {
    login: async function () {
      const { email, password } = this.$data;
      this.loading = true;
      this.error = null;
      const res = await axios({
        method: "POST",
        url: "/api/users/login",
        data: {
          email,
          password,
        },
      });
      localStorage.setItem("icadPointId", res.data.data.id);
    },
  },
};
</script>
