import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import controller from "./routes.js";
import connectDB from './dbConection.js';

// Conectar a la base de datos MongoDB
connectDB();

// Middleware para parsear JSON

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

config(); // Carga las variables de entorno de .env

app.use(cors());
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios
app.use(express.json()); 
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use('/api/users', controller);

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on port http://localhost:${listener.address().port}`);
});
