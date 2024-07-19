
import { PrismaClient, Schedule, Patient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import prisma from "../utils/prisma";
import ScheduleService from "../service/schedule.service";

jest.mock("../utils/prisma", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}))

jest.mock("../utils/days", () => ({
    __esModule: true,
    default: () => new Date(),
    resetMinutes: () => new Date(),
    getStartDateTimeDay: () => new Date(),
    getEndDateTimeDay: () => new Date(),
}))

beforeEach(() => {
    mockReset(prismaMock);
})
 
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
 
export const scheduleMock = {
    id: '1',
    dateTime: new Date(),
    createdAt: new Date(),
    note: 'Teste Observacao',
    patientId: '2',
    status: 'other',
    updatedAt: new Date()
} as Schedule;

export const patientMock = {
    id: '2',
    birthDate: new Date(),
    createdAt: new Date(),
    cpf: '123.123.123-12',
    name: 'Bianca'
} as Patient;

describe("GET /api/schedule", () => {
    it("list", async () => {
        prismaMock.schedule.count.mockResolvedValue(1)
        prismaMock.schedule.findMany.mockResolvedValue([scheduleMock])
        const service = new ScheduleService();
        expect(await service.index('asc','')).toStrictEqual({totalCount: 1, items: [scheduleMock] })
    });
});

describe("GET /api/schedule/:id", () => {
    it("read", async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(scheduleMock)
        const service = new ScheduleService();
        expect(await service.getOne('1')).toStrictEqual(scheduleMock)
    });
    it("read - schedule not found", async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const service = new ScheduleService();
        expect(await service.delete('1')).toStrictEqual({ error: {  "message": "Agendamento não encontrado." }, isError: true, status: 404 })
    });
});

describe("DELETE /api/schedule/:id", () => {
    it("delete success", async () => {
        prismaMock.schedule.findFirst.mockResolvedValue(scheduleMock)
        prismaMock.schedule.delete.mockResolvedValue(scheduleMock)
        const service = new ScheduleService();
        expect(await service.delete('1')).toStrictEqual(scheduleMock)
    });
    it("delete - schedule not found", async () => {
        prismaMock.schedule.findFirst.mockResolvedValue(null)
        const service = new ScheduleService();
        expect(await service.delete('1')).toStrictEqual({ error: {  "message": "Agendamento não encontrado." }, isError: true, status: 404 })
    });
});

describe("POST /api/schedule", () => {
    it("store", async () => {
        prismaMock.schedule.count.mockResolvedValue(1)
        prismaMock.schedule.create.mockResolvedValue(scheduleMock)
        const service = new ScheduleService();
        expect(await service.store({...scheduleMock, patient: patientMock})).toStrictEqual({message: "store", data: scheduleMock })
    });
    it("store - CPF registred", async () => {
        prismaMock.schedule.count.mockResolvedValue(1)
        prismaMock.schedule.create.mockResolvedValue(scheduleMock)
        prismaMock.patient.findFirst.mockResolvedValue(patientMock)
        const service = new ScheduleService();
        expect(await service.store({...scheduleMock, patient: patientMock})).toStrictEqual({ error: {  "message": "CPF já cadastrado" }, isError: true, status: 409 })
    });
});

describe("PUT /api/schedule/:id", () => {
    it("update", async () => {
        prismaMock.schedule.findFirst.mockResolvedValue(scheduleMock)
        prismaMock.schedule.update.mockResolvedValue(scheduleMock)
        const service = new ScheduleService();
        expect(await service.update('1', {...scheduleMock, patient: patientMock})).toStrictEqual(scheduleMock)
    });
    it("update - not found", async () => {
        prismaMock.schedule.findFirst.mockResolvedValue(null)
        prismaMock.schedule.update.mockResolvedValue(scheduleMock)
        const service = new ScheduleService();
        expect(await service.update('1', {...scheduleMock, patient: patientMock})).toStrictEqual({ error: {  "message": "Agendamento não encontrado." }, isError: true, status: 404 })
    });
});