const express = require("express");
const { getAllCartItems, addToCart, removeFromCart, updateCartadd, updateCartsubs } = require("../controllers/CartController.js");

const router = express.Router();

router.get("/", getAllCartItems);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.put("/increase/:id", updateCartadd);
router.put("/decrease/:id", updateCartsubs);

module.exports = router;
