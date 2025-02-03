class CartComponent extends HTMLElement {
    constructor() {
        super();
        this.cart = new Map();
        this.booksData = [];
        this.loadCart();
    }

    set books(data) {
        this.booksData = data;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    saveCart() {
        if (this.cart.size === 0) {
            localStorage.removeItem('cart'); 
        } else {
            localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
        }
    }

    loadCart() {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            this.cart = new Map(savedCart);
        }
    }

    addProduct(productId) {
        const id = productId.toString();
        const currentQuantity = this.cart.get(id) || 0;
        this.cart.set(id, currentQuantity + 1);

        this.saveCart();
        this.render();
        this.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart }));
    }

    removeProduct(productId) {
        const id = productId.toString();
        if (this.cart.has(id)) {
            const newQuantity = this.cart.get(id) - 1;
            if (newQuantity <= 0) {
                this.cart.delete(id);  
            } else {
                this.cart.set(id, newQuantity);
            }
            this.saveCart();
            this.render();
            this.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart }));
        }
    }

    calculateTotalPrice() {
        let totalPrice = 0;
        this.cart.forEach((quantity, id) => {
            const product = this.booksData.find((book) => book.id == id);
            if (product) {
                totalPrice += parseInt(product.price.replace(/,|₮/g, "")) * quantity;
            }
        });
        return totalPrice;
    }

    get totalPrice() {
        return this.calculateTotalPrice();
    }

    render() {
        if (this.cart.size === 0) {
            this.innerHTML = "<p>Сагс хоосон байна.</p>";
            document.getElementById('total-price').textContent = "0₮";  
            return;
        }

        let cartHTML = '<div class="cakes">'; 
        this.cart.forEach((quantity, id) => {
            const product = this.booksData.find((book) => book.id == id);
            if (product) {
                cartHTML += `
                    <article class="cakes1" id="book-${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                        <div>
                            <h1>${product.title}</h1>
                            <h2>${product.author}</h2>
                            <p class="price">${product.price}</p>
                            <div class="quantity-controls">
                                <button class="decrease" data-id="${product.id}">-</button>
                                <span class="quantity">${quantity}</span>
                                <button class="increase" data-id="${product.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${product.id}">X</button>
                        </div>
                    </article>
                `;
            }
        });

        document.getElementById('total-price').textContent = `${this.totalPrice.toLocaleString()}₮`;

        cartHTML += '</div>'; 
        this.innerHTML = cartHTML;

         this.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                this.addProduct(event.target.dataset.id);
            });
        });

        this.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                this.removeProduct(event.target.dataset.id);
            });
        });

 
        this.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                this.cart.delete(productId);  
                this.saveCart();  
                this.render();  
                this.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart })); // Notify other components
            });
        });
        
    }
}

customElements.define('cart-component', CartComponent);
