const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes;

const db = new Sequelize('kashware', 'kashuser', 'kashpass', {
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 1000
    },
    logging: true
});

const user = db.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    author_pseudonym: {type: DataTypes.STRING, allowNull: false}
});

const userLocal = db.define('userLocal', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
});

const token = db.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER},
    token: {type: DataTypes.STRING, allowNull: false}
});

const book = db.define('book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    author: {type: DataTypes.STRING, allowNull: false},
    cover: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    userId: DataTypes.INTEGER
});

db.sync({}).then(() => {
    console.log('Database configured.')
}).catch(err => {
    console.log(err)
});

module.exports = {
    models: {
        user,
        book,
        userLocal,
        token
    },
    db
}
