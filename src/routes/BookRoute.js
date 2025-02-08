const express = require('express');
const router = express.Router();
const { 
    getAllBooksController, 
    addBookController, 
    deleteBookController, 
    updateBookController 
} = require('../controllers/BookController.js'); // ✅ Corrected imports

// Бүх номыг авах
router.get('/', getAllBooksController);

// Ном нэмэх
router.post('/', addBookController);

// Ном устгах
router.delete('/:id', deleteBookController);

// Номын мэдээлэл шинэчлэх
router.put('/:id', updateBookController);

module.exports = router;
