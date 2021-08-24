const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
const { eAdmin } = require('./middlewares/auth');
const User = require('./models/User');
const app = express();
app.use(express.json());

//isso é um middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");// * quer dizer que qualquer url pode fazer uma requisição
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

//LISTAR USERS - rota restrita, somente usuários com token(logados) conseguem acessar
app.get('/users', eAdmin, async (req, res) => {
    await User.findAll({ order: [['id', 'DESC']] }).then(function (users) {
        return res.json({
            erro: false,
            users
        });
    }).catch(function () {
        return res.json({
            erro: true,
            message: "Erro: Nenhum usuário encontrado!"
        });

    });
});

//DETALHES - um unico usuario, rota restrita
app.get('/user/:id', eAdmin, async (req, res) => {
    await User.findByPk(req.params.id).then(user => {
        return res.json({
            erro: false,
            user
        });
    }).catch(function () {
        return res.json({
            erro: true,
            message: "Erro: Usuário não encontrado!"
        });
    });
})

//EDITAR UUSUÁRIO - rota restrita
app.put('/user', eAdmin, async (req, res) => {
    var data = req.body;
    data.password = await bcrypt.hash(data.password, 8);

    await User.update(data, { where: { id: data.id } }).then(function () {
        return res.json({
            erro: false,
            message: "Usuário editado com sucesso!"
        });
    }).catch(function () {
        return res.json({
            erro: true,
            message: "Erro: Usuário não editado com sucesso"
        });
    });
});

//DELETAR USUÁRIO - rota restrita
app.delete('/user/:id', async (req, res) => {
    await User.destroy({ where: { id: req.params.id } }).then(function () {
        return res.json({
            erro: false,
            message: "Usuário deletado com sucesso"
        });
    }).catch(function () {
        return res.json({
            erro: true,
            message: "Erro: Usuário não deletado com sucesso"
        });
    });
});

//CADASTRAR USUÁRIO - rota restrita
app.post('/user', async (req, res) => {
    var data = req.body;

    //criptografa a senha
    data.password = await bcrypt.hash(data.password, 8);

    await User.create(data).then(function () {
        return res.json({
            erro: false,
            message: "Usuário cadastrado com sucesso!"
        });
    }).catch(function () {
        return res.json({
            erro: true,
            message: "Erro: Usuário não cadastrado!"
        });
    })

});

app.post('/login', async (req, res) => {

    const user = await User.findOne({ where: { email: req.body.user } });

    if (user === null) {
        return res.json({
            erro: true,
            message: "Erro: Usuário ou senha incorreta!"
        });
    }

    //se a senha enviada não for igual a do banco de dados
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.json({
            erro: true,
            message: "Erro: Usuário ou senha incorreta!"
        });
    }

    //validar login
    var token = jwt.sign({ id: user.id }, process.env.SECRETKEY, {
        expiresIn: '1d' // tempo que o token fica ativo: 1 dia
    })
    return res.json({
        erro: false,
        message: "Login realizado com succeso!",
        token: token
    });

});


app.listen(8080, function () {
    console.log('Servidor iniciado na porta 8080');
});