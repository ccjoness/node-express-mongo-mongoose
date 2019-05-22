const express = require('express');
const {connectDatabase} = require('./database');
const usersController = require('./controllers/users');
const bodyParser = require('body-parser');


const PORT = 3000;
const app = express();

connectDatabase();

app.use(bodyParser.json());

app.use('/users', usersController);



app.get('/', (request, response) => {
    response.send({
        message: 'hello!'
    });
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});