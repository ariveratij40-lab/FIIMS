'''
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '../routers';
import { createContext } from './context';
import cors from 'cors';

const app = express();

app.use(cors()); // Consider restricting this in production

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
'''
