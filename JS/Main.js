const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Raca = require('../models/Raca');       
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbURI = process.env.MONGO_URI;


console.log('Link encontrado pelo Node:', dbURI);

app.post('/usuarios', async (req, res) => {
  try {
    console.log('Dados recebidos do formulário:', req.body);

   
    const novoUsuario = await Usuario.create({
      nomeCompleto: req.body.nomeCompleto,
      email: req.body.email,
      senha: req.body.senha,
      endereco: req.body.endereco
    });

   
    res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso!', 
      usuario: novoUsuario 
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar no banco: ' + err.message });
  }
});

app.post('/racas', async (req, res) => {
    try {
        const novaRaca = await Raca.create({
            nomeRaca: req.body.nomeRaca,
            porte: req.body.porte,
            expectativaVida: req.body.expectativaVida,
            descricao: req.body.descricao
        });

        res.status(201).json({ 
            mensagem: 'Raça cadastrada!', 
            dados: novaRaca 
        });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.get('/racas', async (req, res) => {
    try {
        const listaDeRacas = await Raca.find();

        res.status(200).json(listaDeRacas);

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.post('/produtos', async (req, res) => {

	try{
		const novoProduto = await Produto.create({
			nomeProduto: req.body.nomeProduto,
			descricao: req.body.descricao,
			categoria: req.body.categoria,
			preco: req.body.preco,
      imagem: req.body.imagem,
			atributos: req.body.atributos,
			estoque: req.body.estoque,
		});
		res.status(201).json({
			mensagem: 'Produto novo cadastrado com sucesso!',
			produto: novoProduto
		});
	} catch (err) {
		res.status (500).json({ erro: 'Erro ao salvar no banco: ' + err.message});
	}
});

app.get('/produtos', async (req, res) => {
	try {
		const listaDeProdutos = await Produto.find();
		
		res.status(200).json(listaDeProdutos);
	
	} catch (err) {
		res.status(500).json({ erro: err.message});
	}
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        const produtoDeletado = await Produto.findByIdAndDelete(req.params.id);

        if (!produtoDeletado) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.status(200).json({ mensagem: 'Produto removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar: ' + err.message });
    }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuarioEncontrado = await Usuario.findOne({ email: email });

    if (!usuarioEncontrado) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }

    if (usuarioEncontrado.senha !== senha) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }

    res.status(200).json({ 
      mensagem: 'Login realizado com sucesso! 🎉',
      usuario: { nome: usuarioEncontrado.nomeCompleto }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor: ' + err.message });
  }
});

mongoose.connect(dbURI)
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    const port = 3000;
    app.listen(port, () => {
      console.log(`Servidor Web Ativo em http://localhost:${port}`)
    });
    return Usuario.find();
  })
  .then((usuarioSalvos) => {
    console.log('Estes são os seus usuários salvos:', usuarioSalvos);
  })
  .catch((err) => console.error('Erro na operação:', err));

  