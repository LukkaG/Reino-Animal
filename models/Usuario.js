const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  senha: { 
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;