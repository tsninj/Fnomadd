const pool = require("../../db.js");

class CartModel {
// Бүх номыг авах
static async getAllCartItems() {
    const result = await pool.query("SELECT * FROM cart");
    return result.rows;
  }
  
// Ном нэмэх
  static async addToCart(book_id, quantity) {
    await pool.query("CALL sp_addtocart($1, $2)", [book_id, quantity]);
  }

  static async removeFromCart(id) {
    await pool.query("CALL sp_removefromcart($1)", [id]);
  }

  static async updateCartadd(id) {
    await pool.query("CALL sp_updatecart_add($1)", [id]);
    return { message: "Сагсан дахь номын тоо нэмэгдлээ." }; 
  }

  static async updateCartsubs(id) {
    await pool.query("CALL sp_updatecart_sub($1)", [id]);
    return { message: "Сагсан дахь номын тоо хасагдлаа." }; 
  }
}

module.exports = CartModel;
