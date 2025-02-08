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

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
   event.preventDefault();
  deferredPrompt = event;

   const installButton = document.getElementById("installPWA");
  installButton.style.display = "block"; 

  installButton.addEventListener("click", () => {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User installed the PWA");
      } else {
        console.log("User dismissed the installation prompt");
      }
      deferredPrompt = null; 
    });
  });
});

