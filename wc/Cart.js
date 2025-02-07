class CartComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

    render() {
        /*Сагсан дотор бүтээгдэхүүн байхгүй бол нийт үнийг 0 болон сагсан дотор бараа байхгүй байна гэж гаргана.
        */
        if (this.cart.size === 0) {
            this.shadowRoot.innerHTML = `
                <style>
                    .contain { padding: 10px; font-family: Arial, sans-serif; }
                    .empty { color: dark-gray; padding-bottom: 10rem ; padding-left:5rem; margin-top:-3.2rem }
                    .price-button {  display: block; width: 100%;
}
                    .back-button {   display: flex; justify-content: left;  padding-bottom: 2rem; margin-top:-2rem}
                </style>
                <div class="contain">
                    <slot class="back-button" name="cart-header"></slot>
                    <p class="empty">Сагс хоосон байна.</p>
                    <p><span id="total-price"></span></p>
                    <slot class="price-button" name="cart-footer"></slot>
                </div>
            `;
            return;
        }
        /* Сагсан дотор байгаа номуудыг Id-ийн тусламжтайгаар рендерлэнэ.
        */
        let cartHTML = `
        <slot class="back-buttons" name="cart-header"></slot>
        <div class="contain">
    `;
        this.cart.forEach((quantity, id) => {
            const product = this.booksData.find((book) => book.id == id);
            if (product) {
                cartHTML += `
                    <article class="contain1" id="book-${product.id}">
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

        cartHTML += `</div>
        <slot name="cart-footer"></slot>
    `;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
            :host {
                display: block;
                padding: 15px;
                border-radius: 8px;
            /*    background-color: var(--bg-color);*/
                color: var(--text-color);
            }
            :host-context(html.light-mode) {
                --bg-color: #f9f9f9;
                --text-color: #333;
                --cart-color: #FCEDE8;
            }
            :host-context(html.dark-mode) {
                    --bg-color: #1E1E1E;
                    --text-color: #fff;
                    --cart-color: #222;
            }
            ::slotted([slot="cart-header"]) {display: flex; justify-content: left; padding-bottom: 2rem; margin-top:-2rem}
            ::slotted([slot="cart-footer"]) {display: flex; justify-content: center;  padding-bottom: 2rem}

            .contain {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem; margin: 0 2.5rem; margin-bottom: 2rem;
            }
            .contain article {
                background: var(--cart-color); border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center;
                padding: 1rem;  position: relative;  overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
            }
            .contain article img {
                width: 100%;  max-width: 9rem;  height: auto;  margin-bottom: 0.5rem;  border-radius: 5px;  margin-top: 1rem;
            }
            .contain1 {
                border: 2px solid transparent;  transition: border 0.3s;
            }
            .contain1.selected {
                border: 2px solid #007bff;    /* Хөх өнгийн хүрээ */
                background-color: #FCEDE8;    /* Цайвар хөх дэвсгэр */
            }
            .contain1 h1 {
                padding-left: 0.8rem; margin: 0.5rem 0; color: var(--text-color); font-size: 1rem;  text-align: left;
            }
            .contain1 h2 {
                padding-left: 0.8rem;  margin: 0.2rem 0;  color: var(--text-color);
                font-size: 0.9rem; text-align: left; font-weight: lighter;
            }
            .contain1 .price {
                margin-top: -35px; font-size: 1.1rem;  color: var(--text-color);  font-weight: bold;  text-align: right;
            }
                .cart-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
                .quantity-controls button, .remove-item { cursor: pointer; }
                .remove-item { color: red; border: none; background: none; }
            .quantity-controls {  display: flex;  align-items: center; justify-content: center; gap: 10px; padding: 0; margin: 0;}

            .quantity-controls button {  padding: 5px 10px;  font-size: 20px;  border: none;  cursor: pointer;
            }
            .quantity-controls button:hover { background-color: #eaeaea; /* Хулганаар дээр нь байрлахад өнгийг өөрчлөх */ }
            </style>
            ${cartHTML}
        `;
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*Бүтээгдэхүүн нэмэх товчлуур*/
        this.shadowRoot.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                this.addProduct(event.target.dataset.id);
            });
        });

        /*Бүтээгдэхүүн хасах товчлуур*/
        this.shadowRoot.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                this.removeProduct(event.target.dataset.id);
            });
        });

        /*Бүтээгдэүүн устгах товчлуур*/
        this.shadowRoot.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                this.cart.delete(productId);
                this.saveCart();
                this.render();
                this.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart }));
            });
        });
    }

    /* Бүтээгдэхүүн нэмэх товчлуур буюу байгаа тоон дээрээс 1 нэмнэ.
     Уг үйлдэл дууссаны дараа сагсны төлвийг дахин хадгалж рендерлэх процесс явагдана. 
    */
    addProduct(productId) {
        const id = productId.toString();
        const currentQuantity = this.cart.get(id) || 0;
        this.cart.set(id, currentQuantity + 1);

        this.saveCart();
        this.render();
        this.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart }));
    }

    /* Бүтээгдэхүүн хасах товчлуур буюу байгаа тоон дээрээс 1 хасах эсвэл 1 үлдсэнээс бүтээгдэхүүн id 
    устгана. Уг үйлдэл дууссаны дараа сагсны төлвийг дахин хадгалж рендерлэх процесс явагдана. 
    */
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
    /* Сагсан дахь бүх бүтээгдэхүүний үнийг тооцоолохдоо id-аар хайж олж үнийг нь олно. Үүнд үнийг 39,000₮ байдлаар оруулсан тул
    эдгээрийг replace хийж үнийг тооцоолсон.
    */
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
    /*Тооцоолсон үнээ товчлуур дээр харуулахын тулд нийт үнийг бодсон утгаа буцаасан. 
    */
    get totalPrice() {
        return this.calculateTotalPrice();
    }
    /*LocalStorage-аас сагсны бүтээгдэхүүнийг унших*/
    loadCart() {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            this.cart = new Map(savedCart);
        }
        // LocalStorage доторх хадгалсан өгөгдлөө устгах
        // localStorage.removeItem('cart');
        // console.log("Cart cleared!");
    }
    /*Сагсан дахь номны төлвийг хадгална. хэрэв сагсанд ном байхгүй бол устгах*/
    saveCart() {
        if (this.cart.size === 0) {
            localStorage.removeItem('cart');
        } else {
            localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
        }
    }
}

customElements.define('cart-component', CartComponent);
