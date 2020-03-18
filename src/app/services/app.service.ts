import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

const headers = new HttpHeaders().set('Content-Type', 'application/json');
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) { }

  // Metodo para encriptar
  encriptar(pssw) {
    return CryptoJS.SHA512(pssw).toString(CryptoJS.enc.Hex);
  }

//  <!-- ----------------------------------------------------------------------------------------------------- -->
//  <!-- --------------------------------------------- METODOS GET ------------------------------------------- -->
//  <!-- ----------------------------------------------------------------------------------------------------- -->

  // metodo para la confirmacion de la cuenta
  getConfirmacionCuenta(id) {
    return this.http.get(apiUrl + '/locked/' + id);
  }

  // metodo para verificar que el correo exista, para el cambio de contraseña
  getConfirmacionCorreo(correo) {
    return this.http.get(apiUrl + '/cambioc/' + correo);
  }

  // Ruta para pedir la informacion de una mascota

  getMascotaInfo(idMascota): Observable<any> {
    return this.http.get(apiUrl + '/mascotam/' + idMascota);
  }

  // metodo para reenciar codigo de confirmacion de cuenta al correo
  getReenviarCodigoCorreo(id) {
    return this.http.get(apiUrl + '/cambios/' + id);
  }

  getDepartamento(): Observable<any> {
    return this.http.get(apiUrl + '/departamentos/47');
  }

  getMunicipio(id): Observable<any> {
    return this.http.get(apiUrl + '/municipios/' + id);
  }

  getCategorias(): Observable<any> {
    return this.http.get(apiUrl + '/categoria');
  }

   // Ruta para obtener las publicaciones que ha hecho un provedor;
   getPublicacionesProveedor(idProvedor): Observable<any> {
    return this.http.get(apiUrl + '/services/' + idProvedor);
  }

  // Get parentescos
  getParentescos(): Observable<any> {
    return this.http.get(apiUrl + '/parent');
  }

  // Ruta paera pedir la informacion de un usuario
  getUser(idPaciente): Observable<any> {
    // console.log(id);
    return this.http.get(apiUrl + '/user/' + idPaciente);
  }

   // metodo para pedir las categorias que tiene una sucursal
   getCategoriasInventario(idSucursal, idProvedor) {
    return this.http.get(apiUrl + '/cinventario/' + idSucursal + '/' + idProvedor, {headers});
  }

  // Ruta que retorna el materiales de lentes
  getMaterialesLentes(idCategoria) {
    return this.http.get(apiUrl + '/material-adm/' + idCategoria, {headers});
  }

  // Ruta para obtener la informacion de un material con sus lentes tallados y terminados
  getInfoMaterialLentes(idMaterial) {
    return this.http.get(apiUrl + '/tertall/' + idMaterial, {headers});
  }

//  <!-- ----------------------------------------------------------------------------------------------------- -->
//  <!-- --------------------------------------------- METODOS PUT ------------------------------------------- -->
//  <!-- ----------------------------------------------------------------------------------------------------- -->

   // Ruta para hacer el cambio de contrasena
   cambioContrasena(info) {
    return this.http.put(apiUrl + '/cambioc', info, { headers });
  }

  // Ruta para la confirmacion de la cuenta
  confirmacionCuenta(info, token): Observable<any> {
    return this.http.put(apiUrl + '/cuenta/' + '?token=' + token, info, { headers });
  }

  // METODOS DELETE
  // Ruta para eliminar las imagenes de un servicio
  dltImagenServicio(id, ruta): Observable<any> {
    return this.http.delete(apiUrl + '/elmfotoser/' + id, {headers});
 }

 // Ruta para editar datos de usuario
 editUser(info, token) {
  return this.http.put(apiUrl + '/user/' + '?token=' + token, info, { headers });

}

// Ruta para editar avatar
putEditAvatar(info, token) {
  return this.http.put(apiUrl + '/fotou/' + '?token=' + token , info, {headers});
 }

 // Ruta para editar categoria de inventario
putEditCategoriaInventario(info) {
  return this.http.put(apiUrl + '/cinventario/', info, {headers});
 }

//  <!-- ----------------------------------------------------------------------------------------------------- -->
//  <!-- --------------------------------------------- METODOS POST ------------------------------------------ -->
//  <!-- ----------------------------------------------------------------------------------------------------- -->

// Ruta para agregar categoria inventario
postAddCategoria(info) {
  return this.http.post(apiUrl + '/cinventario/', info, {headers});
 }

// Ruta para guardar los lentes
postGuardarLentes(info) {
  return this.http.post(apiUrl + '/material-l', info, {headers});
}

//  <!-- ----------------------------------------------------------------------------------------------------- -->
//  <!-- -------------------------------------------- METODOS DELETE ----------------------------------------- -->
//  <!-- ----------------------------------------------------------------------------------------------------- -->

// Ruta para agregar categoria inventario
dltCategoriaInventario(idCategoria, idProvedor) {
  return this.http.delete(apiUrl + '/cinventario/' + idCategoria + '/' + idProvedor , {headers});
 }

 dltMaterialLentes(idMaterial) {
  return this.http.delete(apiUrl + '/cinventario/' + idMaterial , {headers});
 }
}
