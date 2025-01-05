class Book {
    constructor(id, title, author, price, category, image) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.price = price;
      this.category = category;
      this.image = image;
      this.quantity = 1;
    }
  
    render() {
      return `
        <article class="cakes1" id="book-${this.id}">
          <img src="${this.image}" alt="${this.title}">
          <div>
            <h1>${this.title}</h1>
            <h2>${this.author}</h2>
            <p class="price">${this.price}</p>
            <div class="quantity-control">
              <button class="decrease" data-id="${this.id}">-</button>
              <span class="quantity" id="quantity-${this.id}">${this.quantity}</span>
              <button class="increase" data-id="${this.id}">+</button>
            </div>
          </div>
        </article>
      `;
    }
  }
  
  const booksData = [
    { id: 1, title: "Анна", author: "Эми Одел", price: "39,900₮", category: "biography", image: "../images/Publishing/anna.png" },
    { id: 2, title: "Аналог эргэн ирсэн нь", author: "Жаред Даймонд", price: "39,900₮", category: "history", image: "../images/Publishing/analog.png" },
    { id: 3, title: "Үүсгэн байгуулагчид", author: "Жимми Сонни", price: "39,900₮", category: "business", image: "../images/Publishing/biznes.png" },
    { id: 4, title: "Цаг төлөвлөгч дэвтэр", author: "Кел Ньюпорт", price: "34,900₮", category: "self-help", image: "../images/Publishing/timeplanner.png" },
    { id: 5, title: "Бүтээ", author: "Тони Фаделл", price: "49,900₮", category: "business", image: "../images/Publishing/butee.png" },
    { id: 6, title: "Headspace", author: "Энди Паддиком", price: "29,900₮", category: "self-help", image: "../images/Publishing/headspace.png" },
    { id: 7, title: "Launch", author: "Ховард Шульц", price: "29,900₮", category: "business", image: "../images/Publishing/launch.png" },
    { id: 8, title: "Бизнесийг энгийнээр", author: "Доналд Миллер", price: "29,900₮", category: "business", image: "../images/Publishing/biznes.png" },
    { id: 9, title: "Патагониа", author: "Ивон Шүйнард", price: "49,900₮", category: "biography", image: "../images/Publishing/screen1.png" },
    { id: 10, title: "Стори Бренд Бүтээх нь", author: "Доналд Миллер", price: "29,900₮", category: "business", image: "../images/Publishing/storybrand.png" },
    { id: 11, title: "Буу Нян Ган", author: "Жаред Даймонд", price: "49,900₮", category: "history", image: "../images/Publishing/BuuNyanGan.png" },
    { id: 12, title: "Урагшаа", author: "Ховард Шульц", price: "39,900₮", category: "biography", image: "../images/Publishing/uragshaa.png" }
  ];
  
  const booksContainer = document.getElementById("books-container");

  
  const renderBooks = (books) => {
    booksContainer.innerHTML = "";
    books.forEach(bookData => {
      const book = new Book(
        bookData.id,
        bookData.title,
        bookData.author,
        bookData.price,
        bookData.category,
        bookData.image
      );
      booksContainer.innerHTML += book.render();
    });
    addEventListeners();
  };

 // "+" болон "-" товчлууруудын үйлдлийг нэмэх
booksContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("increase")) {
    const id = target.getAttribute("data-id");
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
  }

  if (target.classList.contains("decrease")) {
    const id = target.getAttribute("data-id");
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
      quantity--;
      quantityElement.textContent = quantity;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const articles = document.querySelectorAll(".cakes1");

  articles.forEach((article) => {
      article.addEventListener("click", function (event) {
          // Хэрэв товчлуур дарагдсан бол сонголт идэвхжүүлэхгүй
          if (event.target.classList.contains("increase") || event.target.classList.contains("decrease")) {
              return;
          }
          // Дарсан элементэд "selected" классыг нэмэх/хасах
          this.classList.toggle("selected");
      });
  });
});

  // URL shinechleh
  const updateURL = (search, price) => {
    const url = new URL(window.location);
    if (search)
      url.searchParams.set("search", search);
    else
      url.searchParams.delete("search");
  
    if (price && price !== "all")
      url.searchParams.set("price", price);
    else
      url.searchParams.delete("price");
  
    window.history.pushState({}, "", url);
  };
  
  //URL aas page iig ajilluulah
  const applyFiltersURL = (booksData) => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get("search") || "";
    const priceFilter = urlParams.get("price") || "all";
  
    document.getElementById("search-bar").value = searchValue;
    document.getElementById("price-filter").value = priceFilter;
  
    const filteredBooks = booksData.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchValue.toLowerCase());
      const matchesPrice = (priceFilter === "all") ||
        (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 40000) ||
        (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 40000);
  
      return matchesSearch && matchesPrice;
    });
  
    renderBooks(filteredBooks);
  };
  
  // fetchBooksData();
  renderBooks(booksData);
  initFilters(booksData);
  applyFiltersURL(booksData);
