<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
</script>

<main>
  <h1>Assignment Point Setter</h1>
  <Router>
    <Route path="/" component={Login} />
  </Router>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>

