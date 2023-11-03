const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const { MONGO_URI, MONGO_BD, SECRET_JWT } = process.env;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const client = new MongoClient(MONGO_URI);
        await client.connect();

        const db = client.db(MONGO_BD);
        const collection = db.collection('Usuarios');

        const usuarioEncontrado = await collection.findOne({ email });

        if (!usuarioEncontrado) {
            client.close();
            return res.status(200).json({
                message: "Email o contraseña incorrecta"
            });
        }

        const passwordCorrecta = bcrypt.compareSync(password, usuarioEncontrado.password);

        client.close();

        if (!passwordCorrecta) {
            return res.status(200).json({
                message: "Email o contraseña incorrecta"
            });
        }

        const payload = {
            usuario: {
                _id: usuarioEncontrado._id
            }
        };

        const token = jwt.sign(payload, SECRET_JWT, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Acceso concedido",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al intentar loguearse",
            error: error.message
        });
    }
};

module.exports = {
    login
};
