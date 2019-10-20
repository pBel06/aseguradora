import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IAseguradora } from '../_model/aseguradora.model';

@Injectable({
  providedIn: 'root'
})

export class AseguradoraService{
  private aseguradoraUrlBase = 'http://localhost:8014/autolink';
  nuevaAseg: IAseguradora[];
  actualizarAseg:IAseguradora;

  constructor(private http: HttpClient){}

    getAseguradoras():Observable<IAseguradora[]>{
      console.log("Consultando la lista de talleres ... ");
      const httpOptions = {
         headers: {'Content-Type': 'application/json'},
         params: {}
       };
       return this.http.get<IAseguradora[]>(this.aseguradoraUrlBase+'/rest/aseguradora/all',httpOptions).pipe(
        tap(data => {
          console.log('Lista de aseguradoras: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarAseguradora(registrarAseguradoraForm:FormGroup,estado:boolean):Observable<IAseguradora>{
        console.log("Llamaremos al servicio para guardar una nueva aseguradora .. ");
        let mydate = new Date();
        this.nuevaAseg=JSON.parse(JSON.stringify({
          "nombre":registrarAseguradoraForm.controls['nombre'].value,
          "fechacreacion": mydate,
          "estado": ( estado ? true: false)
        }));
        let body = this.nuevaAseg;
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json' 
          })
        };
        console.log("Datos enviados al servicio para almacenar el nuevo taller: " + JSON.stringify(body));
        return this.http.post<IAseguradora>(this.aseguradoraUrlBase+'/rest/Aseguradora/save', body, httpOptions).pipe(
          tap(data => console.log('Aseguradora almacenada: ' +JSON.stringify(data))),
          catchError(this.handleError)
        );
      }
 
      actualizarEstado(updateAsegForm: FormGroup,estado:boolean):Observable<IAseguradora>{
        console.log("Llamaremos al servicio para actualizar una aseguradora ... ");
        this.actualizarAseg=JSON.parse(JSON.stringify({
            //"id": updateAsegForm.controls['idAseg'].value,
            "nombre": updateAsegForm.controls['nombre'].value,
            "estado": (estado ? true: false)
        }));
        let body = this.actualizarAseg;
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json' 
            })
        };
      console.log("Datos enviados al servicio para actualizar la aseguradora: " + JSON.stringify(body));
      return this.http.post<IAseguradora>(this.aseguradoraUrlBase+'/rest/aseguradora/status', body, httpOptions).pipe(
        tap(data => console.log('Aseguradora actualizada: ' +JSON.stringify(data))),
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
