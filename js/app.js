import '../wc/Cart.js';
import '../wc/Booklist.js';
import { fetchBooksData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartComponent = document.querySelector('cart-component');
    const bookListComponent = document.querySelector('book-list');

    const booksData = await fetchBooksData('https://api.jsonbin.io/v3/b/6778065de41b4d34e46f656c');

    bookListComponent.books = booksData;
    cartComponent.books = booksData;

    bookListComponent.addEventListener('add-to-cart', (e) => {
        cartComponent.addProduct(e.detail.id);
    });

    cartComponent.addEventListener('cart-updated', (e) => {
        console.log('Сагс шинэчлэгдсэн:', e.detail);
    });
    
});

