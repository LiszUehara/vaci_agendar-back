import { Schedule, Patient } from '@prisma/client';
import zod from "zod";

export let scheduleSchema = zod.object({
    dateTime: zod.coerce.date({message: "Campo dateTime esta invalido"}),
    status: zod.enum(["completed", "cancelled", "unrealized", "other"]).nullable(),
    note: zod.string().nullable(),
    patient: zod
        .object({
            name: zod.string(),
            cpf: zod.string(),
            birthDate: zod.coerce.date()
        }),
});

export interface ISchedule extends Schedule {
    patient: Patient
}

