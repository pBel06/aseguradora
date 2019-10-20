
import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup,  FormControl ,FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../_model/user.model';

@Component({
    templateUrl: './resetPass.component.html'
})
export class ResetPassComponent implements OnInit{
    loading = false;
    submitted = false;
    returnUrl: string;
    userTemp: string;
    passTemp: string;
    errorMessage:string;
    user: IUser;

    resetPassForm = new FormGroup({
      username: new FormControl('',Validators.required),
      pwd: new FormControl('',Validators.required),
      pwd_repeat: new FormControl('',Validators.required),
    });

    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService) {}

    ngOnInit() {
        console.log("Cargando ventana de cambio de contraseña ...");
        //this.returnUrl = this.route.snapshot.queryParams['welcome'] || '/';
    }

    cambiarPass(){
        if(this.resetPassForm.controls['pwd'].value != this.resetPassForm.controls['pwd_repeat'].value){
            console.log("Las contraseñas deben coincidir ...");
        }else{
            console.log("Llamamos al servicio de guardar usuario para actualizar su contraseña ...");
            this.userTemp = this.resetPassForm.controls['username'].value;
            this.passTemp = this.resetPassForm.controls['pwd'].value;
           this.loginService.cambiarContraseña(this.userTemp,this.passTemp)
            .subscribe({
                next: userLog => {
                    console.log("*** Obtuvimos el usuario del logon: " + JSON.stringify(userLog));
                },
                error: err=>this.errorMessage=err
            });
        }
        this.router.navigate(['/login']);
    }
}
