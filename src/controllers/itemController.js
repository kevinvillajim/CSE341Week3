const { ObjectId } = require("mongodb");
const database = require("../config/database");

exports.getAllItems = async (req, res) => {
  try {
    // Obtener la colección en cada método
    const collection = database.getCollection("items");
    const items = await collection.find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const collection = database.getCollection("items");
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const collection = database.getCollection("items");
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const collection = database.getCollection("items");
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
