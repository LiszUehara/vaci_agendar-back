import zod from "zod";
import { IPatient } from "./patient.model";

export interface ISchedule {
    id: string;
    time: Date;
    createAt?: Date;
    updatedAt?: Date;
    patients: IPatient[] 
}

export let scheduleSchema = zod.object({
    dateTime: zod.coerce.date({message: "Campo dateTime esta invalido"}),
    status: zod.enum(["completed", "cancelled", "unrealized", "other"]).nullable(),
    note: zod.string().nullable(),
    patient: zod
        .object({
            name: zod.string(),
            birthDate: zod.coerce.date()
        }),
});

