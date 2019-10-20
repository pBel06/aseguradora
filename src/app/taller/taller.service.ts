import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { ITaller } from '../_model/taller.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class TallerService{
  private tallerUrlBase = 'http://localhost:8014/autolink';
  nuevoTlr: ITaller[];
  actualizarTal:ITaller;

  constructor(private http: HttpClient){}

      getTalleres():Observable<ITaller[]>{
      console.log("Consultando la lista de talleres ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<ITaller[]>(this.tallerUrlBase+'/rest/taller/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de talleres: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarTaller(nuevoTlrFrom:FormGroup,_estadoTaller:boolean):Observable<ITaller>{
      console.log("Llamaremos al servicio para guardar un nuevo taller .. ");
      let mydate = new Date();
      this.nuevoTlr=JSON.parse(JSON.stringify({
        "nombre":nuevoTlrFrom.controls['nombre'].value,
        "estado": ( _estadoTaller ? true: false),
        "fechacreacion": mydate
      }));
      let body = this.nuevoTlr;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el nuevo taller: " + JSON.stringify(body));
      return this.http.post<ITaller>(this.tallerUrlBase+'/rest/taller/save', body, httpOptions).pipe(
        tap(data => console.log('Taller almacenado: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    actualizarEstado(updateTallerForm: FormGroup,estado:boolean):Observable<ITaller>{
      console.log("Llamaremos al servicio para actualizar un taller ... ");
      this.actualizarTal=JSON.parse(JSON.stringify({
        //"id": updateTallerForm.controls['idTlr'].value,
        "nombre": updateTallerForm.controls['nombre'].value,
        "estado": (estado ? true: false)
      }));
      let body = this.actualizarTal;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para actualizar el taller: " + JSON.stringify(body));
      return this.http.post<ITaller>(this.tallerUrlBase+'/rest/taller/status', body, httpOptions).pipe(
        tap(data => console.log('Taller actualizado: ' +JSON.stringify(data))),
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
