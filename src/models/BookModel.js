const pool = require('../../db.js');

  
// Бүх номыг авах
const getAllBooks = async () => {
    const result = await pool.query("SELECT * FROM books");
    return result.rows;
};

// Ном нэмэх
const addBook = async (title, author, price, category, image) => {
    await pool.query(`CALL sp_addbook($1, $2, $3, $4, $5)`, [title, author, price, category, image]);
    return { message: "Ном амжилттай нэмэгдлээ." }; 
};

// Номыг ID-р устгах
const deleteBook = async (id) => {
    await pool.query("CALL sp_deletebook($1)", [id]);
    return { message: "Ном амжилттай устгагдлаа." }; 
};

// Номын мэдээлэл шинэчлэх
const updateBook = async (id, title, author, price, category, image) => {
    await pool.query(`CALL sp_updatebook($1, $2, $3, $4, $5, $6)`, [id, title, author, price, category, image]);
    return { message: "Номын мэдээлэл амжилттай шинэчлэгдлээ." }; 
};

module.exports = {
    getAllBooks,
    addBook,
    deleteBook,
    updateBook
};
