import z from 'zod';

const parseEnv = z.object({
    CUSTOMER_APP_ID: z
        .string()
        .refine(
            (id) => parseInt(id) > 0,
            "Invalid number"
        ),
    RESERVATION_VIEW_ID: z
        .string()
        .refine(
            (id) => parseInt(id) > 0,
            "Invalid number"
        ),
    ROOM_LIST_VIEW_ID: z
        .string()
        .refine(
            (id) => parseInt(id) > 0,
            "Invalid number"
        ),
    ROOM_LIST_APP_ID: z
        .string()
        .refine(
            (id) => parseInt(id) > 0,
            "Invalid number"
        ),
})

export const ENV = parseEnv.parse(process.env)
