import zod from "zod";

export interface IPatient {
    id: string;
    name: string;
    birthDate: Date;
}
