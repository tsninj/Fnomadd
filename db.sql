CREATE TABLE Books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255)
);

CREATE TABLE Cart(
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES Books(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0)
);
drop table books

INSERT INTO books (title, author, price, category, image) VALUES
('Анна', 'Эми Одел', '39,900₮', 'biography', '../images/Publishing/anna.png'),
('Аналог эргэн ирсэн нь', 'Жаред Даймонд', '39,900₮', 'history', '../images/Publishing/analog.png'),
('Үүсгэн байгуулагчид', 'Жимми Сонни', '39,900₮', 'business', '../images/Publishing/biznes.png'),
('Цаг төлөвлөгч дэвтэр', 'Кел Ньюпорт', '34,900₮', 'self-help', '../images/Publishing/timeplanner.png'),
('Бүтээ', 'Тони Фаделл', '49,900₮', 'business', '../images/Publishing/butee.png'),
('Headspace', 'Энди Паддиком', '29,900₮', 'self-help', '../images/Publishing/headspace.png'),
('Launch', 'Ховард Шульц', '29,900₮', 'business', '../images/Publishing/launch.png'),
('Бизнесийг энгийнээр', 'Доналд Миллер', '29,900₮', 'business', '../images/Publishing/biznes.png'),
('Патагониа', 'Ивон Шүйнард', '49,900₮', 'biography', '../images/Publishing/screen1.png'),
('Стори Бренд Бүтээх нь', 'Доналд Миллер', '29,900₮', 'business', '../images/Publishing/storybrand.png'),
('Буу Нян Ган', 'Жаред Даймонд', '49,900₮', 'history', '../images/Publishing/BuuNyanGan.png'),
('Урагшаа', 'Ховард Шульц', '39,900₮', 'biography', '../images/Publishing/uragshaa.png');

--------------------- Add Book Procedure ---------------------
CREATE OR REPLACE PROCEDURE sp_addbook(
    sp_title VARCHAR(255),
    sp_author VARCHAR(255),
    sp_price VARCHAR(255),
    sp_category VARCHAR(255),
    sp_image VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Books (title, author, price, category, image)
    VALUES (sp_title, sp_author, sp_price, sp_category, sp_image);
END;
$$;

CALL sp_addbook('АннаЭлса', 'Нацагдорж', '49,900₮', 'history', '../images/Publishing/anna.png');

--------------------- Delete Book Procedure ---------------------
CREATE OR REPLACE PROCEDURE sp_deletebook(sp_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Books WHERE id = sp_id;
END;
$$;

CALL sp_deletebook(13);
select * from books
--------------------- Update Book Procedure ---------------------
CREATE OR REPLACE PROCEDURE sp_updatebook(
    sp_id INT,
    sp_title VARCHAR(255),
    sp_author VARCHAR(255),
    sp_price NUMERIC(10,2),
    sp_category VARCHAR(50),
    sp_image VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Books
    SET title = sp_title, author = sp_author,
        price = sp_price, category = sp_category, image = sp_image
    WHERE id = sp_id;
END;
$$;

CALL sp_updatebook(14, 'Анна (Шинэ хувилбар)', 'Эми Одел', '35,900₮', 'biography', '../images/Publishing/anna_updated.png');

------------------- Add to Cart Procedure -------------------
CREATE OR REPLACE PROCEDURE sp_addtocart(sp_book_id INT, sp_quantity INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF sp_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than zero';
    END IF;

    IF EXISTS (SELECT 1 FROM Cart WHERE book_id = sp_book_id) THEN
        UPDATE Cart SET quantity = quantity + sp_quantity WHERE book_id = sp_book_id;
    ELSE
        INSERT INTO Cart (book_id, quantity) VALUES (sp_book_id, sp_quantity);
    END IF;
END;
$$;

CALL sp_addtocart(1, 2); 
select * from cart
------------------- Remove from Cart Procedure -------------------
CREATE OR REPLACE PROCEDURE sp_removefromcart(sp_cartid INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Cart WHERE id = sp_cartid;
END;
$$;

CALL sp_removefromcart(1); 

------------------- Update Cart Quantity Procedure -------------------
CREATE OR REPLACE PROCEDURE sp_updatecart_add(sp_bookid INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Cart SET quantity = quantity+1 WHERE book_id = sp_bookid;
END;
$$;
select * from cart
CALL sp_updatecart_add(1); 

CREATE OR REPLACE PROCEDURE sp_updatecart_sub(sp_bookid INT)
LANGUAGE plpgsql
AS $$
DECLARE
    book_quantity INT;
BEGIN
    SELECT quantity INTO book_quantity FROM Cart WHERE book_id = sp_bookid;
    IF NOT FOUND THEN
        RAISE NOTICE 'Book not found in the cart.';
        RETURN;
    END IF;
    IF book_quantity = 1 THEN
        DELETE FROM Cart WHERE book_id = sp_bookid;
    ELSE
        UPDATE Cart SET quantity = quantity - 1 WHERE book_id = sp_bookid;
    END IF;
END;
$$;


CALL sp_updatecart_sub(1); 

