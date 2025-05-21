import { UserRole } from '@prisma/client';

export interface JwtPayload {
  email: string;
  userId: number;
  userRole: UserRole;
}
