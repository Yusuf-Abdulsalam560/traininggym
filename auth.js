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
    sessionStorage.removeItem("tg_user");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "login.html";
  }

  // Update nav based on auth
  function updateNavForAuth() {
    const user = getUser();
    const loginLink = document.getElementById("navLogin");
    const signupLink = document.getElementById("navSignup");
    const logoutBtn = document.getElementById("navLogout");

    if (user && user.token) {
      if (loginLink) loginLink.style.display = "none";
      if (signupLink) signupLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginLink) loginLink.style.display = "inline-block";
      if (signupLink) signupLink.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  // Run on page load
  window.addEventListener("load", () => {
    updateNavForAuth();
    const logoutBtn = document.getElementById("navLogout");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    // Guard: redirect if no user
    const user = getUser();
    if (!user || !user.token) {
      if (!window.location.pathname.endsWith("login.html")) {
        window.location.href = "login.html";
      }
    }
  });
</script>
