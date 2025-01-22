const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger'); 

const app = express();
const userRoutes = require("./routes/user.route");


app.use(cors());
app.use(express.json()); // Middleware to read & parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
// Allows parsing of nested objects using the qs library (recommended for complex payloads).

// Middleware for Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/v1/user", userRoutes);

app.get("/", (_, res) => {
   res.send("<h1>Welcome to DevTinder</h1>");
});

// const glob = require('glob');
// const routeFiles = glob.sync('./routes/*.js', { cwd: __dirname });
// console.log(routeFiles); // Should log all files inside the 'routes' folder


module.exports = app;
