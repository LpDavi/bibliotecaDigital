const API = 'http://localhost:3001';
let token = localStorage.getItem('token');

if (token) {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadBooks();
}

function register() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(() => alert('Usuário cadastrado com sucesso!'));
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(data => {
      if (data.token) {
        token = data.token;
        localStorage.setItem('token', token);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadBooks();
      } else {
        alert('Login inválido!');
      }
    });
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  document.getElementById('auth').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

function addBook() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  fetch(`${API}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author })
  }).then(res => res.json())
    .then(loadBooks);
}

function loadBooks() {
  fetch(`${API}/books`)
    .then(res => res.json())
    .then(books => {
      const list = document.getElementById('bookList');
      list.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${book.title}</strong> - ${book.author}
          <button onclick="rateBook(${book.id})">Avaliar</button>
          <button onclick="deleteBook(${book.id})">Excluir</button>
        `;
        list.appendChild(li);
      });
    });
}

function deleteBook(id) {
  fetch(`${API}/books/${id}`, {
    method: 'DELETE'
  }).then(() => loadBooks());
}

function rateBook(bookId) {
  const rating = prompt('Dê uma nota de 1 a 5:');
  const comment = prompt('Deixe um comentário (opcional):');
  const userId = decodeToken(token).id;

  fetch(`${API}/books/${bookId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, rating: parseInt(rating), comment })
  }).then(res => res.json())
    .then(data => alert(data.message));
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
}