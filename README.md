# Triveous_Ecommerce_API

E-commerce backend API for Triveous, covering user authentication, product management, cart, and order processing.

## Table of Contents
- [Introduction](#introduction)
- [Project Demo](#project-demo)
- [Features](#Features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Routes](#routes)
- [API Documentation](#api-documentation)

## Introduction
Triveous is a dynamic and innovative tech company known for its cutting-edge solutions and commitment to excellence in software development.
They are dedicated to pushing the boundaries of technology to deliver impactful solutions to their clients.

## Project Demo

  
## Features

- User registration and JWT authentication for login.
- Product management, including the ability to add, retrieve, and search products by category.
- Cart management, allowing users to add, remove, and update product quantities in their cart.
- Order processing for placing orders and accessing order history.
  
## Tech Stack

- **Node.js**: A JavaScript runtime for server-side development.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing data.
- **JWT**: JSON Web Tokens for authentication.
- **Swagger**: API documentation tool.
- **Other Dependencies**: Various Node.js libraries and modules.


## Getting Started

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/love-porwal/Triveous_Ecommerce_API.git
   ```
   
2. Navigate to the project directory:
   ```
   cd Triveous_Ecommerce_API
   npm init -y
   ```
   
3. Install dependencies:
   ```
   npm install express mongoose bcrypt jsonwebtoken swagger-jsdoc swagger-ui-express nodemon
   ```

4. Application Start
   ```
   node index.js
   ```


## Usage
### Authentication
To use protected routes, you must authenticate by obtaining a JWT token. Use the /users/login route to log in and get the token.


## Routes
### User Routes
```
User Registration: POST /users/register
User Login: POST /users/login
```
### Product Routes
```
Add a Product: POST /products/addproduct
Get Product Categories: GET /products/category
Get Products: GET /products/products
Get Product by ID: GET /products/products/{id}
```
### Cart Routes
```
Add to Cart: POST /cart/addtocart/{productId}
Remove from Cart: DELETE /cart/removetocart/{productId}
Get Cart Contents: GET /cart/allcart
Increase Product Quantity in Cart: POST /cart/increment/{productId}
Decrease Product Quantity in Cart: POST /cart/decrement/{productId}
```

### Order Routes
```
Place an Order: POST /orders/order-place
Get Order Details: GET /orders/order-details
Get Order by ID: GET /orders/order/{orderId}
```
## API Documentation

### User-swagger
![user](https://github.com/love-porwal/Triveous_Ecommerce_API/assets/112820391/2e1a6735-3558-48e6-b6a0-f0843b80cd46)

### Products-swagger
![product](https://github.com/love-porwal/Triveous_Ecommerce_API/assets/112820391/8b6dece8-71ed-4cf5-a2b1-0fd13a3c5d6f)

### Cart-swagger
![cart data](https://github.com/love-porwal/Triveous_Ecommerce_API/assets/112820391/67140e48-7407-4434-bdef-de20faea19ab)

### order-swagger
![order](https://github.com/love-porwal/Triveous_Ecommerce_API/assets/112820391/f487cd01-eb9a-4b23-a224-57c0451b332d)
