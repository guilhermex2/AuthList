document.addEventListener('DOMContentLoaded', async () => {
  const areaTarefas = document.querySelector('.area-tarefas');
  const modal = document.getElementById('modalTarefa');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalDescricao = document.getElementById('modalDescricao');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const btnNovaTarefa = document.getElementById('btnNovaTarefa');
  const modalCriarTarefa = document.getElementById("modalCriarTarefa");
  const btnFecharCriarTarefa = document.getElementById("btnFecharCriarTarefa");
  const btnAdciona = document.getElementById("adicionar");
  const btnConcluido = document.getElementById("btnConcluido");

  let tarefaSelecionadaId = null; // Armazena o ID da tarefa clicada

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

    areaTarefas.innerHTML = ''; // Limpa as tarefas fixas, se houver

    users.forEach(user => {
      user.task.forEach(tarefaData => {
        const tarefaDiv = document.createElement('div');
        tarefaDiv.classList.add('tarefa');
        tarefaDiv.innerHTML = `
          <div class="title-tarefa" data-id="${tarefaData.id}">${tarefaData.title}</div>
        `;

        tarefaDiv.addEventListener('click', () => {
          modalTitulo.textContent = tarefaData.title;
          modalDescricao.textContent = tarefaData.description;
          tarefaSelecionadaId = tarefaData.id; // Salva o ID da tarefa clicada
          modal.style.display = 'flex';
        });

        areaTarefas.appendChild(tarefaDiv);
      });
    });

    btnConcluido.addEventListener("click", () => {
      if (!tarefaSelecionadaId) {
        alert("Nenhuma tarefa selecionada.");
        return;
      }

      fetch(`http://localhost:4000/concluir-tarefa/${tarefaSelecionadaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: true
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao concluir a tarefa");
          }
          return response.json();
        })
        .then(data => {
          alert("Tarefa concluída com sucesso!");
          modal.style.display = 'none';
          window.location.reload();
        })
        .catch(error => {
          alert(error.message);
        });
    });

    btnNovaTarefa.addEventListener("click", () => {
      modalCriarTarefa.style.display = "block";
    });

    btnAdciona.addEventListener("click", async () => {
      const titulo = document.getElementById("title").value;
      const descricao = document.getElementById("description").value;

      fetch('http://localhost:4000/criar-tarefas', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: titulo,
          description: descricao
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Tarefa criada com sucesso:', data);
          window.location.reload();
        });
    });

    btnFecharCriarTarefa.addEventListener("click", () => {
      modalCriarTarefa.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modalCriarTarefa) {
        modalCriarTarefa.style.display = "none";
      }
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    btnFecharModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
  }
});
