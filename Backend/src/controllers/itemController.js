import Item from '../models/Item.js';

// @desc    Get all items
// @route   GET /api/items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search items
// @route   GET /api/items/search?name=term
export const searchItems = async (req, res) => {
  try {
    const keyword = req.query.name
      ? { itemName: { $regex: req.query.name, $options: 'i' } }
      : {};
    const items = await Item.find({ ...keyword }).populate('user', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name');
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    const item = await Item.create({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      user: req.user.id
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};