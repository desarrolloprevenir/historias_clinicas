import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { HoraPipe } from './hora.pipe';
import { AmpmPipe } from './ampm.pipe';
import { BusquedaPipe } from './busqueda.pipe';
import { BusquedaMedPipe } from './busquedaMed.pipe';
import { BusquedaCodOdontoPipe } from './busqueda-cod-odonto.pipe';



@NgModule({
  declarations: [FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe,
    BusquedaMedPipe,
    BusquedaCodOdontoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe,
    BusquedaMedPipe,
    BusquedaCodOdontoPipe
  ]
})
export class PipesModule { }
