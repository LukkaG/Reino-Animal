const mongoose = require('mongoose');

const racasSchema = new mongoose.Schema({
    nomeRaca: { 
        type: String, 
        required: true 
    },
    tipo: { 
        type: String, 
        required: true
    },
    classe: {
        type: String
    },
    imagem: { 
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
    cuidados: [{ 
        type: String
    }],
    dicas: [{ 
        type: String
    }]
});

module.exports = mongoose.model('Raca', racasSchema);