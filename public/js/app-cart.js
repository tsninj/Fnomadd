import '../wc/Cart.js'; 
import '../wc/ThemeToggle.js'; 
import { fetchBooksData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartComponent = document.querySelector('cart-component');
    const themeToggle = document.querySelector('theme-toggle');
    
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.documentElement.classList.add(savedTheme);
    
    const booksData = await fetchBooksData('/api/books');
    cartComponent.books = booksData;

    cartComponent.addEventListener('cart-updated', (e) => {
        console.log('Сагс шинэчлэгдсэн:', e.detail);
    });

    themeToggle.addEventListener('theme-changed', (e) => {
        const newTheme = e.detail;
        document.documentElement.classList.remove('light-mode', 'dark-mode');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
