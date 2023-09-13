const express = require("express");
const swaggerUi = require("swagger-ui-express");
// const session = require("express-session")
const { userRouter } = require("./routes/user.route");
const { connection,client } = require("./config/db");
const { ProductRouter } = require("./routes/product.route");
const { CartRouter } = require("./routes/cart.route");
const { OrderRouter } = require("./routes/order.route");
const cors = require("cors")
const app = express();
app.use(cors())
const specs = require("./swagger");
require("dotenv").config();

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", ProductRouter);
app.use("/cart", CartRouter);
app.use("/orders", OrderRouter);

app.get("/", (req, res) => {
  res.send("Triveous Ecommerce API");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    await client.connect();
    console.log(`server is running at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});