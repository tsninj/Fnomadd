const CartModel = require('../models/CartModel.js');

const getAllCartItems = async (req, res) => {
  try {
    const cart = await CartModel.getAllCartItems();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { book_id, quantity } = req.body;
    await CartModel.addToCart(book_id, quantity);
    res.json({ message: "Book added to cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await CartModel.removeFromCart(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateCartadd = async (req, res) => {
  try {
    await CartModel.updateCart(req.params.id);
    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
const updateCartsubs = async (req, res) => {
  try {
    await CartModel.updateCart(req.params.id);
    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
module.exports = { getAllCartItems, addToCart, removeFromCart, updateCartadd, updateCartsubs };
