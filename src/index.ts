import { clerkMiddleware } from '@clerk/express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { ErrorHandler } from './middleware';
import routes from './router';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(clerkMiddleware());

dotenv.config();
app.use(express.json({ limit: '12mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }));

// Health check endpoint
app.get('/health', (request, response) => {
  response.status(200).send('Server is up and running');
});

app.use('/', routes);
app.use(ErrorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
