<template>
  <form @submit.prevent="login">
    <p v-if="error">
      <span>Error:</span> Invalid email and password combination.
    </p>
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
      error: null,
    };
  },
  props: {
    setId: Function,
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
      this.props.setId(res.data.data.id);
      this.loading = false;
    },
  },
};
</script>
