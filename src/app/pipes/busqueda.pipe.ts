import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {

transform(arreglo: any[],
          texto: string): any {
// console.log(arreglo);
// console.log(texto);

if (!texto) {
return arreglo;
}

texto = texto.toLocaleLowerCase();
return arreglo = arreglo.filter((servicio) => {
// console.log('arr', arreglo);

return (servicio.nombre.toLowerCase().indexOf(texto.toLowerCase()) > -1  ||
  servicio.rips.toLowerCase().indexOf(texto.toLowerCase()) > -1 );

// if (!ar) {
//         console.log('aqui', ar);
//         return [{vacio : true}];
//       } else {
//         return ar;
//       }
});
}

}
