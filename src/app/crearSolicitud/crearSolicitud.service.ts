import {Injectable} from '@angular/core';
import {HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { ILoginResponse } from '../_model/loginResponse.model';
import { ISolicitud } from '../_model/solicitud.model';
import { IUser } from '../_model/user.model';
import { ITaller } from '../_model/taller.model';
import { IRepuestoXSolRqst } from '../_model/respuestoXSoliRqst.model';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { IRepuesto } from '../_model/repuesto.model';
import { formatNumber } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class SolicitudService{
  private solicitudUrlBase = 'http://localhost:8014/autolink';
  userL: ILoginResponse;
  nuevaSolic: ISolicitud[];
  repXSolRqst: IRepuestoXSolRqst;
  usuario: IUser;
  usrTaller: ITaller;
  rep: IRepuesto;
  fecha: Date;
  minutos: number;
 
  constructor(private http: HttpClient){}

   /* generarCodigo(): Observable<string>{
      console.log("Llamaremos al servicio de login");
      let body = JSON.stringify({});
      const httpOptions = {
        headers: {'Content-Type': 'application/json'},
        params: {},
        responseTye: "text"
      };
      console.log("Usuario a autenticar: " + body);
      return this.http.get<string>(this.solicitudUrlBase+'/rest/solicitud/code',httpOptions).pipe(
        tap(data => {
          console.log('codigo de solicitud: ' +data);
        }),
        catchError(this.handleError)
      );
    }*/

    generarCodigo():Observable<string>{
      console.log("Llamaremos al servicio de login");
      const httpOptions = {
        headers: {'Accept': 'text/plain','Content-Type': 'text/plain'}
      };
      return this.http.get<string>(this.solicitudUrlBase+'/rest/solicitud/code',httpOptions).pipe(
        tap(data => {
          console.log('codigo de solicitud: ' + JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

      guardarSolicitud(estado:string,usuario:IUser,usrTaller:ITaller,crearSolicitudTaller:FormGroup,_marcaSeleccionada:string,_aseguradoraSeleccionada:string,_repuestoSeleccionado:string):Observable<ISolicitud>{
        console.log("Llamaremos al servicio para guardar una nueva solicitud .. ");
        this.fecha = new Date();
        this.minutos = parseInt(this.fecha.getMinutes().toString()) + parseInt(crearSolicitudTaller.controls['tiempo'].value);
        console.log("Minutos fin: " + this.minutos);
        this.nuevaSolic=JSON.parse(JSON.stringify({ 
          /*****************************  ESTRUCTURA SOLICITUD ************************************* */ 
        idTaller: usrTaller,
        idAseguradora: _aseguradoraSeleccionada,
        idMarca: _marcaSeleccionada,
        idUsuario: usuario,
        anioCarro: crearSolicitudTaller.controls['anho'].value,
        tipoVehiculo: crearSolicitudTaller.controls['tipoV'].value,
        placa: crearSolicitudTaller.controls['placa'].value,
        chasis: crearSolicitudTaller.controls['chasis'].value,
        motor: crearSolicitudTaller.controls['motor'].value,
        poliza: crearSolicitudTaller.controls['poliza'].value,
        siniestro: crearSolicitudTaller.controls['siniestro'].value,
        nombreAsegurado: crearSolicitudTaller.controls['nombre'].value,
        codigoSolicitud: "SOL00000001",//crearSolicitudTaller.controls['anho'].value,
        estado: estado,
        comentariosTaller: crearSolicitudTaller.controls['comentarios'].value,
        fechaInicio: this.fecha,
        fechaFin: new Date().setMinutes(this.minutos)
      }));

      let body = this.nuevaSolic;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el nuevo taller: " + JSON.stringify(body));
      return this.http.post<ISolicitud>(this.solicitudUrlBase+'/rest/solicitud/save', body, httpOptions).pipe(
        tap(data => console.log('Solicitud almacenada: ' +JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    consultarUsuario():Observable<IUser>{
      console.log("Consultaremos los datos del usuario");
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      const httpOptions = {
        headers: {'Content-Type': 'application/json'},
        params: {user:this.userL.user}
      };
      return this.http.get<IUser>(this.solicitudUrlBase+'/rest/usuario/one',httpOptions).pipe(
        tap(data => {
          console.log('Usuario generador de la solicitud: ' + JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    consultarTaller():Observable<ITaller>{
      console.log("Consultaremos los datos del taller");
      this.userL = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
      console.log("USUARIO DEL TALLER: " + this.userL.user);
      const httpOptions = {
        headers: {'Content-Type': 'application/json'},
        params: {usuario:this.userL.user.trim().toString()}
      };
      return this.http.get<ITaller>(this.solicitudUrlBase+'/rest/taller/byUser',httpOptions).pipe(
        tap(data => {
          console.log('Taller generador de la solicitud: ' + JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    guardarRepXSol(codigoSolicitud:string,idRep: string):Observable<IRepuestoXSol>{
      console.log("Guardando los respuestos de la solicitud");
      this.rep = JSON.parse(JSON.stringify(idRep));
        this.repXSolRqst=JSON.parse(JSON.stringify({ 
        codigoSolicitud: codigoSolicitud,
        idRepuesto: this.rep.id        
      }));

      let body = this.repXSolRqst;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json' 
        })
      };
      console.log("Datos enviados al servicio para almacenar el repuesto de la solicitud: " + JSON.stringify(body));
      return this.http.post<IRepuestoXSol>(this.solicitudUrlBase+'/rest/repuesto/save', body, httpOptions).pipe(
        tap(data => console.log('Repuesto almacenado en la solicitud: ' +JSON.stringify(data))),
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
