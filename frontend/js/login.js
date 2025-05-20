document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#senha').value;

    try {
      const resposta = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        alert('Login realizado com sucesso!');
        window.location.href = '../html/home.html';
        // Redirecionar, salvar token, etc.
        // window.location.href = '/dashboard.html';
      } else {
        alert(`Erro: ${dados.mensagem || 'Login inválido'}`);
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro ao conectar com o servidor.');
    }
  });
});
