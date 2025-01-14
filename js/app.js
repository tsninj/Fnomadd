import Book from "./Book.js";
import Cart from "./cart.js";
import { fetchBooksData } from "./data.js";

const booksContainer = document.getElementById("books-container");
const cartCountContainer = document.getElementById("cart-count");
const totalPriceContainer = document.getElementById("total-price");

const cart = new Cart();

const saveCartState = () => {
    localStorage.setItem("cart", JSON.stringify([...cart.cart.entries()]));
};

const loadCartState = (booksData) => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart.cart = new Map(JSON.parse(savedCart));
    }
    updateCartCount();
    if (booksData) calculateTotalPrice(booksData);
};

const updateCartCount = () => {
    if (!cartCountContainer) {
        console.warn("Cart count container is missing from the DOM.");
        return;
    }
    const totalItems = Array.from(cart.cart.values()).reduce((sum, qty) => sum + qty, 0);
    cartCountContainer.textContent = totalItems;
};

const calculateTotalPrice = (booksData) => {
    if (!totalPriceContainer) {
        console.warn("Total price container is missing from the DOM.");
        return;
    }
    let total = 0;
    cart.cart.forEach((quantity, bookId) => {
        const book = booksData.find((b) => b.id === bookId);
        if (book) {
            const price = parseInt(book.price.replace(",", ""));
            total += price * quantity;
        }
    });
    return total;
};

const renderBooks = (books) => {
    booksContainer.innerHTML = "";
    books.forEach((book) => {
        const bookItem = new Book(
            book.id,
            book.title,
            book.author,
            book.price,
            book.category,
            book.image
        );
        booksContainer.innerHTML += bookItem.render();
    });
};

const filterBooks = (booksData) => {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const priceFilter = document.getElementById("price-filter").value;

    updateURL(searchValue, priceFilter);

    const filteredBooks = booksData.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchValue);
        const matchesPrice =
            priceFilter === "all" ||
            (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 35000) ||
            (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 35000);

        return matchesSearch && matchesPrice;
    });

    renderBooks(filteredBooks);
};

const initializeFilters = (booksData) => {
    document.getElementById("search-bar").addEventListener("input", () => filterBooks(booksData));
    document.getElementById("price-filter").addEventListener("change", () => filterBooks(booksData));
};

const updateURL = (search, price) => {
    const url = new URL(window.location);
    if (search) {
        url.searchParams.set("search", search);
    } else {
        url.searchParams.delete("search");
    }

    if (price && price !== "all") {
        url.searchParams.set("price", price);
    } else {
        url.searchParams.delete("price");
    }

    window.history.pushState({}, "", url);
};

const applyFiltersFromURL = (booksData) => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get("search") || "";
    const priceFilter = urlParams.get("price") || "all";

    document.getElementById("search-bar").value = searchValue;
    document.getElementById("price-filter").value = priceFilter;

    const filteredBooks = booksData.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchValue.toLowerCase());
        const matchesPrice =
            priceFilter === "all" ||
            (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 35000) ||
            (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 35000);

        return matchesSearch && matchesPrice;
    });

    renderBooks(filteredBooks);
};

const setupAddToCartButtons = (booksData) => {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            cart.addProduct(booksData[index].id);
            saveCartState(); 
            updateCartCount(); 
            calculateTotalPrice(booksData); 
            showNotification("Бүтээгдэхүүн сагсанд нэмэгдлээ!"); 
        });
    });
};

const initializeApp = async () => {
    try {
        const booksData = await fetchBooksData("../json/Publishing.json");

        renderBooks(booksData);  
        applyFiltersFromURL(booksData); 
        initializeFilters(booksData); 
        setupAddToCartButtons(booksData); 
        loadCartState(booksData); 
    } catch (error) {
        console.error("Error initializing app:", error);
    }
};

const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});
