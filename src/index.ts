import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import './routes/schedule.router.ts';
import { publicRouter } from './routes/router.ts';

const PORT = process.env.PORT || 5000;

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(publicRouter);

server.use('*', (_request, response) => {
  response.status(404).send({ message: 'Rota não encontrada ou indisponível' });
});

server.listen(PORT, () => {
  console.log(`Rodando aplicação backend na porta: ${PORT}`);
});