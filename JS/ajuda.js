const perguntas = document.querySelectorAll(".faq-question");

perguntas.forEach(pergunta => {

  pergunta.addEventListener("click", () => {

    const resposta =
      pergunta.nextElementSibling;

    resposta.classList.toggle("active");

  });

});