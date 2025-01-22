const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'DevTinder API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1', // Base URL for your API
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs, not the relative paths, need direct path
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpecs;
