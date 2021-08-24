require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

//recomendado que use esta parte apenas em ambiante de desenvolvimento
// sequelize.authenticate().then(function () {
//     console.log("Conexão com o banco de dados realizada com  sucesso!");
// }).catch(function (err) {
//     console.log("ERROR: Conexão com o banco de dados não realizada com sucesso.");

// })

module.exports = sequelize;