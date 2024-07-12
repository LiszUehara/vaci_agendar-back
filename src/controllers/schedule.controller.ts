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
          prismaClient.schedule.findMany({
            orderBy: {dateTime: 'asc'},
            select: {
              id: true,
              dateTime: true,
              status: true,
              note: true,
              patient: true,
          },
            }),
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
          items: schedules,
        });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async store(request: Request, response: Response) {
    try {
        const schedule = request.body as Schedule;
        schedule.dateTime = dayjs(schedule.dateTime).set('minute', 0).set('second', 0).set('millisecond', 0).toDate()
    
        const { success, data, error } = scheduleSchema.safeParse(schedule);
    
        if (!success) {
          return response.status(400).send(error);
        }
        const patientWithCPF = await prismaClient.patient.findFirst({where: {
          cpf: data.patient.cpf
        }})

        if(patientWithCPF){
          return response.status(409).json({message: "CPF já cadastrado"});
        }
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
        
        const patient = await prismaClient.patient.create({data: {
            ...data.patient
        }})
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

      const { id } = request.params;
      const scheduleUpdated = request.body  as Schedule;
      scheduleUpdated.dateTime = dayjs(scheduleUpdated.dateTime).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
      const scheduleOld = await prismaClient.schedule.findFirst({
        where: { id },  
      });
  
      if (!scheduleOld) {
        return response.status(404).send({ message: 'Agendamento não encontrado.' });
      }
      
      const { success, data, error } = scheduleSchema.safeParse(scheduleUpdated);
      
      if (!success) {
        return response.status(400).send(error);
      }
      
      const [oldDate, oldTime] = scheduleOld?.dateTime.toISOString().split('T')
      const [updatedDate, updatedTime] = scheduleUpdated?.dateTime.toISOString().split('T')
      let schedulesInTime=0, schedulesInDay=0;
      
      if(oldDate!==updatedDate){
        const startTime = dayjs(scheduleUpdated.dateTime).set('hour', 0).toISOString()
        const endTime = dayjs(scheduleUpdated.dateTime).set('hour', 23).set('minute', 59).set('second', 59).toISOString();
        
        [schedulesInTime, schedulesInDay ] = await Promise.all([
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
      } else if(oldTime !== updatedTime){
        schedulesInTime = await prismaClient.schedule.count(
          { where: 
              { dateTime: data.dateTime }
          });
      }
      if(schedulesInTime>=2){
          return response.status(409).json({message: "Horário já contem 2 agendamento, selecione outro horário ou procure nossa central de atendimento."});
      }
      
      if(schedulesInDay>=20){
        return response.status(409).json({message: "Este dia já contem 20 agendamento, selecione outro dia ou procure nossa central de atendimento."});
      }
      if(!scheduleUpdated.patientId){
        return response.status(400).json({message: "Paciente não informado"});
      }
      const patient = await prismaClient.patient.update({
        data: {
          ...data.patient
        },
        where: {
          id: scheduleUpdated.patientId
        }
    })
      const schedule = await prismaClient.schedule.update({
        data: {
          dateTime: new Date(scheduleUpdated.dateTime).toISOString(),
          status: scheduleUpdated.status,
          note: scheduleUpdated.note,
          patient: {
              connect: { id: patient?.id },
          },
          updatedAt: new Date()
        },
        where: { id },
        include: { patient: true },
      });

    return response.send(schedule);
    } catch (error) {
      return response.status(400).json({ error });
    }
  }


  async getOne(request: Request, response: Response) {
    try {
        const { id } = request.params;
    
        const schedule = await prismaClient.schedule.findUnique({
          where: { id },  
          select: {
            id: true,
            dateTime: true,
            status: true,
            note: true,
            patient: true,
        },
        });
    
        if (!schedule) {
          return response.status(404).send({ message: 'Agendamento não encontrado.' });
        }
    
        response.send(schedule);
    } catch (error) {
        response.status(400).send(error);
    }
  }

  async delete(request: Request, response: Response) {
    try {
        const { id } = request.params;
    
        const schedule = await prismaClient.schedule.findFirst({
          where: { id },  
        });
    
        if (!schedule) {
          return response.status(404).send({ message: 'Agendamento não encontrado.' });
        }

        const resultDeleteSchedule = await prismaClient.schedule.delete({
            where: { id },  
          });
          if(resultDeleteSchedule.patientId){
              const resultDeletePatient = await prismaClient.patient.delete({
                  where: { id:  resultDeleteSchedule.patientId},  
                });
            }

        response.send(schedule);
    } catch (error) {
        response.status(400).send(error);
    }
  }
}



export default ScheduleController;