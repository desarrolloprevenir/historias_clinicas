import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AdminSucursal implements CanActivate {

    constructor(private userService: UserService) {

    }

    canActivate() {
        let identity = this.userService.getIdentity();

        if (identity.id_sucursales || identity.id_provedor) {
            return true;
        } else  if (identity.medico_id) {
            return false;
        }
    }
 }