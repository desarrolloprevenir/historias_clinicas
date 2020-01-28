import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaMed'
})
export class BusquedaMedPipe implements PipeTransform {
  recetaMedica: [''];

  transform(arreglo: any[], texto: string): any {
    if (!texto) {
      return arreglo;
    }

    texto = texto.toLocaleLowerCase();
    return arreglo = arreglo.filter((medi) => {
      return(medi.producto.toLowerCase().indexOf(texto.toLowerCase()) > -1 ||
      medi.via_administra.toLowerCase().indexOf(texto.toLowerCase()) > -1 );
    });

  }

}
