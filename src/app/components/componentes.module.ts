import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './aplicacion/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { RegistroComponent } from './aplicacion/registro/registro.component';
import { OlvidoContraseniaComponent } from './aplicacion/olvido-contrasenia/olvido-contrasenia.component';
import { TerminosYCondicionesComponent } from './aplicacion/terminos-y-condiciones/terminos-y-condiciones.component';
import { BarraNavegacionComponent } from './aplicacion/barra-navegacion/barra-navegacion.component';
import { HomeComponent } from './aplicacion/home/home.component';
import { SlidersComponent } from './aplicacion/sliders/sliders.component';
import { BuscarCitaComponent } from './aplicacion/buscar-cita/buscar-cita.component';
import { ConfirmarCuentaComponent } from './aplicacion/confirmar-cuenta/confirmar-cuenta.component';

// PIPES MODULE
import { PipesModule } from '../pipes/pipes.module';
import { GestionarPublicacionesComponent } from './aplicacion/gestionar-publicaciones/gestionar-publicaciones.component';
import { GestionarMedicosComponent } from './admin/gestionar-medicos/gestionar-medicos.component';
import { GestionarConsultoriosComponent } from './sucursal/gestionar-consultorios/gestionar-consultorios.component';
import { ContactenosComponent } from './aplicacion/contactenos/contactenos.component';
import { ConsultorioComponent } from './sucursal/consultorio/consultorio.component';

// ANGULAR MATERIAL
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatAutocompleteModule, MatRadioModule, MatChipsModule, MatIconModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { PerfilComponent } from './aplicacion/perfil/perfil.component';
import { CalendarioComponent } from './aplicacion/calendario/calendario.component';

// Calendario

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import { FlatpickrModule } from 'angularx-flatpickr';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { HistorialCitasMedicoComponent } from './medico/historial-citas-medico/historial-citas-medico.component';
import { MisServiciosComponent } from './aplicacion/mis-servicios/mis-servicios.component';
import { ListadoPacientesComponent } from './medico/listado-pacientes/listado-pacientes.component';
import { GestionarSucursalesComponent } from './aplicacion/gestionar-sucursales/gestionar-sucursales.component';
import { CrearSucursalComponent } from './admin/crear-sucursal/crear-sucursal.component';
import { VerPerfilMedicoComponent } from './medico/ver-perfil-medico/ver-perfil-medico.component';
import { CrearPublicacionComponent } from './aplicacion/crear-publicacion/crear-publicacion.component';

registerLocaleData(localeEs);

// recorte imagenes
import { ImageCropperModule } from 'ngx-image-cropper';
import { HistoriaClinicaComponent } from './medico/historia-clinica/historia-clinica.component';
import { HistoriaGeneralComponent } from './medico/historia-general/historia-general.component';
import { BarraLateralComponent } from './medico/barra-lateral/barra-lateral.component';
import { HistoriaOptometriaComponent } from './medico/historia-optometria/historia-optometria.component';
import { HstGeneralComponent } from './medico/hst-general/hst-general.component';
import { VisiometriaComponent } from './medico/visiometria/visiometria.component';
import { ModalOptometriaComponent } from './medico/modales-historias-clinicas/modal-optometria/modal-optometria.component';
import { ModalGeneralComponent } from './medico/modales-historias-clinicas/modal-general/modal-general.component';
import { PreciosInventarioComponent } from './sucursal/precios-inventario/precios-inventario.component';
import { CalendarioReutilizableComponent } from './aplicacion/calendario-reutilizable/calendario-reutilizable.component';
import { HitorialCitasComponent } from './admin/hitorial-citas/hitorial-citas.component';
import { AlertasComponent } from './aplicacion/alertas/alertas.component';
import { VerInventarioComponent } from './aplicacion/ver-inventario/ver-inventario.component';
import { LoadingComponent } from './aplicacion/loading/loading.component';
import { ModalCambioAvatarComponent } from './aplicacion/modal-cambio-avatar/modal-cambio-avatar.component';
import { HistOdComponent } from './odontologia/hist-od/hist-od.component';
import { AgregarLenteComponent } from './aplicacion/agregar-lente/agregar-lente.component';
import { PerfilProfesionalComponent } from './medico/perfil-profesional/perfil-profesional.component';



@NgModule({
  declarations: [
  LoginComponent,
  RegistroComponent,
  OlvidoContraseniaComponent,
  TerminosYCondicionesComponent,
  BarraNavegacionComponent,
  HomeComponent,
  SlidersComponent,
  BuscarCitaComponent,
  ConfirmarCuentaComponent,
  GestionarPublicacionesComponent,
  GestionarMedicosComponent,
  GestionarConsultoriosComponent,
  ContactenosComponent,
  ConsultorioComponent,
  PerfilComponent,
  CalendarioComponent,
  HistorialCitasMedicoComponent,
  MisServiciosComponent,
  ListadoPacientesComponent,
  GestionarSucursalesComponent,
  CrearSucursalComponent,
  VerPerfilMedicoComponent,
  CrearPublicacionComponent,
  HistoriaClinicaComponent,
  HistoriaGeneralComponent,
  BarraLateralComponent,
  HistoriaOptometriaComponent,
  HstGeneralComponent,
  VisiometriaComponent,
  ModalOptometriaComponent,
  ModalGeneralComponent,
  PreciosInventarioComponent,
  CalendarioReutilizableComponent,
  HitorialCitasComponent,
  AlertasComponent,
  VerInventarioComponent,
  LoadingComponent,
  ModalCambioAvatarComponent,
  HistOdComponent,
  AgregarLenteComponent,
  PerfilProfesionalComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PipesModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule, MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports : [
    LoginComponent,
  RegistroComponent,
  OlvidoContraseniaComponent,
  TerminosYCondicionesComponent,
  BarraNavegacionComponent,
  HomeComponent,
  SlidersComponent,
  BuscarCitaComponent,
  ConfirmarCuentaComponent,
  GestionarPublicacionesComponent,
  GestionarMedicosComponent,
  GestionarConsultoriosComponent,
  ContactenosComponent,
  ConsultorioComponent,
  PerfilComponent,
  CalendarioComponent,
  HistorialCitasMedicoComponent,
  MisServiciosComponent,
  ListadoPacientesComponent,
  GestionarSucursalesComponent,
  CrearSucursalComponent,
  VerPerfilMedicoComponent,
  CrearPublicacionComponent,
  HistoriaClinicaComponent,
  HistoriaGeneralComponent,
  BarraLateralComponent,
  HistoriaOptometriaComponent,
  HstGeneralComponent,
  ModalOptometriaComponent,
  ModalGeneralComponent,
  PreciosInventarioComponent,
  CalendarioReutilizableComponent,
  HitorialCitasComponent,
  AlertasComponent,
  VerInventarioComponent,
  LoadingComponent,
  HistOdComponent,
  ModalCambioAvatarComponent,
  AgregarLenteComponent
  ]
})
export class ComponentesModule { }
