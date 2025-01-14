export default class Cart {
    constructor() {
        this.cart = new Map();
    }

    render(booksData) {
        if (this.cart.size === 0) {
            return "<p>Сагс хоосон байна.</p>";
        }
        let cartHTML = "";
        this.cart.forEach((quantity, id) => {
            const product = booksData.find((book) => book.id === id);
            if (product) {
                cartHTML += `
                    <article class="cakes1" id="book-${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                        <div>
                            <h1>${product.title}</h1>
                            <h2>${product.author}</h2>
                            <p class="price">${product.price}</p>
                            <p>${quantity}</p>
                            <button class="decrease" data-id="${this.id}">-</button>
                            <span class="quantity" id="quantity-${this.id}">${quantity}</span>
                            <button class="increase" data-id="${this.id}">+</button>
                         </div>
                    </article>
                `;
            }
        });
        return cartHTML;
    }

    addProduct(productId) {
        if (this.cart.has(productId)) {
            this.cart.set(productId, this.cart.get(productId) + 1);
        } else {
            this.cart.set(productId, 1);
        }
    }

    calculateTotalPrice(booksData) {
        let totalPrice = 0;
        this.cart.forEach((quantity, id) => {
            const product = booksData.find((book) => book.id === id);
            if (product) {
                totalPrice += parseInt(product.price.replace(/,|₮/g, ""))* quantity;
            }
        });
        return totalPrice;
    }
}