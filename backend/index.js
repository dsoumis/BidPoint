const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const authRoute = require('./routes/auth');
const secretRoute = require('./routes/secretRoutes');
const itemRoute = require('./routes/itemRoutes');
const ratingRoute = require('./routes/ratingRoutes');
const messageRoute = require('./routes/messageRoutes');
const xmlJsonRoute = require('./routes/xmlJSONRoutes');
const bodyParser = require('body-parser');
const https = require('https');
const tls = require('tls');
const fs = require('fs');
dotenv.config();

//Connect to db
mongoose.connect(DB_CONNECT,{ useNewUrlParser: true });

mongoose.connection.once('open',function () {
    console.log('Connected to Db!');
}).on('error',function (error) {
    console.log('Connection error: ',error);
});

//Middleware

app.use(express.json({limit: '50mb'})); //Now we can have  requests. limit is the size of request. Is good to increase it when there is a transfer of photos.
app.use(cookieParser());



//Routes middlewares
app.use('',authRoute);
app.use('',secretRoute);
app.use('',itemRoute);
app.use('',ratingRoute);
app.use('',messageRoute);
app.use('',xmlJsonRoute);


// app.listen(3001,function () {
//     console.log('Server up and running!')
// });

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
},app).listen(3001,function () {
    console.log('Server up and running!')
});