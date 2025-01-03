
//Ene heseg tootsoolol hiih ystoi aldaatai baigaa.

document.addEventListener("DOMContentLoaded", function () {
    const articles = document.querySelectorAll(".Bolgoh .a");

    articles.forEach((article) => {
        const basePrice = parseInt(article.getAttribute("data-base-price"), 10); // Үндсэн үнэ
        const counterElement = article.querySelector(".counter");
        const priceElement = article.querySelector(".price-value");
        const decrementButton = article.querySelector(".decrement");
        const incrementButton = article.querySelector(".increment");

        let count = parseInt(counterElement.textContent, 10); // Анхны тоо

        // Нийт үнийг тооцоолох
        function updatePrice() {
            const totalPrice = count * basePrice;
            priceElement.textContent = totalPrice.toFixed(0); // Үнийг шинэчилнэ
        }

        // Тоог хасах
        decrementButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (count > 1) {
                count--;
                counterElement.textContent = count;
                updatePrice();
            }
        });

        // Тоог нэмэх
        incrementButton.addEventListener("click", function (e) {
            e.preventDefault();
            count++;
            counterElement.textContent = count;
            updatePrice();
        });

        // Эхний үнийг тооцоолох
        updatePrice(); // Үнийн эхний тооцоолол

        // Барааг идэвхжүүлэх
        article.addEventListener("click", function () {
            article.classList.toggle("active");
        });
    });
});


//Itwehjvvleh heseg

document.addEventListener("DOMContentLoaded", function () {
    const articles = document.querySelectorAll(".Bolgoh .a");

    articles.forEach((article) => {
        article.addEventListener("click", function () {
            // Дарсан элементэд "active" классыг нэмэх/хасах
            this.classList.toggle("active");
        });
    });
});
