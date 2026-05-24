const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nomeProduto: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  imagem: {
    type: String
  },
  atributos: {
    type: [String]
  },
  estoque: {
    type: Number,
    required: true
  }
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;