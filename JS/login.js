const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('tokenReinoAnimal');
    
    if (token) {
        window.location.href = "/loja.html";
    }
});

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

    const resposta = await fetch('/login', {
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
      window.location.href = "/Index.html";
      
    } else {
      alert(dados.erro);
    }

  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    alert('Não foi possível conectar ao servidor do Reino Animal.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink'); // ID do seu botão de login no nav
    const token = localStorage.getItem('tokenReinoAnimal');

    if (token) {
        // Usuário logado: troca o botão de login por um botão de Sair
        loginLink.innerHTML = '<button onclick="logout()">Sair</button>';
    }
});

function logout() {
    localStorage.removeItem('tokenReinoAnimal'); // Apaga o token
    window.location.href = "/Index.html"; // Volta para a home
}

const token = localStorage.getItem('tokenReinoAnimal');

fetch('/finalizar-compra', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ itens: carrinho })
});