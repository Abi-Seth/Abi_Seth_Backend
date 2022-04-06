const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/acmedb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to mongodb . . .');
}).catch((err) => {
    console.log(err)
})