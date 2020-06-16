import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentesModule } from './components/componentes.module';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// GUARDS
import { UserGuard } from './services/user.guard';
import { UserAdmin } from './services/user_admin.guard';
import { UserSucursal } from './services/user_sucursal.guard';
import { UserMedico } from './services/user_medico.guard';
import { SucursalMedico } from './services/sucursal_medico.guard';
import { AdminSucursal } from './services/admin_sucursal.guard';

// MODULO PIPES
import { PipesModule } from './pipes/pipes.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// RECORTE IMAGENES
import { ImageCropperModule } from 'ngx-image-cropper';




// recarga
// import {LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentesModule,
    HttpClientModule,
    PipesModule,
    ImageCropperModule,
    RouterModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    UserGuard,
    UserAdmin,
    UserMedico,
    UserSucursal,
    SucursalMedico,
    AdminSucursal
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
