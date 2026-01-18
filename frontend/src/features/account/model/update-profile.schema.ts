import { z } from 'zod';

const baseProfileSchema = z.object({
  firstName: z.string().min(2, 'Некорректное имя'),
  middleName: z.string().min(2, 'Некорректная отчество').optional(),
  lastName: z.string().min(2, 'Некорректная фамилия'),
  phone: z
    .string()
    .regex(/\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/, 'Некорректный номер телефона'),
});
export const instructorProfileSchema = baseProfileSchema.extend({
  car: z.object({
    model: z.string().min(3, 'Некорректное название автомобиля'),
    licensePlate: z.string().min(6, 'Некорректный номерной знак'),
  }),
});
export const studentProfileSchema = baseProfileSchema;

export type InstructorProfileSchema = z.infer<typeof instructorProfileSchema>;
export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;
