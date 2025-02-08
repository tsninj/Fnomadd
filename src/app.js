const express = require("express");
const path = require("path");
const bookRoutes = require("./routes/BookRoute.js");
const cartRoutes = require("./routes/CartRoute.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/Publishing.html"));
});

module.exports = app;
