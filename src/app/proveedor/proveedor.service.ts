import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IProveedor } from '../_model/proveedor.model';
import { ILoginResponse } from '../_model/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class ProveedorService{
  private provUrlBase = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevoProv: IProveedor[];
  actualizaProv:IProveedor;

  constructor(private http: HttpClient){}

  getProveedores():Observable<IProveedor[]>{
      console.log("Consultando la lista de proveedores ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<IProveedor[]>(this.provUrlBase+'/rest/proveedor/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de proveedores: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarProveedor(nuevoProvFrom:FormGroup,_estadoProveedor:boolean):Observable<IProveedor>{
      console.log("Llamaremos al servicio para guardar un nuevo proveedor .. ");
      let mydate = new Date();
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      this.nuevoProv=JSON.parse(JSON.stringify({
        "nombre":nuevoProvFrom.controls['nombre'].value,
        "direccion":nuevoProvFrom.controls['direccion'].value,
        "estado": ( _estadoProveedor ? true: false),
        "fechacreacion": mydate,
        "usuariocrea": this.userL.nombre
      }));
      let body = this.nuevoProv;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el nuevo taller: " + JSON.stringify(body));
      return this.http.post<IProveedor>(this.provUrlBase+'/rest/proveedor/save', body, httpOptions).pipe(
        tap(data => console.log('Proveedor almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarProv(updateProvForm: FormGroup):Observable<IProveedor>{
      console.log("Llamaeremos al servicio de actualizar proveedor ... ");
      this.actualizaProv = JSON.parse(JSON.stringify({
        "nombre": updateProvForm.controls['nombre'].value,
        "direccion": updateProvForm.controls['direccion'].value
      }));
      let body = this.actualizaProv;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el proveedor: " + JSON.stringify(body));
      return this.http.put<IProveedor>(this.provUrlBase+'/rest/proveedor/update', body, httpOptions).pipe(
        tap(data => console.log('Proveedor actualizado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );

    }

    actualizarEstado(updateProvForm: FormGroup,estado:boolean):Observable<IProveedor>{
      console.log("Llamaremos al servicio para actualizar el estado del proveedor ... ");
      this.actualizaProv = JSON.parse(JSON.stringify({
        //"id": updateTallerForm.controls['idTlr'].value,
        "nombre": updateProvForm.controls['nombre'].value,
        //"direccion": updateProvForm.controls['direccion'].value,
        "estado": (estado ? true: false)
      }));
      let body = this.actualizaProv;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el estado del proveedor: " + JSON.stringify(body));
      return this.http.post<IProveedor>(this.provUrlBase+'/rest/proveedor/status', body, httpOptions).pipe(
        tap(data => console.log('Proveedor actualizado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    private handleError(err: HttpErrorResponse){
      let errorMessage='';
      if(err.error instanceof ErrorEvent){
        errorMessage = `An error ocurred: ${err.error.message}`;
      }else{
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
}
