const addTaskBtn = document.getElementById("addTaskBtn");
const loginModal = document.getElementById("loginModal");
const taskModal = document.getElementById("taskModal");
const loginBtn = document.getElementById("loginBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const newTaskInput = document.getElementById("newTaskInput");
const taskList = document.getElementById("taskList");

let isLoggedIn = false; // Mude para true se o backend confirmar login

addTaskBtn.addEventListener("click", () => {
  if (!isLoggedIn) {
    loginModal.style.display = "flex";
  } else {
    taskModal.style.display = "flex";
  }
});

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simula login (substituir com chamada real ao backend)
  if (email && password) {
    isLoggedIn = true;
    loginModal.style.display = "none";
    taskModal.style.display = "flex";
  } else {
    alert("Preencha os campos corretamente.");
  }
});

saveTaskBtn.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    const li = document.createElement("li");
    li.className = "task";
    li.textContent = taskText;
    taskList.appendChild(li);
    newTaskInput.value = "";
    taskModal.style.display = "none";
  } else {
    alert("Digite uma tarefa.");
  }
});

// Fechar modal clicando fora (extra)
window.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === taskModal) taskModal.style.display = "none";
});
