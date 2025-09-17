<script>
  // Save token & name on login
  function saveAuth(data) {
    const user = { token: data.token, name: data.name };
    localStorage.setItem("tg_user", JSON.stringify(user));
  }

  // Get user
  function getUser() {
    const stored = localStorage.getItem("tg_user");
    return stored ? JSON.parse(stored) : null;
  }

  // Logout
  function logout() {
    localStorage.removeItem("tg_user");
    window.location.href = "login.html";
  }
</script>

<script>
  // Authentication guard
  const user = getUser();
  if (!user || !user.token) {
    // If not logged in, force redirect
    window.location.href = "login.html";
  }
</script>
