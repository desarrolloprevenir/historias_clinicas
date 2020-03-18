import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaCodOdonto'
})
export class BusquedaCodOdontoPipe implements PipeTransform {

  transform(arreglo: any[],
            texto: string): any {

    if (!texto) {
      return arreglo;
    }

    texto = texto.toLocaleLowerCase();
    return arreglo = arreglo.filter((odonto) => {
      return (odonto.codigo.toLowerCase().indexOf(texto.toLowerCase()) > -1 ||
        odonto.nombre.toLowerCase().indexOf(texto.toLowerCase()) > -1);
    });

  }

}
