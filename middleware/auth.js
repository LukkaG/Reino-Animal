const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado! Token ausente.' });
    }

    try {
        const segredo = process.env.JWT_SECRET;
        const verificado = jwt.verify(token, segredo);
        req.usuarioId = verificado.id;
        
        next(); 
    } catch (err) {
        res.status(403).json({ erro: 'Token inválido!' });
    }
};