const express = require('express');
const app = express();

const PORT = 5400;

require('./models/database.js');

app.use('/', (req, res) => {
    return res.status(200).send({
        success: true,
        status: 200,
        message: 'Welcome to Abi-Seth personal portfolio.'
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
})