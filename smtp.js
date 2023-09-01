import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
import route from './router/index.js'
// import mongoose from './utils/db.conn.js';


const app = express();
app.use(bodyParser.urlencoded({ extended: true })) /**parse requests of content-type - application/x-www-form-urlencoded*/
app.use(bodyParser.json()) /**parse requests of content-type - application/json*/


app.get('/', (req, res) => {
    res.send('Welcome to The Email Microservice link');
});

// Use the send email route
app.use('/api', route);

// catch all other un existing routes
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Can't find ${req.originalUrl} on this server!!`,
            404,
        ),
    );
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

});
