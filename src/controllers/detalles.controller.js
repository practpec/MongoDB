const { MongoClient, ObjectId} = require('mongodb');
const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const collectionName = process.env.MONGO_COLLECTION;

const index = async (req, res) => {
  try {
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit; 

      const data = await collection.find({}).skip(skip).limit(limit).toArray();
      const totalDocuments = await collection.countDocuments({});
      const totalPages = Math.ceil(totalDocuments / limit);
      
      client.close();

      const response = {
          message: "Se obtuvieron correctamente los datos",
          page,
          limit,
          totalPages,
          totalDocuments,
          data
      };

      res.json(response);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

const getById = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const idPedido = req.params.id;
    const results = await collection.find({ idPedido: Number(idPedido) }).toArray();
    client.close();
    if (results.length === 0) {
      res.status(404).json({ mensaje: 'No se encontraron resultados' });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
const create = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const nuevoDato = {
      idPedido: req.body.idPedido,
      idProducto: req.body.idProducto,
      cantidadAguacate: req.body.cantidadAguacate,
      cantidadQueso: req.body.cantidadQueso,
      cantidadAmbos: req.body.cantidadAmbos,
      original: req.body.original,
      createdAt: new Date(),
      updatedAt: null,
      deleted: false,
      deletedAt: null
    };

    const resultado = await collection.insertOne(nuevoDato);

    client.close();
    res.status(201).json({ mensaje: 'Los detalles del pedido se agregaron con éxito', id: resultado.insertedId });
  } catch (error) {
    console.error('Error al agregar los detalles:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
const deleteFisico = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const objectId = new ObjectId(id);
    console.log('ID a eliminar:', objectId);
    const result = await collection.deleteOne({ _id: objectId });
    console.log('Resultado de eliminación:', result);
    client.close();
    if (result.deletedCount === 0) {
      res.status(404).json({ mensaje: 'No se encontraron documentos para eliminar' });
    } else {
      res.status(200).json({ mensaje: 'Documentos eliminados correctamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el detalle del pedido:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
const deleteLogico = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const updateFields = {
      deleted: true,
      deletedAt: new Date(),
    };
    const result = await collection.updateOne({ _id: objectId }, { $set: updateFields });

    client.close();

    if (result.matchedCount === 0) {
      res.status(404).json({ mensaje: 'No se encontró el detalle' });
    } else {
      res.status(200).json({ mensaje: 'La eliminación lógica se realizó correctamente' });
    }
  } catch (error) {
    console.error('Error al realizar la eliminación lógica del detalle del pedido:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
const updateParcial = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const cambios = req.body;
    const updateFields = {
      updatedAt: new Date(),
    };
    for (const campo in cambios) {
      updateFields[campo] = cambios[campo];
    }
    const result = await collection.updateOne({ _id: objectId }, { $set: updateFields });
    client.close();
    if (result.matchedCount === 0) {
      res.status(404).json({ mensaje: 'Detalle no encontrado' });
    } else {
      res.status(200).json({ mensaje: 'Actualización parcial realizada correctamente' });
    }
  } catch (error) {
    console.error('Error al realizar la actualización parcial del detalle del pedido:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports ={
    index,
    getById,
    create,
    deleteFisico,
    deleteLogico,
    updateParcial

}