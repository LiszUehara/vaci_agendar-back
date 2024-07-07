import zod from "zod";

export let scheduleModel = zod.object({
    id: zod
        .string({ message: "Campo id esta invalido"})
        .uuid(),
    time: zod.date({message: "Campo time esta invalido"}),
    createdAt: zod.date().optional(),
    // createdBy: zod.string().optional(),
    updatedAt: zod.date().optional(),
    // updatedBy: zod.string().optional(),
    patients: zod.array(
        zod.object({
            id: zod.string().uuid(),
            status: zod.enum(["completed", "cancelled", "unfulfilled", "other"]),
            note: zod.string().nullable(),
        })
    ),
});