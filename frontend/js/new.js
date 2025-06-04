document.addEventListener('DOMContentLoaded', async () => {
  const inputDescricao = document.getElementById('task');
  const inputData = document.getElementById('date');
  const btnAdicionar = document.getElementById('btn-add');
  const areaTarefa = document.querySelector('.area-tarefa');
  const btnLogout = document.getElementById('btn-logout');
  
  btnLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/listar-tarefas', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    const users = await response.json();
    areaTarefa.innerHTML = '';

    const main = document.querySelector('main');

    users.forEach(user => {
      user.task.forEach(tarefaData => {
        const novaSection = document.createElement('section');
        novaSection.classList.add('section-task');

        const descricao = tarefaData.status ? `${tarefaData.title} ✅` : tarefaData.title;

        novaSection.innerHTML = `
          <div class="area">
            <div class="btn-concluir">
              <input type="checkbox" class="marcar-individual" ${tarefaData.status ? 'checked' : ''}>
            </div>
            <div class="area-tarefa">
              <p class="descricao-tarefa" data-id="${tarefaData.id}">${descricao}</p>
            </div>
            <div class="area-data">
              <p>${new Date(tarefaData.date).toLocaleDateString()}</p>
            </div>
            <div class="btn-excluir">
              <button class="btn-excluir">Excluir</button>
            </div>
          </div>
        `;

        // Marcar como concluída
        const checkbox = novaSection.querySelector('.marcar-individual');
        checkbox.addEventListener('change', async () => {
          try {
            const response = await fetch(`http://localhost:4000/concluir-tarefa/${tarefaData.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ status: checkbox.checked })
            });

            if (!response.ok) throw new Error("Erro ao marcar tarefa.");

            alert("Tarefa atualizada!");
            location.reload();
          } catch (err) {
            alert(err.message);
          }
        });

        // Excluir tarefa
        const botaoExcluir = novaSection.querySelector('.btn-excluir');
        botaoExcluir.addEventListener('click', async (e) => {
          e.stopPropagation();

          const confirmacao = confirm("Deseja realmente excluir?");
          if (!confirmacao) return;

          try {
            const response = await fetch(`http://localhost:4000/deletar-tarefa/${tarefaData.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) throw new Error("Erro ao excluir tarefa.");

            alert("Tarefa excluída!");
            location.reload();
          } catch (err) {
            alert(err.message);
          }
        });

        main.appendChild(novaSection);
      });
    });

    // Adicionar nova tarefa
    btnAdicionar.addEventListener("click", async () => {
      const descricao = inputDescricao.value;
      const date = inputData.value;

      if (!descricao || !date) {
        alert("Preencha todos os campos.");
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/criar-tarefas', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: descricao,
            description: descricao,
            date: date
          })
        });

        if (!response.ok) throw new Error("Erro ao adicionar tarefa.");

        alert("Tarefa adicionada com sucesso!");
        location.reload();
      } catch (err) {
        alert(err.message);
      }
    });

  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
  }
});
