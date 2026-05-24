// Seleciona todos os botões de mostrar/ocultar senha
const togglePasswords = document.querySelectorAll(".toggle-password");

togglePasswords.forEach(toggle => {
  toggle.addEventListener("click", () => {
    // Pega o ID do input correspondente através do data-target
    const targetId = toggle.getAttribute("data-target");
    const passwordInput = document.getElementById(targetId);

    // Alterna entre text e password
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Alterna o ícone
    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });
});

// Impede o envio do formulário padrão para facilitar o teste
const form = document.getElementById("registerForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  alert("Cadastro realizado com sucesso! (Simulação)");
  window.location.href = "./login.html"; // Redireciona para o login após cadastrar
});