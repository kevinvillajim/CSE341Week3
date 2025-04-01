const { ObjectId } = require("mongodb");
const database = require("../config/database");

// Helper function for data validation
const validateItemData = (data) => {
  const errors = [];
  
  // Check if required fields exist
  if (!data.name) errors.push("Item name is required");
  if (!data.description) errors.push("Item description is required");
  
  // Validate data types
  if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
    errors.push("Price must be a positive number");
  }
  
  if (data.quantity !== undefined && (isNaN(data.quantity) || !Number.isInteger(data.quantity) || data.quantity < 0)) {
    errors.push("Quantity must be a positive integer");
  }
  
  return errors;
};

exports.getAllItems = async (req, res) => {
  try {
    const collection = database.getCollection("items");
    const items = await collection.find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    // Validate the request data
    const validationErrors = validateItemData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    const collection = database.getCollection("items");
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    // Validate the request data
    const validationErrors = validateItemData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    // Validate ID format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
    const collection = database.getCollection("items");
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // Validate ID format
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
    const collection = database.getCollection("items");
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};