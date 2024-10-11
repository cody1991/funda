const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

const houseRouter = require('./router/house');
const userRouter = require('./router/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/house', houseRouter);
app.use('/user', userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
