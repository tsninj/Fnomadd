class Book {
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
                  <button class="add-to-cart">Сагсанд нэмэх</button>
              </div>
          </article>
      `;
  }
}

// Fetch JSON
const booksContainer = document.getElementById("books-container");

const fetchBooksData = async () => {
  try {
    const response = await fetch("../json/Publishing.json");
    if (!response.ok) {
      throw new Error(`Books data oldsongui ${response.statusText}`);
    }
    const booksData = await response.json();
    renderBooks(booksData);
    initFilters(booksData);
    applyFilterURL(booksData);

  } catch (error) {
    console.error(error);
  }
};

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
};

// Uneer Filter hiih ni
const initFilters = (booksData) => {
  const filterBooks = () => {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const priceFilter = document.getElementById("price-filter").value;

    const filteredBooks = booksData.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchValue);
      const matchesPrice = (priceFilter === "all") ||
        (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 35000) ||
        (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 35000);

      return matchesSearch && matchesPrice;
    });
    updateURL(searchValue, priceFilter);
    renderBooks(filteredBooks);
  };

  document.getElementById("search-bar").addEventListener("input", filterBooks);
  document.getElementById("price-filter").addEventListener("change", filterBooks);
};
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

fetchBooksData();
