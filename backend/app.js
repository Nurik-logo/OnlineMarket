const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const usersRoutes = require('./routes/users');
const countriesRoutes = require('./routes/countries');
const regionsRoutes = require('./routes/regions');
const balanceRoutes = require('./routes/balances');
const creditCardRoutes = require('./routes/creditcards');
const storesRouter = require('./routes/stores');
const productsRouter = require('./routes/products');
const cartRoutes = require('./routes/cart');
const storeCategoriesRoutes = require('./routes/storeCategories');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/countries', countriesRoutes);
app.use('/regions', regionsRoutes);
app.use('/balances', balanceRoutes);
app.use('/creditcards', creditCardRoutes);
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRoutes);
app.use('/store-categories', storeCategoriesRoutes);
app.use('/transactions', transactionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
