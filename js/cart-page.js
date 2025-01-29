import Cart from "./cart.js";
import { fetchBooksData } from "./data.js";

const cartContainer = document.getElementById("books-container");
const totalPriceElement = document.getElementById("total-price");  
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
        const booksData = await fetchBooksData("https://api.jsonbin.io/v3/b/6778065de41b4d34e46f656c");
        cartContainer.innerHTML = cart.render(booksData); 
        displayTotalPrice(booksData);
    } catch (error) {
        console.error("Error loading books data", error);
    }
};


const displayTotalPrice = (booksData) => {
    const totalPrice = cart.calculateTotalPrice(booksData);  
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}₮`;
};

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
    saveCartState();  
    initializeCartPage();  
});

loadCartState();
initializeCartPage();
