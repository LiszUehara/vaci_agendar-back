import { Router } from 'express';

const mixedRouter = Router();
const publicRouter = Router();
const privateRouter = Router();

export { mixedRouter, publicRouter, privateRouter };