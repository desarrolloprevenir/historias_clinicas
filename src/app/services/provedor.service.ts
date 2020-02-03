import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

const headers = new HttpHeaders().set('Content-Type', 'application/json');
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProvedorService {

  constructor(public http: HttpClient) { }

   // METODOS POST

      // Login
      postLogin(email , pssw) {

        let datos = {email, pssw };
        return this.http.post<{login, esAdmin, id_usuario, id_member, token}>(apiUrl + '/login', datos, {headers});
    }

    // Registrar un provedor
    registerProvedor(datos): Observable<any> {
      return this.http.post(apiUrl + '/register', datos , {headers});
    }

    postCitasProvedor(info, token): Observable <any> {
      return this.http.post(apiUrl + '/citai/' + '?token=' + token, info, {headers});

    }

    // Ruta para pasar una cita a activa
    postCita(info): Observable<any> {
      return  this.http.post(apiUrl + '/activacita', info, {headers});
     }

     // Ruta para enviar las imagenes de edicion de un servicio
     enviarFotosEditServicio(imgs): Observable<any> {
      return this.http.post(apiUrl + '/infotoser', imgs, {headers});
    }

     //  Ruta para crear sucursal
     crearSucursal(info) {
      return  this.http.post(apiUrl + '/addsucon', info, {headers});
    }


    // METODOS GET

    // Obtener los datos de un provedor a traves del id
    getIdentity(id): Observable<any> {
      return this.http.get(apiUrl + '/provedores/' + id , {headers});
  }

  // Ruta para consultar
  ordenCita(cedula, idProvedor): Observable<any> {
    return this.http.get(apiUrl + '/ordencita/' + cedula + '/' + idProvedor, {headers});
  }

  // Get citas activas

  getCitasActivas(idSucursales): Observable<any> {
    return this.http.get(apiUrl + '/citasprovac/' + idSucursales, {headers});
   }

   // Obtener las publicaciones de un provedor
   getPublications(id): Observable<any> {
    return this.http.get(apiUrl + '/services/' + id, {headers});
  }

  // Obtener los medicos del provedor

  getMedicosProvedor(id): Observable<any> {
    return this.http.get(apiUrl + '/medicos/' + id, {headers});
}

 // Ruta para obtener la informacion de una publicacion para ser editada.
 getInfoEditar(id): Observable <any> {
  return this.http.get(apiUrl + '/sservicio/' + id , {headers});
}

// Ruta para obtener las imagenes del servicio
getFotosServicio(id) {
  return this.http.get(apiUrl + '/fotosser/' + id);
}

 // Ruta para obtener los datos de una mascota

 getMascotaInfo(idProvedor): Observable <any> {
  return this.http.get(apiUrl + '/mascotam/' + idProvedor);
}

// Ruta para obtener el horaio segun cada servicio
getHorario(fecha, idConsultorio, idCategoria): Observable<any> {
  return this.http.get(apiUrl + '/servcitas/' + fecha + '/' + idConsultorio + '/' + idCategoria);
}

// Ruta para pedir los eventos que tiene cada servicio
getEventos(mes, anio, idServicio, idCategoria): Observable <any> {
  // console.log('aqui events 4');
  return this.http.get(apiUrl + '/eventser/' + mes + '/' + anio + '/' + idServicio + '/' + idCategoria, );
}

// Ruta para pedir el historial de citas para provedor
getHistorialCitas(mes, anio, idCategoria, idServicio){
  return this.http.get(apiUrl + '/histser/' + mes + '/' + anio + '/' + idCategoria + '/' + idServicio, {headers});
 }

 // Ruta para pedir las sucursales del provedor
 getSucursales(idProvedor) {
  return this.http.get(apiUrl + '/sucursales/' + idProvedor, {headers});
}

// Ruta para pedir los consultorios de una sucursal
getConsultoriosSucursal(idSucursal) {
  return this.http.get(apiUrl + '/consulsuc/' + idSucursal, {headers});
}

 // Ruta para saber si un usuario esta registrado o no para sacar uan cita a travez de su
    // cedula y obtener su informacion en caso de que exista.
    // bol = true; sacar cita por veterinario veteninario
    cedula(cedula, bol) {
      return this.http.get(apiUrl + '/cedula/' + cedula + '/' + bol);
    }


  // METODOS DELETE

  // Ruta para borrar una cita de provedor
  dltCitaProvedor(idEventos, idConsultorio, idCategoria , token): Observable <any> {
    return this.http.delete(apiUrl + '/eventss/' + idEventos + '/' + idConsultorio + '/'
                            + idCategoria + '?token=' + token , {headers});

   }

   // Ruta para eliminar las imagenes de un servicio
   dltImagenServicio(id, ruta): Observable<any> {
    return this.http.delete(apiUrl + '/elmfotoser/' + id, {headers});

 }

  // Ruta para eliminar un servicio
  dltService(id, token): Observable<any> {
    return  this.http.delete(apiUrl + '/services/' + id + '?token=' + token , {headers});

  }


  //  METODOS PUT

   // cambiar el estado de las citas
   putCambiarEstadoCitas(idCita, idServicio, idCategoria): Observable<any> {
    return this.http.put(apiUrl + '/cambestado/' + idCita + '/' + idServicio + '/' + idCategoria , {headers});
   }

   // Ruta para finalizar una cita, fue 0 = cancelada, fue 1 finalizada
   putFinalizarCita(idCategoria, idCita, fue): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(apiUrl+ '/fincita/' + idCategoria + '/' + idCita + '/' + fue, {headers});
   }

   // Ruta para entrar a activa la siguiente cita
   putSiguienteCita(idCita, idServicio, categoria): Observable<any> {
    return this.http.put(apiUrl + '/siguiente/' + idCita + '/' + idServicio + '/' + categoria, {headers});
   }

   // Ruta para enviar informacion con la edicion de un servicio
   editInfoServicio(datos, token): Observable<any> {
    return this.http.put(apiUrl + '/servicioput/' + '?token=' + token, datos, {headers});
  }

// Editar datos del perfil de provedor

editProv(datos, token): Observable<any> {
  return this.http.put(apiUrl + '/provedores/' + '?token=' + token, datos, {headers});
}

// Publicar un servicio

pubService(formulario): Observable<any> {
  return this.http.post(apiUrl + '/services' , formulario, {headers});
}

// Cambio contraseña y usuario sucursal

putCambioContrasenaUsuario(info) {
  return this.http.put<{resp}>(apiUrl + '/contrasuc' , info, {headers});
}

}
