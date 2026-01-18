import { z } from 'zod';

import type { InstructorProfile } from '@/entities/instructor';

export const instructorProfileSchema = z.object({
  firstName: z.string().min(2, 'Некорректное имя'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Некорректная фамилия'),
  phone: z
    .string()
    .regex(/\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/, 'Некорректный номер телефона'),
  car: z.object({
    model: z.string().min(3, 'Некорректное название автомобиля'),
    licensePlate: z.string().min(6, 'Некорректный номерной знак'),
  }),
});

export type InstructorProfileSchema = z.infer<typeof instructorProfileSchema>;

export const getDefaultValues = (
  profile?: InstructorProfile,
): InstructorProfileSchema => ({
  firstName: profile?.firstName ?? '',
  middleName: profile?.middleName ?? '',
  lastName: profile?.lastName ?? '',
  phone: profile?.phone ?? '',
  car: profile?.car ?? { model: '', licensePlate: '' },
});
