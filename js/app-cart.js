//app-cart.js
import '../wc/Cart.js';
import { fetchBooksData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartComponent = document.querySelector('cart-component');
    const booksData = await fetchBooksData('https://api.jsonbin.io/v3/b/6778065de41b4d34e46f656c');
    
    cartComponent.books = booksData;

    cartComponent.addEventListener('cart-updated', (e) => {
        console.log('Сагс шинэчлэгдсэн:', e.detail);
    });
});