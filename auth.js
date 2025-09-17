<script>
  // Save token on login
  function saveAuth(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.name);
  }

  // Get user
  function getUser() {
    return {
      token: localStorage.getItem("token"),
      name: localStorage.getItem("userName")
    };
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  }
</script>
