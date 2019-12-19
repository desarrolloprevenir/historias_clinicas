import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-terminos-y-condiciones',
  templateUrl: './terminos-y-condiciones.component.html',
  styleUrls: ['./terminos-y-condiciones.component.css']
})
export class TerminosYCondicionesComponent implements OnInit {
  public identity;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
  }

}
