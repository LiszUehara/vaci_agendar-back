import crypto from "crypto";
import prismaClient from '../utils/prisma';
import { scheduleSchema } from "../models/schedule.model";
import dayjs from "../utils/days"
import { Schedule } from "@prisma/client";
import { Request, Response } from "express";

class ScheduleController {
  constructor() {
  }

  async index(request: Request, response: Response) {
    try {    
        const [scheduleTotalCount, schedules] = await Promise.all([
          prismaClient.schedule.count(),
          prismaClient.schedule.findMany({orderBy: {dateTime: 'asc'}}),
        ]);

        const schedulesGroup = schedules.reduce(
            (result, schedule) => {
                const [date, time] = schedule.dateTime.toISOString().split('T'); 
                return ({
                    ...result,
                    [date]: {
                        ...(result[date] || []),
                            [time]: [
                                ...(result[date] ? result[date][time] || [] : []),
                                schedule,
                            ]
                    },
                })}, 
            {},
          );
        return response.send({
          totalCount: scheduleTotalCount,
          items: schedulesGroup,
        });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async store(request: Request, response: Response) {
    try {
        const schedule = request.body as Schedule;
        schedule.dateTime = dayjs(schedule.dateTime).set('minute', 0).set('second', 0).toDate()
    
        const { success, data, error } = scheduleSchema.safeParse(schedule);
    
        if (!success) {
          return response.status(400).send(error);
        }
    
        const patient = await prismaClient.patient.create({data: {
            ...data.patient
        }})
        const startTime = dayjs(schedule.dateTime).set('hour', 0).toISOString()
        const endTime = dayjs(schedule.dateTime).set('hour', 23).set('minute', 59).set('second', 59).toISOString()
        const [schedulesInTime, schedulesInDay ] = await Promise.all([
            prismaClient.schedule.count({ where: 
               { dateTime: data.dateTime }
            }),
            prismaClient.schedule.count({ where: 
                {dateTime: {
                    gte: startTime,
                    lte: endTime,
                  }, }
             }),
        ])
        if(schedulesInTime>=2){
            return response.status(409).json({message: "Horário já contem 2 agendamento, selecione outro horário ou procure nossa central de atendimento."});
        }

        if(schedulesInDay>=20){
            return response.status(409).json({message: "Este dia já contem 20 agendamento, selecione outro dia ou procure nossa central de atendimento."});
        }

        const newSchedule = await prismaClient.schedule.create({
          data: {
            dateTime: new Date(schedule.dateTime).toISOString(),
            status: schedule.status,
            note: schedule.note,
            patient: {
                connect: { id: patient?.id },
            },
          },
          include: { patient: true },
        });
        response.send({ message: 'store', data: newSchedule });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      return response.send("Atualização");
    } catch (error) {
      return response.status(400).json({ error });
    }
  }


  async getOne(request, response) {
    try {
      response.status(200).send("Listagem por id");
    } catch (error) {
      response.status(400).send(error);
    }
  }
}

export default ScheduleController;