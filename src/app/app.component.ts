import { Component } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; 
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
 // title = 'Aseguradora';
  isLogged : boolean;
  
  constructor(private  route:ActivatedRoute, private router:Router, private authService: LoginService){}

  ngOnInit():void{
    this.router.navigate(['/login']);
    
  }

  isLoggedIn(){
    this.isLogged = this.authService.isLoggedIn();
    //this.isLogged = true;
    console.log("VALIDANDO SI EL USER ESTA LOEGADO" + this.isLogged);
    //return this.isLogged;
    return this.isLogged;
  }
}