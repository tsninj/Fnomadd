export default class Book {
    constructor(id, title, author, price, category, image) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
        this.category = category;
        this.image = image;
    }

    render() {
        return `
            <article class="cakes1" id="book-${this.id}">
                <img src="${this.image}" alt="${this.title}">
                <div>
                    <h1>${this.title}</h1>
                    <h2>${this.author}</h2>
                    <p class="price">${this.price}</p>
                    <button class="add-to-cart" data-id="${this.id}">Сагсанд нэмэх</button>
                </div>
            </article>
        `;
    }
}
