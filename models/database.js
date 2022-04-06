const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/abiseth', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to mongodb . . .');
}).catch((err) => {
    console.log(err)
})