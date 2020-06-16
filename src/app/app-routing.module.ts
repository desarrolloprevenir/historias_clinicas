import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTES
import { LoginComponent } from './components/aplicacion/login/login.component';
import { RegistroComponent } from './components/aplicacion/registro/registro.component';
import { OlvidoContraseniaComponent } from './components/aplicacion/olvido-contrasenia/olvido-contrasenia.component';
import { TerminosYCondicionesComponent } from './components/aplicacion/terminos-y-condiciones/terminos-y-condiciones.component';
import { HomeComponent } from './components/aplicacion/home/home.component';
import { ConfirmarCuentaComponent } from './components/aplicacion/confirmar-cuenta/confirmar-cuenta.component';
import { GestionarPublicacionesComponent } from './components/aplicacion/gestionar-publicaciones/gestionar-publicaciones.component';
import { GestionarMedicosComponent } from './components/admin/gestionar-medicos/gestionar-medicos.component';
import { GestionarConsultoriosComponent } from './components/sucursal/gestionar-consultorios/gestionar-consultorios.component';
import { ContactenosComponent } from './components/aplicacion/contactenos/contactenos.component';
import { BuscarCitaComponent } from './components/aplicacion/buscar-cita/buscar-cita.component';
import { ConsultorioComponent } from './components/sucursal/consultorio/consultorio.component';
import { PerfilComponent } from './components/aplicacion/perfil/perfil.component';
import { CalendarioComponent } from './components/aplicacion/calendario/calendario.component';
import { HistorialCitasMedicoComponent } from './components/medico/historial-citas-medico/historial-citas-medico.component';
import { MisServiciosComponent } from './components/aplicacion/mis-servicios/mis-servicios.component';
import { ListadoPacientesComponent } from './components/medico/listado-pacientes/listado-pacientes.component';
import { GestionarSucursalesComponent } from './components/aplicacion/gestionar-sucursales/gestionar-sucursales.component';
import { CrearSucursalComponent } from './components/admin/crear-sucursal/crear-sucursal.component';
import { VerPerfilMedicoComponent } from './components/medico/ver-perfil-medico/ver-perfil-medico.component';
import { CrearPublicacionComponent } from './components/aplicacion/crear-publicacion/crear-publicacion.component';
import { HistoriaClinicaComponent } from './components/medico/historia-clinica/historia-clinica.component';
import { VisiometriaComponent } from './components/medico/visiometria/visiometria.component';
import { HitorialCitasComponent } from './components/admin/hitorial-citas/hitorial-citas.component';
import { VerInventarioComponent } from './components/aplicacion/ver-inventario/ver-inventario.component';
import { HistoriaGeneralComponent } from './components/medico/historia-general/historia-general.component';
import { PreciosInventarioComponent } from './components/sucursal/precios-inventario/precios-inventario.component';


// Este servicio sirve para restringuir el acceso a los usuarios no authentificados.
import { UserGuard } from './services/user.guard';
import { UserAdmin } from './services/user_admin.guard';
import { UserSucursal } from './services/user_sucursal.guard';
import { SucursalMedico } from './services/sucursal_medico.guard';
import { UserMedico } from './services/user_medico.guard';
import { AdminSucursal } from './services/admin_sucursal.guard';
import { AgregarLenteComponent } from './components/aplicacion/agregar-lente/agregar-lente.component';

import { HistOdComponent } from './components/odontologia/hist-od/hist-od.component';


const routes: Routes = [
  {path: '', component : LoginComponent},
  {path : 'login', component: LoginComponent},
  {path : 'registro', component: RegistroComponent},
  {path : 'visiometria', component: VisiometriaComponent},
  {path : 'recuperar-cuenta', component: OlvidoContraseniaComponent},
  {path : 'terminos-y-condiciones', component: TerminosYCondicionesComponent},
  {path : 'home', component: HomeComponent, canActivate: [UserGuard]},
  {path : 'confirmar-cuenta', component: ConfirmarCuentaComponent},
  {path : 'publicaciones', component: GestionarPublicacionesComponent, canActivate: [UserGuard]},
  {path : 'medicos', component: GestionarMedicosComponent, canActivate: [UserGuard, UserAdmin]},
  {path : 'consultorios', component: GestionarConsultoriosComponent, canActivate: [UserGuard, UserSucursal]},
  {path : 'contactenos', component: ContactenosComponent, canActivate: [UserGuard] },
  {path : 'terminosycondiciones', component: TerminosYCondicionesComponent, canActivate: [UserGuard] },
  {path : 'buscarcita', component: BuscarCitaComponent, canActivate: [UserGuard] },
  {path : 'consultorio/:id', component: ConsultorioComponent, canActivate: [UserGuard] },
  {path : 'consultorio', component: ConsultorioComponent, canActivate: [UserGuard] },
  {path : 'perfil', component: PerfilComponent, canActivate: [UserGuard] },
  {path : 'calendario', component: CalendarioComponent, canActivate: [UserGuard, SucursalMedico] },
  {path : 'historial-citas', component: HistorialCitasMedicoComponent, canActivate: [UserGuard] },
  {path : 'mis-servicios', component: MisServiciosComponent, canActivate: [UserGuard] },
  // {path : 'apropublicaciones', component: AprobarPublicacionesComponent, canActivate: [UserGuard] },
  // {path : 'contactenosroot', component: ContactenosRootComponent, canActivate: [UserGuard] },
  {path : 'gestionar-pacientes', component: ListadoPacientesComponent, canActivate: [UserGuard, UserMedico]},
  {path : 'gestionar-sucursales', component: GestionarSucursalesComponent, canActivate: [UserGuard, UserAdmin]},
  {path : 'crear-sucursal', component: CrearSucursalComponent, canActivate: [UserGuard, UserAdmin]},
  {path : 'editar-sucursal/:id_sucursal', component: CrearSucursalComponent, canActivate: [UserGuard, UserAdmin]},
  {path : 'gestionar-pacientes/:cedula', component: ListadoPacientesComponent, canActivate: [UserGuard, UserMedico]},
  {path : 'vermedico/:id', component: VerPerfilMedicoComponent, canActivate: [UserGuard]},
  {path : 'crear-publicacion', component: CrearPublicacionComponent, canActivate: [UserGuard]},
  {path : 'historia-clinica/:id/:id_servicio/:idCategoria', component: HistoriaClinicaComponent, canActivate: [UserGuard, UserMedico]},
  {path : 'historia-general/:idCategoria', component: HistoriaGeneralComponent, canActivate: [UserGuard, UserMedico]},
  {path : 'precios-e-inventario', component: PreciosInventarioComponent, canActivate: [UserGuard, AdminSucursal]},
  {path : 'inventario/:idCategoria', component: VerInventarioComponent, canActivate: [UserGuard, AdminSucursal]},
  {path : 'estadisticas-historial', component: HitorialCitasComponent, canActivate: [UserGuard, AdminSucursal]},
  {path : 'agregar-lente/:idCategoria', component: AgregarLenteComponent, canActivate: [UserGuard, AdminSucursal]},
  {path: '**', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
