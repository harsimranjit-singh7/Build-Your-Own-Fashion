require("dotenv").config();
const express = require("express");
const app = express();
const port = 5400;
const cors = require("cors");
const conn = require("./db");
const session = require("express-session");
const sessionChecker = require("./middleware.js/sessionChecker");
const cloudinary = require('cloudinary').v2;
const store = new session.MemoryStore();

const JWT_SECRET = process.env.EXPRESS_JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'example_secret_1563256',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // This will only work if you have https enabled!
    maxAge: 3 * 24 * 60 * 60000, // 72 hours
  },
  store
}));

cloudinary.config({
  cloud_name: 'dxahez5ol',
  api_key: '541167151198456',
  api_secret: 'nhBeKp8Z7iV4siOCzRIbiMjQ4qE',
});

app.get('/', sessionChecker ,async (req, res) => {
  console.log(store)
  console.log(JWT_SECRET);
  res.send('Hello World!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/order', require('./routes/order'));


/*admin apis */
app.use('/api/admin/order', require('./routes/admin/order'));
app.use('/api/admin/user', require('./routes/admin/user'));
app.use('/api/admin/product', require('./routes/admin/product'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})