import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { handle404, logErrors, handleErrors } from './handleErrors.js';
import limiter from './rateLimit.js';

/** The Express app */
const app = express();

// Allowed domains
const allowedDomains = [
  'http://127.0.0.1:4000',
  'http://localhost:4000',
  'https://*.multilat.xyz',
  'https://*.multilat.dev',
  'https://*.adeptclippingpath.com',
  'https://*.floristchapter.com',
  'https://*.jewelrywithcare.com',
  'https://*.jewelrywithcare.com',
  'https://*.cutoutimage.com',
  'https://*.furnifixer.com',
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedDomains.some(domain => domain === origin || new RegExp(domain.replace('*.', '.*')).test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Requires An API Key...'));
    }
  },
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(limiter);
app.set('trust proxy', 1);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Redirect the root URL to the github repository
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(routes);
app.use(handle404);
app.use(logErrors);
app.use(handleErrors);

export default app;