const express = require("express");
const cors = require("cors");

const app = express();
const userRoutes = require("./routes/user.route");


app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
// Allows parsing of nested objects using the qs library (recommended for complex payloads).

app.use("/api/v1/user", userRoutes);

app.get("/", (_, res) => {
   res.send("<h1>Welcome to DevTinder</h1>");
});

module.exports = app;
