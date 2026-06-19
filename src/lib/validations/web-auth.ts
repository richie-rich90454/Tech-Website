import { z } from 'zod';

export const webRegisterSchema = z
    .object({
        username: z.string().min(3, 'Username must be at least 3 characters').max(20),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(
        (data: { username: string; password: string; confirmPassword: string }) =>
            data.password === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }
    );

export const webLoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});
