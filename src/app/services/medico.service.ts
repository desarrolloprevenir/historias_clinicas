import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

const headers = new HttpHeaders().set('Content-Type', 'application/json');
const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(public http: HttpClient) { }

  // METODOS GET

  // Obtener la informacion del medico a travez de su id
  getInfoMedico(id) {
    return this.http.get(apiUrl + '/medicosm/' + id , {headers});
  }

  // Ruta para pedir las citas activas
  getCitasActivas(idMedico) {
    return this.http.get(apiUrl + '/citasmedac/' + idMedico , {headers});
  }

  // Consultar si un medico existe o no a traves de la cedula
  getMedico(cedula): Observable<any> {
    return this.http.get(apiUrl + '/medicosc/' + cedula, {headers});
  }

  // Ruta para ver los servicios que tiene un medico
  getServicios(idMedico) {
    return this.http.get(apiUrl + '/medicospr/' + idMedico , {headers});
}

 // Ruta para obtener las citas del medico.
 getHistorialCitasCalendar(mes, anio, idMedico, idCategoria, idConsultorio) {
  return this.http.get(apiUrl + '/histmed/' + mes + '/' + anio + '/' + idMedico + '/' + idCategoria + '/' + idConsultorio , {headers});
}

 // ruta para obtener los comentarios por servicio de un medico
 getComentarioMedico(idServicio , idCategoria, idMedico) {
  // console.log(idServicio, idCategoria, idMedico);
    return this.http.get(apiUrl + '/comentmed/' + idServicio + '/' + idCategoria + '/' + idMedico, {headers});
  }

  // Ruta para obtener historias clinicas de usuario por cedula
  getHistoriasClinicaPorUsuario(idMedico, cedula) {
    return this.http.get(apiUrl + '/histusuced/' + idMedico + '/' + cedula , {headers});
  }

  getActiveHist(idServicio) {
    return this.http.get(apiUrl + '/activhist/' + idServicio, {headers});
  }

  // Ruta para pedir historia clinica General
  getHistoriaClinicaGeneral(idUsuario, idServicio): Observable<any> {
    return this.http.get(apiUrl + '/darhistclinica/' + idUsuario + '/' + idServicio , {headers});
  }

  // Ruta para obtener historia clinica por idHistoriaClinica
  getHistoriaGeneral2(idHistoriaClinica): Observable<any> {
    // console.log(idHistoriaClinica);
    return this.http.get(apiUrl + '/darhistcf/' + idHistoriaClinica, {headers});
  }

  // Ruta para ver historias clinicas usuario por servicio
  getHistoriaClinicaPorServicio(idUsuario, idServicio): Observable<any> {
    return this.http.get(apiUrl + '/histserusu/' + idUsuario + '/' + idServicio , {headers});
  }

  // METODOS DELETE

   // Borrar medico por provedor

   dltMedicoPorProvedor(medicoId, provedorId, token): Observable<any> {
    return this.http.delete(apiUrl + '/medico/' + medicoId + '/' + provedorId + '?token=' + token , {headers});
    }

  // METODOS POST

   // Agregar medico desde provedor
   postAgregarMedicos(info, token): Observable<any> {
    return this.http.post(apiUrl + '/medicos/' + '?token=' + token, info, {headers});
    }

    // RUTA PARA GUARDAR HISTORIAS CLINICAS
    postHistoriasClinicas(info) {
      return this.http.post(apiUrl + '/histclinica/', info, {headers});
     }

// METODOS PUT

// Editar datos del medico
editInfoMedico(info, token) {
  // console.log('medico service');
  return this.http.put(apiUrl + '/medico/' + '?token=' + token , info, {headers});
}

 // ruta para dar respuestas a los comentarios por parte del medico.
 respuestaComentarioMedico(info): Observable<any>  {
  return this.http.put(apiUrl + '/comentmed' , info, {headers});
}

// Ruta para enviar historia medica de optica
putHistoriaClinica(info): Observable<any> {
  return this.http.put(apiUrl + '/opticausu' , info, {headers});
}

}
