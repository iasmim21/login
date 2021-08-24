const jwt = require("jsonwebtoken");
const { promisify } = require('util');
require('dotenv').config();

module.exports = {
    eAdmin://verificar se o token é valido
        async function (req, res, next) {
            const authHeader = req.headers.authorization; //pega os dados de autenticação
            const [, token] = authHeader.split(' '); //pegar só o token da variavel

            if (!token) {
                return res.json({
                    erro: true,
                    message: "Error: Necessário realizar o login para acessar esta página"
                });
            }

            try {
                const decode = await promisify(jwt.verify)(token, process.env.SECRETKEY);
                req.userId = decode.id; //recupera o id
                return next();

            } catch (err) {
                return res.json({
                    erro: true,
                    message: "Error: Login ou senha inválidos"
                });
            }
        }
}
