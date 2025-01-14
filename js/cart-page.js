import Cart from "./cart.js";
import { fetchBooksData } from "./data.js";

const cartContainer = document.getElementById("books-container");
const totalPriceElement = document.getElementById("total-price");  // Fix: define totalPriceElement
const cart = new Cart();

const loadCartState = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart.cart = new Map(JSON.parse(savedCart));
    }
};

const saveCartState = () => {
    localStorage.setItem("cart", JSON.stringify([...cart.cart]));
};

const initializeCartPage = async () => {
    try {
        const booksData = await fetchBooksData("../json/Publishing.json");
        cartContainer.innerHTML = cart.render(booksData);  // Ensure this method exists in the Cart class
        displayTotalPrice(booksData);
    } catch (error) {
        console.error("Error loading books data", error);
    }
};

const displayTotalPrice = (booksData) => {
    const totalPrice = cart.calculateTotalPrice(booksData);  // Ensure this method exists in the Cart class
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}₮`;
};

// Event listener for cart interactions
cartContainer.addEventListener("click", (event) => {
    const { target } = event;
    const id = parseInt(target.dataset.id, 10);
    if (target.classList.contains("increase")) {
        cart.addProduct(id);
    } else if (target.classList.contains("decrease")) {
        if (cart.cart.get(id) > 1) {
            cart.cart.set(id, cart.cart.get(id) - 1);
        } else {
            cart.cart.delete(id);
        }
    }
    saveCartState();  // Save updated cart state to localStorage
    initializeCartPage();  // Re-render the cart page
});

// Initialize the cart state and page
loadCartState();
initializeCartPage();
