require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { MONGO_URI, MONGO_BD, SALTOS_BCRYPT } = process.env;

const create = async (req, res) => {
    try {
        const collectionName = 'Usuarios';
        const client = new MongoClient(MONGO_URI);
        await client.connect();

        const db = client.db(MONGO_BD);
        const collection = db.collection(collectionName);

        const usuario = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, parseInt(SALTOS_BCRYPT)),
            createdAt: new Date(),
            updatedAt: null,
            deleted: false,
            deletedAt: null
        };

        await collection.insertOne(usuario);

        client.close();

        return res.status(201).json({
            mensaje: "Usuario creado exitosamente!"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "No se pudo crear el usuario",
            error: error.message
        });
    }
};

module.exports = {
    create
};
