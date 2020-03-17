import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SucursalService } from '../../../services/sucursal.service';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent implements OnInit {
  medicoSelect = new FormControl('', Validators.required);
  servicioSelect = new FormControl('', Validators.required);
  nombreConsultorio = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  extensionConsultorio = new FormControl('');
  public infoConsultorio;
  public ds = [];
  public id_horario;
  public loading;
  public status;
  public statusText;
  public id_consultorio;
  public mymodel;

  // variables crear horario
  public consultorioForm = false;
  public mananaH1 = false;
  public tardeH1 = false;
  public horasDesdeHastaManana;
  public horasDesdeHastaTarde;
  public diasH1;
  public mananaDesdeH1;
  public mananaHastaH1;
  public tardeDesdeH1;
  public tardeHastaH1;
  public confirmacion;
  public crearConsul;

  // variables crear consultorio
  public medicos;
  public servicios;
  public mananaDesdeH2: any;
  public mananaHastaH2: any;
  public tardeDesdeH2: any;
  public tardeHastaH2: any;
  public mananaDesdeH3: any;
  public mananaHastaH3: any;
  public tardeDesdeH3: any;
  public tardeHastaH3: any;
  public horario1;
  public mananaH2 = false;
  public mananaH3 = false;
  public tardeH2 = false;
  public tardeH3 = false;
  public horario2 = false;
  public horario3 = false;
  public btnHorario = true;
  public btnEliminarHorario = false;
  public disableH1;
  public diasH2;
  public diasH3;
  public disableH2;
  public response = false;

  constructor(private sucursalService: SucursalService,
              location: PlatformLocation,
              private route: ActivatedRoute,
              private userService: UserService,
              private provedorService: ProvedorService) {
                location.onPopState(() => {
                  document.getElementById('btn-cerrar-modal-confirmacion').click();
                });
               }

  ngOnInit() {
    this.mymodel = 'informacion';
    this.route.params.subscribe(params => {

      if (params['id']) {
        this.id_consultorio = params['id'];
        this.getConsultorioApi(this.id_consultorio);
        // console.log('editar');
        this.crearConsul = false;
      } else {
        console.log('crear');
        this.crearConsul = true;
        this.horario1 = '1';
        let identity = this.userService.getIdentity().id_provedor;
        this.getMedicos(identity);
        this.getServicios(identity);
        this.horas();
      }
    });
      // localStorage.getItem()
      this.diasSemana();
  }


  // ------------------------------------ METODOS CREAR CONSULTORIO -------------------------------------------------------------
 
  getMedicos(idProvedor) {
    this.loading = true;
    this.provedorService.getMedicosProvedor(idProvedor).subscribe( (response) => {
        this.medicos = response;
        this.loading = false;
        // console.log(response)
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
      console.log(err);
    } );
  }

  getServicios(idProvedor) {

    this.loading = true;
    this.provedorService.getPublications(idProvedor).subscribe( (response) => {
      this.servicios = response;
      this.loading = false;
      // console.log(response);
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
      console.log(err);
    });
  }

  siguiente() {
    this.mymodel = 'horarios';
    document.getElementById('informacion').className = 'list-group-item';
    document.getElementById('horarios').className = 'list-group-item active';
  }

  mostrarHorario(bol) {
    console.log(bol);
    let mostrar = true;

    switch (mostrar === true) {

      case this.horario2 === false:
      console.log('aqui');
      this.validacionesH1Crear(bol);
      break;

      case (this.horario2 === true && this.horario3 === false):
      console.log('aqui 2');
      this.status = false;
      this.validacionesH2(bol);
      break;
    }
  }


  // Validaciones horario 1
  validacionesH1Crear(bol): boolean {

    // console.log('aqui val1')

    if (this.diasH1 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa los dias de atención en el horario 1.';
      return false;
  } else {

    let val = true;
    switch (val === true) {

    case (this.mananaH1 === true && this.tardeH1 === false) :
    if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
      return false;
    } else {

      // Validacion de las horas de inicio y final
      if (this.mananaDesdeH1 > this.mananaHastaH1) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
        // console.log('<aqui>');
        return false;
      } else {

        if ( bol === 'false' ) {

          if (this.diasH1.length >= 7) {
            this.status = 'warning';
            this.statusText = 'No hay dias disponibles para el horario 2.';
          } else {
           this.horario2 = true;
          //  console.log('aqui agregar');
           this.btnEliminarHorario = true;
           this.disabledDiasH1();
           this.disableH1 = true;
           return true;
          }
          } else {
          return true;
        }

      }
    }
    break;

    case (this.mananaH1 === false && this.tardeH1 === true) :
    if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 1.';
        return false;
    } else {

      // Validacion de las horas de inicio y final
      if (this.tardeDesdeH1 > this.tardeHastaH1) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
        return false;
      } else {

        if ( bol === 'false' ) {

         if (this.diasH1.length >= 7) {
          this.status = 'warning';
          this.statusText = 'No hay dias disponibles para el horario 2.';
          } else {
           this.horario2 = true;
          //  console.log('aqui agregar');
           this.btnEliminarHorario = true;
           this.disabledDiasH1();
           this.disableH1 = true;
           return true;
          }


          } else {
          return true;
        }

      }
    }
    break;

    case (this.mananaH1 === true && this.tardeH1 === true) :

    if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
      return false;
    } else if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 1.';
      return false;
    } else {

      // Validacion de las horas de inicio y final
      if (this.mananaDesdeH1 > this.mananaHastaH1) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
        return false;
      } else if (this.tardeDesdeH1 > this.tardeHastaH1) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
        return false;
      } else {

        if ( bol === 'false' ) {


          if (this.diasH1.length >= 7) {
            this.status = 'warning';
            this.statusText = 'No hay dias disponibles para el horario 2.';
          } else {
           this.horario2 = true;
          //  console.log('aqui agregar');
           this.btnEliminarHorario = true;
           this.disabledDiasH1();
           this.disableH1 = true;
           return true;
          }


          } else {
          return true;
        }
      }

    }
    break;

    case (this.mananaH1 === false && this.tardeH1 === false) :
    this.status = 'warning';
    this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
    return false;
    break;
  }

  }
  }


  validacionesH2(bol): boolean {

    // console.log('aquiii');

    if (this.diasH2 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa los dias de atención en el horario 2.';
      return false;
  } else {

    let val = true;
    switch (val === true) {

    case (this.mananaH2 === true && this.tardeH2 === false) :
    if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
      return false;
    } else {

      // Validacion de las horas de inicio y final
      if (this.mananaDesdeH2 > this.mananaHastaH2) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
        return false;
      } else {

        if (bol === 'false') {

          if ( (this.diasH1.length + this.diasH2.length) >= 7) {
            this.status = 'warning';
            this.statusText = 'No hay dias disponibles para el horario 3.';
          } else {

            this.horario3 = true;
            this.btnHorario = false;
            this.disabledDiasH2();
            this.disableH2 = true;
            return true;
          }


        //   this.horario3 = true;
        // this.btnHorario = false;
        // this.disabledDiasH2();
        // this.disableH2 = true;
        // return true;


        } else {
          return true;
        }

      }
    }
    break;

    case (this.mananaH2 === false && this.tardeH2 === true) :
    if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 2.';
        return false;
    } else {

      // Validacion de las horas de inicio y final
      if (this.tardeDesdeH2 > this.tardeHastaH2) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
        return false;
      } else {

        if (bol === 'false') {

          if ( (this.diasH1.length + this.diasH2.length) >= 7) {
            this.status = 'warning';
            this.statusText = 'No hay dias disponibles para el horario 3.';
          } else {

            this.horario3 = true;
            this.btnHorario = false;
            this.disabledDiasH2();
            this.disableH2 = true;
            return true;
          }


        } else {
          return true;
        }

      }
    }
    break;

    case (this.mananaH2 === true && this.tardeH2 === true) :

    if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
      return false;
    } else if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
      this.status = 'warning';
      this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 2.';
      return false;
    } else {
       // Validacion de las horas de inicio y final
       if (this.mananaDesdeH2 > this.mananaHastaH2) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
        return false;
      } else if (this.tardeDesdeH2 > this.tardeHastaH2) {
        this.status = 'warning';
        this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
        return false;
      } else {

        if (bol === 'false') {

         if ( (this.diasH1.length + this.diasH2.length) >= 7) {
            this.status = 'warning';
            this.statusText = 'No hay dias disponibles para el horario 3.';
          } else {

            this.horario3 = true;
            this.btnHorario = false;
            this.disabledDiasH2();
            this.disableH2 = true;
            return true;
          }

        } else {
          return true;
        }
      }
    }
    break;

    case (this.mananaH2 === false && this.tardeH2 === false) :
    this.status = 'warning';
    this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
    return false;
    break;
  }

  }
  }

  validacionesH3(): boolean {

    if (this.diasH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
    } else {

      let val = true;
      switch (val === true) {

      case (this.mananaH3 === true && this.tardeH3 === false) :
      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
          return false;
        } else {
          // console.log('mañana bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === true) :
      if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = true;
          this.status = 'warning';
          this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        } else {
          // console.log('tarde bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === true && this.tardeH3 === true) :

      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        return false;
      } else if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        // console.log(this.tardeDesdeH3, this.tardeHastaH3);
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        return false;
      } else {
         // Validacion de las horas de inicio y final
         if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = 'warning';
          this.statusText = 'Por favor completa los dias de atención en el horario 3.';
          return false;
        } else if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = 'warning';
          this.statusText = 'Por favor completa los dias de atención en el horario 3.';
          return false;
        } else {
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === false) :
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
        return false;
        break;
    }

    }
  }


  disabledDiasH1() {

    // console.log(this.diasH1);

    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < this.diasH1.length; i++) {
     var nombre = this.diasH1[i];

     // tslint:disable-next-line: prefer-for-of
     for (var j = 0; j < this.ds.length; j++) {

      if (nombre === this.ds[j].dia.nombre) {
        this.ds[j].dia.disponible = false;
      }
     }

   }
  }

   // desabilitar dias escogidos en el horario 2
   disabledDiasH2 () {

    // console.log(this.diasH1);

    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < this.diasH2.length; i++) {
      var nombre = this.diasH2[i];

      // tslint:disable-next-line: prefer-for-of
      for (var j = 0; j < this.ds.length; j++) {

       if (nombre === this.ds[j].dia.nombre) {
         this.ds[j].dia.disponible = false;
       }
      }

    }
   }



   atras(tipo) {
    // console.log('asda');
    let bol = true;

    switch (bol === true) {

      case this.diasH1 === undefined:

          if(tipo === false) {
          this.horario1 = '1';
          this.mymodel = 'informacion';
          document.getElementById('informacion').className = 'list-group-item active';
          document.getElementById('horarios').className = 'list-group-item';
          }
          break;

      case (this.diasH1 !== undefined) && (this.diasH1.length >= 1 && this.horario2 === false) :
      // console.log('h1');
      if ( this.enabledDiasH1() === true ) {
         this.diasH1 = undefined;
         this.mananaDesdeH1 = undefined;
         this.mananaDesdeH2 = undefined;
         this.mananaDesdeH3 = undefined;
         this.tardeDesdeH1 = undefined;
         this.tardeDesdeH2 = undefined;
         this.tardeDesdeH3 = undefined;
         this.mananaH1 = false;
         this.tardeH1 = false;
         this.status = false;
         this.disableH1 = false;
         this.btnHorario = true;
         if (this.horario1 === '1') {
            this.horario1 = '2';
            console.log('aqui 2')
         } else {
            this.horario1 = '1';
            console.log('aqui 1')
         }

         if (tipo === false) {

          if (this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
          this.mymodel = 'informacion';
          document.getElementById('informacion').className = 'list-group-item active';
          document.getElementById('horarios').className = 'list-group-item';
         }

         console.log(this.diasH1);
      }
      break;

      case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === false):
      // console.log('h1 y h2');
      if (this.enabledDiasH1() === true) {
        this.diasH1 = undefined;
        this.mananaDesdeH1 = undefined;
        this.mananaDesdeH2 = undefined;
        this.mananaDesdeH3 = undefined;
        this.tardeDesdeH1 = undefined;
        this.tardeDesdeH2 = undefined;
        this.tardeDesdeH3 = undefined;
        this.mananaH1 = false;
        this.tardeH1 = false;
        this.status = false;
        this.disableH1 = false;
        this.btnHorario = true;
        this.diasH2 = undefined;
        this.mananaDesdeH2 = undefined;
        this.mananaHastaH2 = undefined;
        this.tardeDesdeH2 = undefined;
        this.tardeHastaH2 = undefined;
        this.horario2 = false;
        this.status = false;
        this.disableH2 = false;
      // console.log(this.diasH2);
        if (this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
        if (tipo === false) {
        if (this.horario1 === '1') {
          this.horario1 = '2';
       } else {
          this.horario1 = '1';
       }
        this.mymodel = 'informacion';
        document.getElementById('informacion').className = 'list-group-item active';
        document.getElementById('horarios').className = 'list-group-item';
        }
      }

      break;

      case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === true):
      // console.log('h1 h2 h3');
        if (this.enabledDiasH1() === true && this.enabledDiasH2() === true && this.enabledDiasH3() === true) {

          this.diasH1 = undefined;
          this.mananaDesdeH1 = undefined;
          this.mananaDesdeH2 = undefined;
          this.mananaDesdeH3 = undefined;
          this.tardeDesdeH1 = undefined;
          this.tardeDesdeH2 = undefined;
          this.tardeDesdeH3 = undefined;
          this.mananaH1 = false;
          this.tardeH1 = false;
          this.status = false;
          this.disableH1 = false;
          this.btnHorario = true;
          this.diasH2 = undefined;
          this.mananaDesdeH2 = undefined;
          this.mananaHastaH2 = undefined;
          this.tardeDesdeH2 = undefined;
          this.tardeHastaH2 = undefined;
          this.horario2 = false;
          this.status = false;
          this.disableH2 = false;
          this.horario3 = false;
          this.mananaDesdeH3 = undefined;
          this.mananaHastaH3 = undefined;
          this.tardeDesdeH3 = undefined;
          this.tardeHastaH3 = undefined;
          this.mananaH3 = false;
          this.tardeH3 = false;
          // console.log(this.diasH3);
          if(this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
          if(tipo === false) {
            if(this.horario1 === '1') {
              this.horario1 = '2';
           } else {
              this.horario1 = '1';
           }
            this.mymodel = 'informacion';
            document.getElementById('informacion').className = 'list-group-item active';
            document.getElementById('horarios').className = 'list-group-item';
            }
        }
        break;
    }

  }

     // habilitar dias horario 1 cuando se elimina el horario 2
     enabledDiasH1() {

      // console.log(this.diasH1);
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < this.diasH1.length; i++) {
          var nombre = this.diasH1[i];

        // tslint:disable-next-line: prefer-for-of
          for (var j = 0; j < this.ds.length; j++) {

        if (nombre === this.ds[j].dia.nombre) {
             this.ds[j].dia.disponible = true;
           }
          }
        }
        return true;
        // console.log(this.ds);
     }
     // habilitar dias horario 2 cuando se elimina el horario 3
     enabledDiasH2() {
      if (this.diasH3) {
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < this.diasH3.length; i++) {
          var nombre = this.diasH3[i];
          // tslint:disable-next-line: prefer-for-of
          for (var j = 0; j < this.ds.length; j++) {

           if (nombre === this.ds[j].dia.nombre) {
             this.ds[j].dia.disponible = true;
           }
          }
        }
        return true;
      } else {
        return true;
      }
      // console.log(this.ds);
     }
     // habilitar dias seleccionados en el horario 2
     enabledDiasH3() {
      // tslint:disable-next-line: prefer-for-of
      for (var i = 0; i < this.diasH2.length; i++) {
        var nombre = this.diasH2[i];

        // tslint:disable-next-line: prefer-for-of
        for (var j = 0; j < this.ds.length; j++) {
         if (nombre === this.ds[j].dia.nombre) {
           this.ds[j].dia.disponible = true;
         }
        }
      }
      return true;
    }

    eliminarHorarioCrear() {

      let bol = true;
      switch (bol === true) {

        case this.horario2 === true && this.horario3 === false:
        this.horario2 = false;
        this.btnEliminarHorario = false;
        this.enabledDiasH1();
        this.disableH1 = false;
        this.diasH2 = undefined;
        this.mananaDesdeH2 = undefined;
        this.mananaHastaH2 = undefined;
        this.tardeDesdeH2 = undefined;
        this.tardeHastaH2 = undefined;
        break;

        case this.horario2 === true && this.horario3 === true:
        this.horario3 = false;
        this.btnHorario = true;
        this.disableH2 = false;
        this.diasH3 = undefined;
        this.enabledDiasH2();
        this.enabledDiasH3();
        this.mananaDesdeH3 = undefined;
        this.mananaHastaH3 = undefined;
        this.tardeDesdeH3 = undefined;
        this.tardeHastaH3 = undefined;
        break;
      }

    }


    guardar() {

      // if(this.validacionesH1Crear(true) === true) {
      //   console.log('aqui');
      // }
      let sw = true;

      switch(sw === true) {

        case this.horario2 === false && this.horario3 === false:
          if (this.validacionesH1Crear(true) === true) {
            this.horarios();
          }
          break;

        case this.horario2 === true && this.horario3 === false:
          if (this.validacionesH2(true) === true) {
            this.horarios();
          }
          break;

        case this.horario2 === true && this.horario3 === true:
          if (this.validacionesH3() === true) {
            this.horarios();
          }
          break;
      }


    }

    horarios() {

    this.loading = true;

    var h1;
    var h2;
    var h3;

    let hor = true;
    switch (hor === true) {
      // horario 1
      case (this.mananaH1 === true && this.tardeH1 === false):
      h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: undefined,
      t_hasta: undefined, semana : this.diasH1, id_servicio: this.servicioSelect.value};
      break;

      case (this.mananaH1 === false && this.tardeH1 === true):
      h1 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH1 + ':00',
      t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.servicioSelect.value};
      break;

      case (this.mananaH1 === true && this.tardeH1 === true):
      h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: this.tardeDesdeH1 + ':00',
      t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.servicioSelect.value};
      break;
    }

    if (this.horario2 === true) {
          if (this.mananaH2 === true && this.tardeH2 === false) {
            // console.log('solo mañana 2');
          h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: undefined,
          t_hasta: undefined, semana : this.diasH2, id_servicio: this.servicioSelect.value};
          }

          if (this.mananaH2 === false && this.tardeH2 === true) {
            // console.log('solo tarde 2');
            h2 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH2 + ':00',
          t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2, id_servicio: this.servicioSelect.value};
          }

          if (this.mananaH2 === true && this.tardeH2 === true) {
            // console.log('mañana tarde 2');
            h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: this.tardeDesdeH2 + ':00',
          t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2, id_servicio: this.servicioSelect.value};
          }
        } else {
          h2 = { m_de: this.mananaDesdeH2, m_hasta: this.mananaHastaH2, t_de: this.tardeDesdeH2,
          t_hasta: this.tardeHastaH2, semana : this.diasH2, id_servicio: this.servicioSelect.value};
        }

    if (this.horario3 === true) {

          if (this.mananaH3 === true && this.tardeH3 === false) {
            h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: undefined,
                t_hasta: undefined, semana : this.diasH3, id_servicio: this.servicioSelect.value};
          }

          if (this.mananaH3 === false && this.tardeH3 === true) {
            h3 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH3  + ':00',
                t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3, id_servicio: this.servicioSelect.value};
          }

          if (this.mananaH3 === true && this.tardeH3 === true) {
            h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: this.tardeDesdeH3  + ':00',
                t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3, id_servicio: this.servicioSelect.value};
          }

        } else {
          h3 = { m_de: this.mananaDesdeH3 , m_hasta: this.mananaHastaH3 , t_de: this.tardeDesdeH3 ,
                t_hasta: this.tardeHastaH3 , semana : this.diasH3, id_servicio: this.servicioSelect.value};
        }

    let horario = [h1, h2, h3];
      // let h4 = {horario: horario};
    let horarios = horario;
      // console.log(horarios);
    let identity = this.userService.getIdentity();
    // tslint:disable-next-line: max-line-length
    let info =  [{id_sucursal: identity.id_sucursales}, { medico_id: this.medicoSelect.value, nombre: this.nombreConsultorio.value, id_sucursal : identity.id_sucursales,
        extension: this.extensionConsultorio.value, horarios, id_servicio: this.servicioSelect.value, id_provedor: identity.id_provedor }];
        // console.log(info);
    this.sucursalService.postConsultorioSucursal(info).subscribe( (response) => {
          // console.log(response);
          if (response === true) {
            this.response = true;
            document.getElementById('btn-confirmacion-eliminar-horario').click();
          }
          this.loading = false;
        }, () => {
          // console.log(err);
          this.status = 'error';
          this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
          this.loading = false;
        } );

    }


  // ------------------------------------ METODOS EDITAR CONSULTORIO -------------------------------------------------------------
 
  getConsultorioApi(idConsultorio) {
    // console.log('aquiiii oeee', idConsultorio);
    this.loading = true;
    this.sucursalService.getInfoConsultorio(idConsultorio).subscribe( (response) => {
      // console.log('info_cc', response);
      this.infoConsultorio = response[0];
      // console.log('oeeconsul',this.infoConsultorio);
      this.nombreConsultorio.setValue(this.infoConsultorio.nombre);
      this.extensionConsultorio.setValue(this.infoConsultorio.extencion);
      this.loading = false;

      // console.log('lengh',this.infoConsultorio.horario.length);
    }, (err) => {
      // console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
    } );
  }

  // getInfoConsultorio(){
  //   let consultorio = localStorage.getItem('consultorio')
  //   this.infoConsultorio = JSON.parse(consultorio);
  //   console.log(this.infoConsultorio);
  //   this.nombreConsultorio.setValue(this.infoConsultorio.nombre);
  //   this.extensionConsultorio.setValue(this.infoConsultorio.extencion);
  // }

  diasSemana() {
    let lunes = {nombre: 'lunes',  disponible: true};
    let martes = {nombre: 'martes', disponible: true};
    let miercoles = {nombre: 'miércoles', disponible: true};
    let jueves = {nombre: 'jueves', disponible: true};
    let viernes = {nombre: 'viernes', disponible: true};
    let sabado = {nombre: 'sábado', disponible: true};
    let domingo = {nombre: 'domingo', disponible: true};

    let days = [lunes, martes, miercoles, jueves, viernes, sabado, domingo];

    // tslint:disable-next-line: prefer-for-of
    for ( var i = 0; i < days.length; i++) {
      let dia = days[i];
      this.ds.push({dia});
    }

    // console.log(this.ds);
  }

  confirmacionEliminarHorario(idHorario) {
    // console.log('aqui');
    this.id_horario = idHorario;
  // console.log(id_horario)
    this.loading = true;

    this.sucursalService.getConfirmacionEliminarHorario(this.id_horario).subscribe( (response) => {
     this.loading = false;
     document.getElementById('btn-confirmacion-eliminar-horario').click();
     console.log('respuesta', response);
     if (response[0].eventH <= 0) {
      console.log('puede eliminar');
      this.confirmacion = 'true';
     } else {
       console.log('hay eventos');
       this.confirmacion = 'false';
     }

   }, () => {
     this.loading = false;
    // console.log(err);
   });
  }

  eliminarHorario() {
    window.scroll(0, 0);
    this.loading = true;
    this.sucursalService.dltHorarioConsultorio(this.id_horario).subscribe( (response) => {
      // console.log('res,eli', response);
      if (response === true) {
        localStorage.removeItem('consultorio');
        this.getConsultorioApi(this.infoConsultorio.id_consultorio);
        this.status = 'success';
        this.statusText = 'Horario eliminado exitosamente.';
      }
      this.loading = false;
    }, () => {
      // console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
    } );
  }

  // for(let i = 0; i < this.infoConsultorio.horario[1].dias.length; i++ ){

  //   let nombre = this.infoConsultorio.horario[1].dias[i].dia;
  //   for (var j = 0; j < this.ds.length; j++) {

  //     if (nombre === this.ds[j].dia.nombre) {
  //       this.ds[j].dia.disponible = false;
  //     }
  //    }
  // }


  crearHorario() {

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.infoConsultorio.horario.length; i ++) {

        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.infoConsultorio.horario[i].dias.length; j++) {
          console.log(this.infoConsultorio.horario[i].dias[j].dia);
          let nombre = this.infoConsultorio.horario[i].dias[j].dia;

            // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < this.ds.length; k++) {

                if (nombre === this.ds[k].dia.nombre) {
                  this.ds[k].dia.disponible = false;
                }
         }
      }
    }

    // console.log(this.ds);
    this.horas();
    this.consultorioForm = true;

    // document.getElementById('btn-modal-crear-horario').click();

  }

  cerrarAlerta() {
    this.status = undefined;
  }

  checktManana(ev, h) {

    if (ev.checked === true && h === 'h1') {
      this.mananaH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.mananaH1 = false;
      this.mananaDesdeH1 = undefined;
      this.mananaHastaH1 = undefined;
    }

    if (ev.checked === true && h === 'h2') {
      this.mananaH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.mananaH2 = false;
      this.mananaHastaH2 = undefined;
      this.mananaDesdeH2 = undefined;
    }

    if (ev.checked === true && h === 'h3') {
      this.mananaH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.mananaH3 = false;
      this.mananaDesdeH3 = undefined;
      this.mananaHastaH3 = undefined;
    }
  }

  horas() {
    this.horasDesdeHastaManana = [
      { hora : '6 a.m', value : '6:00' },
      { hora : '7 a.m', value : '7:00' },
      { hora : '8 a.m', value : '8:00' },
      { hora : '9 a.m', value : '9:00' },
      { hora : '10 a.m', value : '10:00' },
      { hora : '11 a.m', value : '11:00' },
      { hora : '12 a.m', value : '12:00' },
    ];

    this.horasDesdeHastaTarde = [
      { hora : '1 p.m', value : '13:00' },
      { hora : '2 p.m', value : '14:00' },
      { hora : '3 p.m', value : '15:00' },
      { hora : '4 p.m', value : '16:00' },
      { hora : '5 p.m', value : '17:00' },
      { hora : '6 p.m', value : '18:00' },
      { hora : '7 p.m', value : '19:00' },
    ];
  }

  diasHorario1(ev) {
    this.diasH1 = ev.value;
  }

  horasHorarios(ev, info) {
    // console.log(ev, info);

    // H1

    if (info === 'mdesde_h1') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH1 = parseInt(ev.value);
      // console.log(this.mananaDesdeH1);
    }

    if (info === 'mhasta_h1') {
      // tslint:disable-next-line:radix
      this.mananaHastaH1 = parseInt(ev.value);
      // console.log(this.mananaHastaH1);
    }

    if (info === 'tdesde_h1') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH1 = parseInt(ev.value);
      // console.log(this.tardeDesdeH1);
    }

    if (info === 'thasta_h1') {
      // tslint:disable-next-line:radix
      this.tardeHastaH1 = parseInt(ev.value);
      // console.log(this.tardeHastaH1);
    }

    // H2

    if (info === 'mdesde_h2') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH2 = parseInt(ev.value);
    }

    if (info === 'mhasta_h2') {
      // tslint:disable-next-line:radix
      this.mananaHastaH2 = parseInt(ev.value);
    }

    if (info === 'tdesde_h2') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH2 = parseInt(ev.value);
    }

    if (info === 'thasta_h2') {
      // tslint:disable-next-line:radix
      this.tardeHastaH2 = parseInt(ev.value);
    }


    // H3

    if (info === 'mdesde_h3') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH3 = parseInt(ev.value);
    }

    if (info === 'mhasta_h3') {
      // tslint:disable-next-line:radix
      this.mananaHastaH3 = parseInt(ev.value);
    }

    if (info === 'tdesde_h3') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH3 = parseInt(ev.value);
    }

    if (info === 'thasta_h3') {
      // console.log('aquiii');
      // tslint:disable-next-line:radix
      this.tardeHastaH3 = parseInt(ev.value);
      // console.log(this.tardeHastaH3);
    }
  }

  checktTarde(ev, h) {
    if (ev.checked === true && h === 'h1') {
      this.tardeH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.tardeH1 = false;
      this.tardeDesdeH1 = undefined;
      this.tardeHastaH1 = undefined;
    }

    if (ev.checked === true && h === 'h2') {
      this.tardeH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.tardeH2 = false;
      this.tardeDesdeH2 = undefined;
      this.tardeHastaH2 = undefined;
    }

    if (ev.checked === true && h === 'h3') {
      this.tardeH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.tardeH3 = false;
      this.tardeDesdeH3 = undefined;
      this.tardeHastaH3 = undefined;
    }
  }

   // Dias seleccionados en el horario 2
   diasHorario2(ev) {
    this.diasH2 = ev.value;
    // console.log(this.diasH2);
  }

  // Dias seleccionados en el horario 3
  diasHorario3(ev) {
    this.diasH3 = ev.value;
    // console.log(this.diasH3);
  }

  validacionesH1(): boolean {
    // console.log(this.mananaH1, this.tardeH1);

    // console.log('aqui val1')

    if (this.diasH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 1.';
        return false;
    } else {

      let val = true;
      switch (val === true) {

      case (this.mananaH1 === true && this.tardeH1 === false) :
      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          // console.log('<aqui>');
          return false;
        } else {
          return true;
        }
      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === true) :
      if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
          this.status = 'warning';
          this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 1.';
          return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH1 > this.tardeHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {
          return true;
        }
      }
      break;

      case (this.mananaH1 === true && this.tardeH1 === true) :

      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 1.';
        return false;
      } else {

        // console.log(this.tardeDesdeH1, this.tardeHastaH1);
        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          return false;
        } else if (this.tardeDesdeH1 > this.tardeHastaH1) {
          // console.log('aquiii');
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {
          return true;
        }

      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === false) :
      // console.log('aqui');
      this.status = 'warning';
      this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
      return false;
      break;
    }

    }
  }

  guardarHorario() {

    if (this.validacionesH1() === true) {
      this.loading = true;
      // console.log('too bn');


      let h1;

      if (this.mananaH1 && !this.tardeH1) {
        h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: undefined,
        t_hasta: undefined, semana : this.diasH1, id_servicio: this.infoConsultorio.id_servicios,
        id_sucursal : this.infoConsultorio.id_sucursales, id_consul : this.infoConsultorio.id_consultorio};
        // console.log('mana s tarde n', h1);
      }

      if (!this.mananaH1 && this.tardeH1) {
        h1 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH1 + ':00',
        t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.infoConsultorio.id_servicios,
        id_sucursal : this.infoConsultorio.id_sucursales, id_consul : this.infoConsultorio.id_consultorio};
        // console.log('mana n tarde s', h1);
      }

      if(this.mananaH1 && this.tardeH1) {
        h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: this.tardeDesdeH1 + ':00',
        t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.infoConsultorio.id_servicios,
        id_sucursal : this.infoConsultorio.id_sucursales, id_consul : this.infoConsultorio.id_consultorio};
        // console.log('mana s tarde s', h1);
      }

      // console.log(h1);
      this.sucursalService.postEnviarHorario(h1).subscribe( (response) => {
        // console.log(response);
        this.loading = false;
        if (response === true) {
           this.mananaH1 = false;
           this.tardeH1 = false;
           this.consultorioForm = false;
           this.diasH1 = undefined;
           this.mananaDesdeH1 = undefined;
           this.mananaHastaH1 = undefined;
           this.tardeDesdeH1 = undefined;
           this.tardeHastaH1 = undefined;
           this.getConsultorioApi(this.id_consultorio);
        }

      }, () => {
        // console.log();
        this.status = 'error';
        this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde';
        this.loading = false;
      } );

    }
    // else {
    //   console.log('too mal');
    // }
  }

  cancelarHorario() {
      this.mananaH1 = false;
      this.tardeH1 = false;
      this.consultorioForm = false;
      this.diasH1 = undefined;
      this.mananaDesdeH1 = undefined;
      this.mananaHastaH1 = undefined;
      this.tardeDesdeH1 = undefined;
      this.tardeHastaH1 = undefined;
  }

  guardarInformacion(){

    this.loading = true;
    let info = {nombre: this.nombreConsultorio.value, extencion : this.extensionConsultorio.value,
                id_consultorio : this.infoConsultorio.id_consultorio};

    this.sucursalService.editInfoConsultorio(info).subscribe( (response) => {
      // console.log(response);
      this.loading = false;

      if(response === true) {
        this.status = 'success';
        this.statusText = 'Datos cambiados exitosamente.';
      }
    }, (err) => {
      // console.log(err);
      this.status = 'err';
      this.statusText = 'Error en la conexion, por favor revisa la conexion o intentalo mas tarde.';
      this.loading = false;
    } );
  }

  pestana(model) {
    this.mymodel = model;

    if (model === 'informacion') {
      document.getElementById('informacion').className = 'list-group-item active';
      document.getElementById('horarios').className = 'list-group-item';
    }

    if (model === 'horarios') {
      document.getElementById('informacion').className = 'list-group-item';
      document.getElementById('horarios').className = 'list-group-item active';
    }

  }

}
