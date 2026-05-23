const mongoose = require('mongoose'); 
require('dotenv').config();
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));