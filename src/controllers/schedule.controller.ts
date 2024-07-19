import { Request, Response } from "express";
import ScheduleService from '../service/schedule.service';
import { ISchedule } from "../models/schedule.model";

type OrderType = "desc" | "asc";

class ScheduleController {
  private service: ScheduleService
  constructor() {
    this.service = new ScheduleService();
  }

  async index(request: Request, response: Response) {
    try {
        let { order, search } = request.query;
        const searchValue  = typeof search === 'string' ? search : ''; 
        const orderValue: OrderType  = order === 'desc' ? 'desc' : 'asc'; 

        return response.send(await this.service.index(orderValue, searchValue));
    } catch (error) {
      return response.status(400).json({ error: (error as Error).message });
    }
  }

  async store(request: Request, response: Response) {
    try {
        const schedule = request.body as ISchedule;
        const result = await this.service.store(schedule);
        if(result.isError){
          return response.status(result.status).send(result.error)
        } else {
          return response.send(result) 
        }
    } catch (error) {
      return response.status(400).json({ error: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const scheduleUpdated = request.body  as ISchedule;
      const result = await this.service.update(id, scheduleUpdated);
        if(result.isError){
          return response.status(result.status).send(result.error)
        } else {
          return response.send(result) 
        }
    } catch (error) {
      return response.status(400).json({ error });
    }
  }


  async getOne(request: Request, response: Response) {
    try {
        const { id } = request.params;
    
        const result = await this.service.getOne(id);
        if(result.isError){
          return response.status(result.status).send(result.error)
        } else {
          return response.send(result) 
        }
    } catch (error) {
        response.status(400).send(error);
    }
  }

  async delete(request: Request, response: Response) {
    try {
        const { id } = request.params;
    
        const result = await this.service.delete(id);
        if(result.isError){
          return response.status(result.status).send(result.error)
        } else {
          return response.send(result) 
        }
    } catch (error) {
        response.status(400).send(error);
    }
  }
}



export default ScheduleController;