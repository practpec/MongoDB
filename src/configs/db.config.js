const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB exitosamente"))
  .catch(error => console.error("Error al conectar a MongoDB:", error));
