import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/** Restricts a route to the given CMS roles (Super Admin / Admin / Editor). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
