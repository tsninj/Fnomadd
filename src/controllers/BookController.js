const { getAllBooks, addBook, deleteBook, updateBook } = require('../models/BookModel.js');

// Бүх ном авах
const getAllBooksController = async (req, res) => {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

// Ном нэмэх
const addBookController = async (req, res) => {
    const { title, author, price, category, image } = req.body;
    try {
        const response = await addBook(title, author, price, category, image);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

// Ном устгах
const deleteBookController = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteBook(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

// Номын мэдээлэл шинэчлэх
const updateBookController = async (req, res) => {
    const { id } = req.params;
    const { title, author, price, category, image } = req.body;
    try {
        const response = await updateBook(id, title, author, price, category, image);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    getAllBooksController,
    addBookController,
    deleteBookController,
    updateBookController
};
