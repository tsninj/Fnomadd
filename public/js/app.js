//app-cart.js
import '../wc/Cart.js';
import '../wc/Booklist.js';
import { fetchBooksData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartComponent = document.querySelector('cart-component');
    const bookListComponent = document.querySelector('book-list');

    const booksData = await fetchBooksData("/api/books");

    bookListComponent.books = booksData;
    cartComponent.books = booksData;

    bookListComponent.addEventListener('add-to-cart', (e) => {
        console.log('🛒 Add to Cart Event:', e.detail);
        cartComponent.addProduct(e.detail.id);
    });
    

    cartComponent.addEventListener('cart-updated', (e) => {
        console.log('Сагс шинэчлэгдсэн:', e.detail);
    });
    
});

