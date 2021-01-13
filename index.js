if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('./utils/validator');

const productsRoutes = require('./routes/products.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/products', productsRoutes);
app.use('/users', usersRoutes);

app.listen(process.env.PORT, () => {
  console.log('server on port', process.env.PORT);
});
