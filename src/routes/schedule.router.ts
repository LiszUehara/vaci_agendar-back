import ScheduleController from '../controllers/schedule.controller';
import { publicRouter } from './router';

const scheduleController = new ScheduleController();

publicRouter.get('/api/schedule', (request, response) =>
  scheduleController.index(request, response)
);

publicRouter.get('/api/schedule/:id', (request, response) =>
  scheduleController.getOne(request, response)
);

publicRouter.post('/api/schedule', (request, response) =>
    scheduleController.store(request, response)
);

publicRouter.put('/api/schedule/:id', (request, response) =>
  scheduleController.update(request, response)
);