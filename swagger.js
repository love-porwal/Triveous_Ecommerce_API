const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      title: 'Triveous Ecommerce API',
      version: '1.0.0',
      description: 'Ecommerce-API',
    },
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;