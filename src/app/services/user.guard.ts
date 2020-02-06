import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {

    }

    canActivate() {
        let identity = this.userService.getIdentity();
        let confirmar = JSON.parse(localStorage.getItem('confirmar'));
        var id;

        if (identity && confirmar === true) {
            return true;
        } else {

            if (identity && confirmar === false) {
                this.router.navigate(['/confirmar-cuenta']);
                return false;
        }

            if (!identity) {
            this.router.navigate(['/login']);
            return false;
            }
        }

        // if (identity && confirmar === true) {
        //     return true;
        // }

        // if (identity && confirmar === false) {
        //     this._router.navigate(['/confirmar-cuenta']);
        //     return false;
        // }

        // if (identity === undefined) {
        //     this._router.navigate(['/login']);
        //     return false;
        // }
    }
 }

