const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const verificarToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const Raca = require('../models/Raca');       
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbURI = process.env.MONGO_URI;

console.log('Link encontrado pelo Node:', dbURI);

app.post('/finalizar-compra', verificarToken, async (req, res) => {
    try {
        const { itens, total } = req.body;
        const novoPedido = new Pedido({
            usuario: req.usuarioId,
            itens,
            total
        });

        await novoPedido.save();
        res.status(201).json({ mensagem: 'Pedido realizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao salvar pedido: ' + err.message });
    }
});

app.post('/usuarios', async (req, res) => {
  try {
    console.log('Dados recebidos do formulário:', req.body);

    const { nomeCompleto, email, senha, endereco } = req.body;	
      const saltRounds = 10;
	    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
      const novoUsuario = await Usuario.create({
      nomeCompleto: nomeCompleto,
      email: email,
      senha: senhaCriptografada,
      endereco: endereco
    });

   
    res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso!', 
      usuario: { nomeCompleto: novoUsuario.nomeCompleto, email: novoUsuario.email }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar no banco: ' + err.message });
  }
});

app.post('/racas', async (req, res) => {
    try {
        const novaRaca = await Raca.create({
            nomeRaca: req.body.nomeRaca,
            tipo: req.body.tipo,
            classe: req.body.classe,
            imagem: req.body.imagem,
            porte: req.body.porte,
            expectativaVida: req.body.expectativaVida,
            descricao: req.body.descricao,
            cuidados: req.body.cuidados,
            dicas: req.body.dicas
        });

        res.status(201).json({ 
            mensagem: 'Raça cadastrada com sucesso!', 
            dados: novaRaca 
        });

    } catch (err) {
        console.error("Erro no POST /racas:", err);
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

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            mensagem: 'Login realizado com sucesso! 🎉',
            token: token,
            usuario: { nome: usuarioEncontrado.nomeCompleto }
        });

    } catch (err) {
        res.status(500).json({ erro: 'Erro no servidor: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    
    // Inicie o servidor APÓS a conexão com o banco
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro na conexão com o banco:', err);
    process.exit(1); // Finaliza o processo se não conseguir conectar
  });
  