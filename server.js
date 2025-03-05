import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('biblioteca_db', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

// Testar a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida com o banco de dados!');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });

// Definição dos modelos
const User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
});

const Book = sequelize.define('Book', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: Sequelize.STRING, allowNull: false },
  author: { type: Sequelize.STRING, allowNull: false },
});

const Review = sequelize.define('Review', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: Sequelize.INTEGER, allowNull: false },
  bookId: { type: Sequelize.INTEGER, allowNull: false },
  comment: { type: Sequelize.STRING, allowNull: true },
  rating: { type: Sequelize.INTEGER, allowNull: false },
});

// Relacionamentos
User.hasMany(Review);
Book.hasMany(Review);
Review.belongsTo(User);
Review.belongsTo(Book);

// Registro de usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.json(user);
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });
  res.json({ token });
});

// Criar livro
app.post('/books', async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.listen(3001, async () => {
  await sequelize.sync({ force: false });
  console.log('Servidor rodando na porta 3001');
});
