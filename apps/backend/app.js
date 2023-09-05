// START OF SETUP ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
// END OF SETUP ENVIRONMENT VARIABLES
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const errorMiddleware = require('./middleware/error');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// setup body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser middleware
app.use(cookieParser());
const corsOptions = require('./config/corsOptions');
// CORS middleware
app.use(cors(corsOptions));

// Logger middleware
app.use(logger('dev'));

// Basic security middleware
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    })
);

// =============================== SWAGGER  ==================================
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Qutrix Registration Application Documentation',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost/3500',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// =============================== end of SWAGGER  ==================================

// Setup Root route

app.get('^/$|/index(.html)?', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve CSS File
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./routes/student.routes'));

// 404 page
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
