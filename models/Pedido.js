const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    itens: [{
        nome: { type: String, required: true },
        preco: { type: Number, required: true },
        quantidade: { type: Number, required: true }
    }],
    total: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;