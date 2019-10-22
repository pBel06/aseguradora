import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
//import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable , throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FormGroup,FormControl } from '@angular/forms';
import { ILoginResponse } from '../_model/loginResponse.model';
import { IUser } from '../_model/user.model';
import { IGenericResponse } from '../_model/genericResponse.model';

@Injectable({
    providedIn: 'root'
})

export class LoginService{
    private loginUrlBase="http://localhost:8014/autolink";
    //private loginUrl = "http://localhost:8014/autolink/rest/login";
    usuarioReset:IUser;
    genResponse: IGenericResponse;
   

    constructor(private http: HttpClient){}

    getUserLogOn(userL: string, passL: string):Observable<ILoginResponse>{
      console.log("Llamaremos al servicio de login");
      //this.loginUrl = this.loginUrl +"/rest/login";

      /*  return this.http.post<IUser>(this.loginUrl).pipe(
            tap(data => console.log('Usuario logeado: ' +JSON.stringify(data))),
            catchError(this.handleError)
        ); */

    //actualizarUsrForm.controls['id'].setValue(+actualizarUsrForm.controls['id'].value);
      let body = JSON.stringify({ user: userL, pass:passL });
      const httpOptions = {
       /* headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          //Origin: 'http://localhost:4200/login',
         'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
          'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
         // 'user':userL,
         // 'pass':passL,
        }), */
        headers: {'Content-Type': 'application/json'},
        params: {user:userL,pass:passL}
      };
      console.log("Usuario a autenticar: " + body);
      return this.http.get<ILoginResponse>(this.loginUrlBase+'/rest/login2',httpOptions).pipe(
        tap(data => {
          //localStorage.setItem('currentUser',JSON.stringify(data));
          //console.log('Usuario logeado: ' +JSON.stringify(localStorage.getItem('currentUser')));
          console.log('Usuario logeado: ' +JSON.stringify(data));
        }),
        catchError(this.handleError)
      );
    }

    isLoggedIn(){
      let user = localStorage.getItem('currentUser');
      let isLogged = user != null ? true : false;
      return isLogged;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.clear();
  }

  solicitudCorreo(userR: string):Observable<IGenericResponse>{
    console.log("Llamaremos al servicio de login");
    let body = JSON.stringify({ user: userR});
    const httpOptions = {
      headers: {'Content-Type': 'application/json'},
      params: {user: userR}
    };
    console.log("Usuario solicitante cambio de contraseña: " + body);
    return this.http.get<IGenericResponse>(this.loginUrlBase+'/rest/recover',httpOptions).pipe(
      tap(data => {
        console.log('Response servicio correo' +JSON.stringify(data));
      }),
      catchError(this.handleError)
    );
  }

  cambiarContraseña(userR: string, passR:string):Observable<IUser>{
    console.log("Llamaremos al servicio para guardar la nueva contraseña "+ userR + " " +  passR);
    this.usuarioReset=JSON.parse(JSON.stringify({
      "usuario": userR,
      "contra":passR
    }));
    let body = this.usuarioReset;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' 
      })
    };
    console.log("Datos enviados al servicio para actualizar la contraseña: " + JSON.stringify(body));
    return this.http.put<IUser>(this.loginUrlBase+'/rest/usuario/update', body, httpOptions).pipe(
      tap(data => console.log('Contraseña actualizada: ' +JSON.stringify(data))),
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