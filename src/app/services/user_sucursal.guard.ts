import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserSucursal implements CanActivate {

    constructor(private userService: UserService) {

    }

    canActivate() {
        let identity = this.userService.getIdentity();

        if (identity.medico_id || (identity.id_provedor && !identity.id_provedor)) {
            return false;
        } else  if (identity.id_sucursales && identity.id_provedor) {
            return true;
        }
    }
 }

