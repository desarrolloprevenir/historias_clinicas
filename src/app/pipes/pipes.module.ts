import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { HoraPipe } from './hora.pipe';
import { AmpmPipe } from './ampm.pipe';
import { BusquedaPipe } from './busqueda.pipe';
import { BusquedaMedPipe } from './busquedaMed.pipe';



@NgModule({
  declarations: [FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe,
    BusquedaMedPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe,
    BusquedaMedPipe
  ]
})
export class PipesModule { }
