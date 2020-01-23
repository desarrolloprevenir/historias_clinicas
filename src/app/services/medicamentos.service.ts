import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

const headers = new HttpHeaders().set('Content-Type', 'application/json');
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  constructor(public http: HttpClient) { }

  getMedicamentos(): Observable<any> {
    return this.http.get(apiUrl + '/medicamentos', {headers});
  }

  postMedicamentos(info, token): Observable <any> {
    return this.http.post(apiUrl + '/histclinica/' + '?token=' + token, info, {headers});
  }

}
