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
                    .cakes { padding: 10px; font-family: Arial, sans-serif; }
                    .empty { color: dark-gray; padding-bottom: 15rem ; padding-left:2rem}
                </style>
                <div class="cakes">
                    <p class="empty">Сагс хоосон байна.</p>
                    <p><span id="total-price"></span></p>
                </div>
            `;
            return;
        }
        /* Сагсан дотор байгаа номуудыг Id-ийн тусламжтайгаар рендерлэнэ.
        */
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

        this.shadowRoot.innerHTML = `
            <style>
            .cakes {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem; margin: 0 2.5rem; margin-bottom: 2rem;
            }
            .cakes article {
                background: #FCEDE8; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center;
                padding: 1rem;  position: relative;  overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
            }
            .cakes article img {
                width: 100%;  max-width: 9rem;  height: auto;  margin-bottom: 0.5rem;  border-radius: 5px;  margin-top: 1rem;
            }
            .cakes1 {
                border: 2px solid transparent;  transition: border 0.3s;
            }
            .cakes1.selected {
                border: 2px solid #007bff;    /* Хөх өнгийн хүрээ */
                background-color: #FCEDE8;    /* Цайвар хөх дэвсгэр */
            }
            .cakes1 h1 {
                padding-left: 0.8rem; margin: 0.5rem 0; color: var(--fourth-text-color); font-size: 1rem;  text-align: left;
            }
            .cakes1 h2 {
                padding-left: 0.8rem;  margin: 0.2rem 0;  color: var(--secondary-text-color);
                font-size: 0.9rem; text-align: left; font-weight: lighter;
            }
            .cakes1 .price {
                margin-top: -35px; font-size: 1.1rem;  color: var(--header-color);  font-weight: bold;  text-align: right;
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
