import z from 'zod';

const parseEnv = z.object({
    RESERVATION_APP_ID: z
        .string()
        .refine(
            (id) => parseInt(id) > 0,
            "Invalid number"
        ),
})

export const ENV = parseEnv.parse(process.env)
