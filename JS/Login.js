const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", () => {

  const type =
    passwordInput.getAttribute("type") === "password"
      ? "text"
      : "password";

  passwordInput.setAttribute("type", type);

  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");

});

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {

  event.preventDefault(); 


  const emailDigitado = document.getElementById('email').value;
  const senhaDigitada = document.getElementById('password').value;

  try {

    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailDigitado,
        senha: senhaDigitada 
      })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('tokenReinoAnimal', dados.token);
      alert(`Bem-vindo de volta, ${dados.usuario.nome}!`);
      window.location.href = "/HTML/index.html";
      
    } else {
      alert(dados.erro);
    }

  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    alert('Não foi possível conectar ao servidor do Reino Animal.');
  }
});
