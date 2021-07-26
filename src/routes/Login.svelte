<script>
  let email = "",
    password = "",
    loading = false,
    success = false,
    error;
  const doLogin = async () => {
    loading = true;
    console.log(email, password, loading);
  };
</script>

<form on:submit={doLogin}>
  <input type="text" placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  <button type="submit">Login</button>
</form>
