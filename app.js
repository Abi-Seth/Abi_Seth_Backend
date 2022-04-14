const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5400;

require('./models/database.js');

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

const { articleRouter } = require('./routes/articles.routes');
const { adminRouter } = require('./routes/admin.routes');
const { messageRouter } = require('./routes/messages.routes');
const { projectRouter } = require('./routes/projects.routes');

app.use("/public", express.static("public"));

app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/projects', projectRouter);

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
