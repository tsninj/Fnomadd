//Book-list.js
class BookList extends HTMLElement {
    constructor() {
        super();
        this._books = [];
        this.loadState();
        this.initializeFilters();
    }
    connectedCallback() {
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }
    set books(data) {
        this._books = data;
        this.applyFiltersFromURL();
        this.saveState();
    }

    render(filteredBooks) {
        const booksContainer = document.getElementById("books-container");
        if (!booksContainer) {
            console.error("Books container олдсонгүй!");
            return;
        }

        booksContainer.innerHTML = filteredBooks.map((book) => `
            <article class="contain1" id="book-${book.id}">
                <img src="${book.image}" alt="${book.title}">
                <div>
                    <h1>${book.title}</h1>
                    <h2>${book.author}</h2>
                    <p class="price">${book.price}</p>
                    <button class="add-to-cart" data-id="${book.id}">Сагсанд нэмэх</button>
                </div>
            </article>
        `).join("");

        this.addNavigationEventListeners();
        this.addCartEventListeners();
    }
    // Дарах үйлдэл хийвэл шууд bookin.html очих
    addNavigationEventListeners() {
        document.querySelectorAll(".contain1").forEach((article) => {

            article.addEventListener("click", (event) => {
                // сагс руу хийх үйлдэлд саад болгохгүй 
                if (event.target.classList.contains("add-to-cart")) {
                    event.stopPropagation();
                    return;
                }
                window.location.href = `bookIn.html`;
            });
        });
    }
    /* Сагсанд нэмэх товчлуур буюу номыг id-аар нь олж customevent үүсгэн мэдэгдэл гаргана.
    */
    addCartEventListeners() {
        document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.addEventListener("click", (event) => {
                const bookId = event.target.getAttribute("data-id");
                const selectedBook = this._books.find((book) => book.id == bookId);
                if (selectedBook) {
                    this.dispatchEvent(new CustomEvent("add-to-cart", { detail: selectedBook }));
                    this.showNotification(`"${selectedBook.title}" сагсанд нэмэгдлээ!`);
                }
            });
        });
    }
    /*Номыг шүүхдээ 3 янзаар шүүж харуулах ба search хэсэгтэй хамт шүүнэ.*/
    filter() {
        const searchValue = document.getElementById("search-bar").value.toLowerCase();
        const priceFilter = document.getElementById("price-filter").value;
        // Шүүлтүүр болон хайх үед URL шинэчлэгдэх
        this.updateURL(searchValue, priceFilter);

        const filteredBooks = this._books.filter((book) => {
            const matchesSearch = book.title.toLowerCase().includes(searchValue);
            const matchesPrice =
                priceFilter === "all" ||
                (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 35000) ||
                (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 35000);

            return matchesSearch && matchesPrice;
        });
        // Шүүсэн номын жагсаалтыг дэлгэцэнд харуулах
        this.render(filteredBooks);
    }

    /* Хайлт болон үнийн шүүлтүүрийн event listener-ийг тохируулах */
    initializeFilters() {
        document.getElementById("search-bar").addEventListener("input", () => this.filter());
        document.getElementById("price-filter").addEventListener("change", () => this.filter());
    }

    /* Шүүлтүүрийг URL-д хадгалах ба хуудсыг дахин ачаалахад шүүлтүүр хадгалагдана */
    updateURL(search, price) {
        const url = new URL(window.location);
        if (search) {
            url.searchParams.set("search", search);
        } else {
            url.searchParams.delete("search");
        }

        if (price && price !== "all") {
            url.searchParams.set("price", price);
        } else {
            url.searchParams.delete("price");
        }
        // URL-г шинэчлэх
        window.history.pushState({}, "", url);
    }
    /* URL-д шүүлтүүрийн тохиргоо байвал интерфэйс дээр тохируулах */
    applyFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchValue = urlParams.get("search") || "";
        const priceFilter = urlParams.get("price") || "all";

        document.getElementById("search-bar").value = searchValue;
        document.getElementById("price-filter").value = priceFilter;

        this.filter();
    }
    /*Номыг сагслах үед ямар ном сагсалсан байх төлвийг хадгалах*/
    saveState() {
        try {
            localStorage.setItem("books", JSON.stringify(this._books));
        } catch (error) {
            console.error("Error save state:", error);
        }
    }

    /* LocalStorage-д хадгалагдсан номын жагсаалтыг гаргах */
    loadState() {
        try {
            const savedBooks = localStorage.getItem("books");
            if (savedBooks) {
                this._books = JSON.parse(savedBooks); //объект болгож хөрвүүлэх
                this.applyFiltersFromURL();
            } else {
                this.render([]); // Хадгалсан ном байхгүй бол хоосон жагсаалт харуулах
            }
        } catch (error) {
            console.error("Error load state:", error);
        }
    }
    /*
    Бүтээгдэхүүн нэмэхэд нэмэгдсэн гэх мэдэгдэл гарч ирэх
    */
    showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;

        document.body.appendChild(notification);
        // 2 секундын дараа мэдэгдлийг арилгах
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

customElements.define("book-list", BookList);
