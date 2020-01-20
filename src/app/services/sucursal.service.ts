import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

const headers = new HttpHeaders().set('Content-Type', 'application/json');
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
}) 
export class SucursalService {

  constructor(public http: HttpClient) { }

  // METODOS GET

  // Ruta para pedir informacion al logearse de la sucursal
   getIdentitySucursal(idMember): Observable<any> {
    return this.http.get(apiUrl + '/sucumem/' + idMember , {headers});
}

// Ruta para obtener consultorios con su medico segun el servicio de una sucursal
getConsultoriosSegunServicio(idSucursales, idServicio) {
  return this.http.get(apiUrl + '/consulsucse/' + idSucursales + '/' + idServicio  , {headers } );
}

// Ruta para obtener los consultorios que hay en una sucursal
getConsultorios(idSucursales) {
  return this.http.get(apiUrl + '/consulsuc/' + idSucursales , {headers});
}

 // Ruta para saber si hay citas en un consultorio antes de eliminarlo
 getEventsConsul(idConsultorio){
  return this.http.get(apiUrl + '/eventsco/' + idConsultorio, {headers});
}

// Ruta para pedir informacion de un consultorio
getInfoConsultorio(idConsultorio) {
  return this.http.get(apiUrl + '/consultorioid/' + idConsultorio, {headers});
}

// Ruta para saber si un horario tiene citas o no
getConfirmacionEliminarHorario(idHorario) {
  return this.http.get(apiUrl + '/exevents/' + idHorario , {headers});
}

// Ruta para pedir informacion de una sucursal a traves de su id
getInfoSucursal(idSucursal) {
  return this.http.get(apiUrl + '/sucursal/' + idSucursal , {headers});
}

// Ruta para pedir informacion de los servicios que pesta una sucursal
getServiciosSucursal(idSucursal) {
  return this.http.get(apiUrl + '/serviciosuc/' + idSucursal , {headers});
}

// Ruta para pedir el historial de citas de una sucursal y consultorio
getHistorialSucursal(mes, anio, idServicio, idCategoria, idSucursal, idConsultorio) {
  // tslint:disable-next-line: max-line-length
  return this.http.get(apiUrl + '/histsuc/' + mes + '/' + anio + '/' + idServicio + '/' + idCategoria + '/' + idSucursal  + '/'  + idConsultorio, {headers : headers});
}

// Ruta para obtener las citas sugun un servicio en la sucursal
getEventsSucursal(mes, anio, idServicio, idSucursal, idCategoria, idConsultorio) {
  // console.log('peticion ev sucu');
  // tslint:disable-next-line: max-line-length
  return this.http.get(apiUrl + '/eventsuc/' + mes + '/' + anio + '/' + idServicio + '/'+ idSucursal + '/' + idCategoria + '/' + idConsultorio, {headers : headers} ); 
}



// METODOS DELETE

 // Ruta para eliminar el horario de un consultorio
 dltHorarioConsultorio(idHorario) {
  return this.http.delete(apiUrl + '/delhorario/' + idHorario, {headers});
}


// METODOS PUT

 // Ruta para eliminar consultorio
 dltConsultorio(idConsultorio) {
  return this.http.put(apiUrl + '/delconsul/' + idConsultorio, {headers});
}

dltSucursal(idSucursal) {
  return this.http.delete(apiUrl + '/sucursal/' + idSucursal,{headers});
}

// Ruta para actualizar los datos del consultorio
editInfoConsultorio(info) {
  return this.http.put(apiUrl + '/consultorio/', info , {headers});
}

// METODOS POST
// Ruta para crear un consultorio a traves de la sucursal
postConsultorioSucursal(info) {
  return this.http.post(apiUrl + '/addconsul/', info, {headers});
}

// Ruta para enviar horario
postEnviarHorario(info) {
  return this.http.post(apiUrl + '/horario', info, {headers});
}

 // Ruta para editar los datos de una sucursal
 editInfoSucursal(info) {
  return this.http.put(apiUrl + '/sucursal/', info , {headers});
}


}
