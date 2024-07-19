import prismaClient from '../utils/prisma';
import { ISchedule, scheduleSchema } from "../models/schedule.model";
import { getEndDateTimeDay, getStartDateTimeDay, resetMinutes } from "../utils/days"

type OrderType = "desc" | "asc";

class ScheduleService {
  constructor() {
  }

  async index(orderValue: OrderType, searchValue: string) {
        const [scheduleTotalCount, schedules] = await Promise.all([
          prismaClient.schedule.count(),
          prismaClient.schedule.findMany({
            where: { patient: { cpf: { contains: searchValue }} },
            orderBy: {dateTime: orderValue},
            select: {
              id: true,
              dateTime: true,
              status: true,
              note: true,
              patient: true,
          },
            }),
        ]);
        /*
        const _schedulesGroup = schedules.reduce(
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
          */
        return ({
          totalCount: scheduleTotalCount,
          items: schedules,
        });

  }

  async store(schedule: ISchedule) {
        schedule.dateTime = resetMinutes(schedule.dateTime)
    
        const { success, data, error } = scheduleSchema.safeParse(schedule);
    
        if (!success) {
          return { error, isError: true, status: 400}
        }
        const patientWithCPF = await prismaClient.patient.findFirst({where: {
          cpf: data.patient.cpf
        }})

        if(patientWithCPF){
          return { error: {message: "CPF já cadastrado"}, isError: true, status: 409 };
        }
        const startTime = getStartDateTimeDay(schedule.dateTime)
        const endTime = getEndDateTimeDay(schedule.dateTime)
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
          return { error: {message: "Horário já contem 2 agendamento, selecione outro horário ou procure nossa central de atendimento."}, isError: true, status: 409 };
        }
        
        if(schedulesInDay>=20){
          return { error: {message: "Este dia já contem 20 agendamento, selecione outro dia ou procure nossa central de atendimento."}, isError: true, status: 409 };
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
        return ({ message: 'store', data: newSchedule });
  }

  async update(id: string, scheduleUpdated: ISchedule) {
      scheduleUpdated.dateTime = resetMinutes(scheduleUpdated.dateTime);
      const scheduleOld = await prismaClient.schedule.findFirst({
        where: { id },  
      });
  
      if (!scheduleOld) {
        return { error: {message: "Agendamento não encontrado."}, isError: true, status: 404 };
      }
      
      const { success, data, error } = scheduleSchema.safeParse(scheduleUpdated);
      
      if (!success) {
        return { error, isError: true, status: 400}
      }
      
      const [oldDate, oldTime] = scheduleOld?.dateTime.toISOString().split('T')
      const [updatedDate, updatedTime] = scheduleUpdated?.dateTime.toISOString().split('T')
      let schedulesInTime=0, schedulesInDay=0;
      
      if(oldDate!==updatedDate){
        const startTime = getStartDateTimeDay(scheduleUpdated.dateTime)
        const endTime = getEndDateTimeDay(scheduleUpdated.dateTime);
        
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
          return { error: {message: "Horário já contem 2 agendamento, selecione outro horário ou procure nossa central de atendimento."}, isError: true, status: 409 };
      }
      
      if(schedulesInDay>=20){
        return { error: {message: "Este dia já contem 20 agendamento, selecione outro dia ou procure nossa central de atendimento."}, isError: true, status: 409 };
      }
      if(!scheduleUpdated.patientId){
        return { error: {message: "Paciente não informado"}, isError: true, status: 404 };
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

    return {...schedule};
  }


  async getOne(id: string) {
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
          return { error: {message: "Agendamento não encontrado."}, isError: true, status: 404 };
        }
    
        return {...schedule};
  }

  async delete(id: string) {
        const schedule = await prismaClient.schedule.findFirst({
          where: { id },  
        });
    
        if (!schedule) {
          return { error: {message: "Agendamento não encontrado."}, isError: true, status: 404 };
        }

        const resultDeleteSchedule = await prismaClient.schedule.delete({
            where: { id },  
          });
          if(resultDeleteSchedule.patientId){
              await prismaClient.patient.delete({
                  where: { id:  resultDeleteSchedule.patientId},  
                });
            }

        return {...schedule};
  }
}



export default ScheduleService;