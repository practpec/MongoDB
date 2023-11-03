const express = require('express');
const app = express();
require('dotenv').config();
require('./src/configs/db.config');
const PORT = process.env.PORT;

const detallesRouter = require('./src/routes/detalles.route');
const authRouter = require('./src/routes/auth.route');
const usuariosRouter = require('./src/routes/usuarios.route');


app.use(express.json());
app.use('/usuarios', usuariosRouter);
app.use('/detalles', detallesRouter);
app.use('/auth', authRouter); 
app.listen(PORT, () => {
    console.log("API escuchando en el puerto " + PORT);
});