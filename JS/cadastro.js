const togglePasswords = document.querySelectorAll(".toggle-password");

togglePasswords.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("data-target");
    const passwordInput = document.getElementById(targetId);
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });
});

const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const nomeDigitado = document.getElementById('nome').value;
    const emailDigitado = document.getElementById('email').value;
    const enderecoDigitado = document.getElementById('address').value;

    const resposta = await fetch('/usuarios', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nomeCompleto: nomeDigitado,
            email: emailDigitado,
            senha: password,
            endereco: enderecoDigitado
        })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = "/login.html";
    } else {
        alert('Erro ao cadastrar: ' + dados.erro);
    }

} catch (err) {
    console.error('Erro na conexão:', err);
    alert('Erro ao conectar com o servidor.');
}

});