import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { HoraPipe } from './hora.pipe';
import { AmpmPipe } from './ampm.pipe';
import { BusquedaPipe } from './busqueda.pipe';



@NgModule({
  declarations: [FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    HoraPipe,
    AmpmPipe,
    BusquedaPipe
  ]
})
export class PipesModule { }
