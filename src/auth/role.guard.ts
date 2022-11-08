import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userData = await this.usersService.findOne(user.userId);

    const roleList = Object.values(Role).reverse();
    let minimumRequiredRole = roleList.length - 1;
    requiredRoles.forEach((requiredRole) => {
      const index = roleList.findIndex((role) => role == requiredRole);
      if (index < minimumRequiredRole) minimumRequiredRole = index;
    });
    const userRoleIndex = roleList.findIndex((role) => role == userData.data.roles);

    return userRoleIndex >= minimumRequiredRole;
  }
}
