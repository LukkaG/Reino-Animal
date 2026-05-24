const mongoose = require('mongoose');

const racaSchema = new mongoose.Schema({
    nomeRaca: {
        type: String,
        required: true
    }, 
    porte: {
        type: String,
        required: true 
    }, 
    expectativaVida: {
        type: String,
        required: true 
    },
    descricao: { 
        type: String,
        required: true 
    },
});

const Raca = mongoose.model('Raca', racaSchema);

module.exports = Raca;