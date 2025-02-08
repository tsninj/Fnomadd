[# Fnomadd](https://www.figma.com/design/O3uYorWHJg7WZ64sqKCsf8/Untitled?node-id=680-1381&p=f&t=wvKjvhJAdbU0x94i-0)
require("dotenv").config();
const express = require("express");
const pool = require("./src/config/db");

const app = express();
app.use(express.json());

// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.error("Database connection error", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

// ✅ Call Stored Procedure to Add a Book
app.post("/books", async (req, res) => {
  try {
    const { title, author, price, category, image } = req.body;
    const query = `CALL sp_addbook($1, $2, $3, $4, $5)`;
    const values = [title, author, price, category, image];

    await pool.query(query, values);
    res.json({ message: "Book added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `CALL sp_deletebook($1)`;
    
    await pool.query(query, [id]);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Book
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, category, image } = req.body;
    const query = `CALL sp_updatebook($1, $2, $3, $4, $5, $6)`;
    const values = [id, title, author, price, category, image];

    await pool.query(query, values);
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add to Cart
app.post("/cart", async (req, res) => {
  try {
    const { book_id, quantity } = req.body;
    const query = `CALL sp_addtocart($1, $2)`;
    
    await pool.query(query, [book_id, quantity]);
    res.json({ message: "Book added to cart successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
app.get('/cart', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Remove Cart
app.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `CALL sp_removefromcart($1)`;
    
    await pool.query(query, [id]);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Cart 
app.put("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const query = `CALL sp_updatecart($1, $2)`;
    
    await pool.query(query, [id, quantity]);
    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
