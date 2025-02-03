class BookList extends HTMLElement { 
  constructor() {
      super();
      this._books = [];
      this.loadState();  
      this.initializeFilters();  
  }

  set books(data) {
      this._books = data;
      this.applyFiltersFromURL();  
      this.saveState();  
  }

  renderBooks(filteredBooks) {
      const booksContainer = document.getElementById("books-container");
      if (!booksContainer) {
          console.error("Error: #books-container element not found!");
          return;
      }

      booksContainer.innerHTML = filteredBooks.map((book) => {
          return `
              <article class="cakes1" id="book-${book.id}">
                  <img src="${book.image}" alt="${book.title}">
                  <div>
                      <h1>${book.title}</h1>
                      <h2>${book.author}</h2>
                      <p class="price">${book.price}</p>
                      <button class="add-to-cart" data-id="${book.id}">Сагсанд нэмэх</button>
                  </div>
              </article>
          `;
      }).join("");

      booksContainer.querySelectorAll(".add-to-cart").forEach((button) => {
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

  filterBooks() {
      const searchValue = document.getElementById("search-bar").value.toLowerCase();
      const priceFilter = document.getElementById("price-filter").value;

      this.updateURL(searchValue, priceFilter);

      const filteredBooks = this._books.filter((book) => {
          const matchesSearch = book.title.toLowerCase().includes(searchValue);
          const matchesPrice =
              priceFilter === "all" ||
              (priceFilter === "low" && parseInt(book.price.replace(",", "")) <= 35000) ||
              (priceFilter === "high" && parseInt(book.price.replace(",", "")) > 35000);

          return matchesSearch && matchesPrice;
      });

      this.renderBooks(filteredBooks);
  }

  initializeFilters() {
      document.getElementById("search-bar").addEventListener("input", () => this.filterBooks());
      document.getElementById("price-filter").addEventListener("change", () => this.filterBooks());
  }

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

      window.history.pushState({}, "", url);
  }

  applyFiltersFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const searchValue = urlParams.get("search") || "";
      const priceFilter = urlParams.get("price") || "all";

      document.getElementById("search-bar").value = searchValue;
      document.getElementById("price-filter").value = priceFilter;

      this.filterBooks();
  }

  saveState() {
      try {
          localStorage.setItem("books", JSON.stringify(this._books));
      } catch (error) {
          console.error("Error saving state:", error);
      }
  }

  loadState() {
      try {
          const savedBooks = localStorage.getItem("books");
          if (savedBooks) {
              this._books = JSON.parse(savedBooks);
              this.applyFiltersFromURL();
          } else {
              this.renderBooks([]);  
          }
      } catch (error) {
          console.error("Error loading state:", error);
      }
  }

  showNotification(message) {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = message;

      document.body.appendChild(notification);

      setTimeout(() => {
          notification.remove();
      }, 3000);
  }
}

customElements.define("book-list", BookList);
