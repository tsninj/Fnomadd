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

    render() {
        /*Сагсан дотор бүтээгдэхүүн байхгүй бол нийт үнийг 0 болон сагсан дотор бараа байхгүй байна гэж гаргана.
        */
        if (this.cart.size === 0) {
            this.innerHTML = "<p>Сагс хоосон байна.</p>";
            document.getElementById('total-price').textContent = "0₮";
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
        this.innerHTML = cartHTML;

        /*Бүтээгдэхүүн нэмэх товчлуур*/
        this.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                this.addProduct(event.target.dataset.id);
            });
        });

        /*Бүтээгдэхүүн хасах товчлуур*/
        this.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                this.removeProduct(event.target.dataset.id);
            });
        });

        /*Бүтээгдэүүн устгах товчлуур*/
        this.querySelectorAll('.remove-item').forEach(button => {
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
