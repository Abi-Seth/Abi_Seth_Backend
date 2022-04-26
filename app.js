const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT || 5400;

require('./models/database.js');

app.use(cors());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

const { articleRouter } = require('./routes/articles.routes');
const { adminRouter } = require('./routes/admin.routes');
const { messageRouter } = require('./routes/messages.routes');
const { projectRouter } = require('./routes/projects.routes');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use("/public", express.static("public"));

app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/projects', projectRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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