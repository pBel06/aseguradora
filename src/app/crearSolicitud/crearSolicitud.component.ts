import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { IMarca } from '../_model/marca.model';
import { MarcaService } from '../marca/marca.service';
import { AseguradoraService } from '../aseguradora/aseguradora.service';
import { IAseguradora } from '../_model/aseguradora.model';
import { RepuestoService } from '../repuestos/repuestos.service';
import { IRepuesto } from '../_model/repuesto.model';
import { SolicitudService } from './solicitud.service';
import { IGenericResponse } from '../_model/genericResponse.model';
import { ISolicitud } from '../_model/solicitud.model';
import { ILoginResponse } from '../_model/loginResponse.model';
import { IUser } from '../_model/user.model';
import { ITaller } from '../_model/taller.model';
import { IRepsSolic } from '../_model/repsSol.model';

@Component({
  templateUrl:'./crearSolicitud.component.html'
})
export class CrearSolicitudComponent implements OnInit{
    msgs: Message[] = [];
    errorMessage:string;
    userL: ILoginResponse;
    usuario: IUser;
    usrTaller: ITaller;

    cols: any[];
    clonedRepuestos: { [s: string]: IRepsSolic; } = {};
    

    _marcaSeleccionada: string;
    
    _repuestoSelected: IRepuesto[];
    _aseguradoraSeleccionada: string;
    crearSolicitudTaller:FormGroup;

    codigo: string;
    marcasSource: IMarca[];
    aseguradoraSource: IAseguradora[];
    
    solicitud: ISolicitud;
    
    
    marcasModelo: SelectItem[]=[];
    aseguradoras: SelectItem[]=[];
    
    get marcaSeleccionada(): string{
        return this._marcaSeleccionada;
    }
  
    set marcaSeleccionada(value:string){
        this._marcaSeleccionada = value;
    }

    constructor(private marcaService:MarcaService, private asegService: AseguradoraService, private solicitudService: SolicitudService,private alertService:AlertService){

        this.crearSolicitudTaller = new FormGroup({
            codigoSol: new FormControl('',Validators.required),
            nombre: new FormControl('',Validators.required),
            marca: new FormControl('',Validators.required),
            modelo: new FormControl('',Validators.required),
            anho: new FormControl('',Validators.required),
            tipoV: new FormControl('',Validators.required),
            placa: new FormControl('',Validators.required),
            chasis: new FormControl('',Validators.required),
            motor: new FormControl('',Validators.required),
            siniestro: new FormControl('',Validators.required),
            poliza: new FormControl('',Validators.required),
            aseguradora: new FormControl('',Validators.required),
            tiempo: new FormControl('',Validators.required),
            repuestos: new FormControl('',Validators.required),
            cantidadRep: new FormControl('',Validators.required),
            comentarios: new FormControl('',Validators.required)
        });
    
    }

    ngOnInit():void{
        console.log("Cargando ventana principal de crear solicitud...");
        
        this.marcasSource = [];
        this._marcaSeleccionada="";

        this.aseguradoraSource = [];
    
        // OBTENIENDO CODIGO DE SOLICITUD
       this.solicitudService.generarCodigo().subscribe({
          next: codigo =>{
            this.codigo = codigo.toString();
            console.log("Codigo obtenido: " + this.codigo);
            this.crearSolicitudTaller.controls['codigoSol'].setValue(this.codigo);
          },
          error: err=>this.errorMessage=err
        });

       //CARGANDO LISTA DE MARCAS
        this.marcaService.getMarcas().subscribe(marcas => {
          this.marcasSource = marcas;
          if(this.marcasSource && this.marcasSource.length > 0){
              for(let key in this.marcasSource){
                   console.log("Llenamos el dropdownList de marcas");
                   if(this.marcasSource.hasOwnProperty(key)){
                       this.marcasModelo.push({label: this.marcasSource[key].nombre, value: {id:this.marcasSource[key].id,nombre:this.marcasSource[key].nombre}});
                   }
              }
          }
       });

        //CARGANDO LAS ASEGURADORAS
        this.asegService.getAseguradoras().subscribe(aseguradoras => {
            this.aseguradoraSource = aseguradoras;
            if(this.aseguradoraSource && this.aseguradoraSource.length > 0){
                for(let key in this.aseguradoraSource){
                     console.log("Llenamos el dropdownList de aseguradoras");
                     if(this.aseguradoraSource.hasOwnProperty(key)){
                         this.aseguradoras.push({label: this.aseguradoraSource[key].nombre, value: {id:this.aseguradoraSource[key].id,nombre:this.aseguradoraSource[key].nombre}});
                     }
                }
            }
        });
      }//CIERRE DE ONINIT

      /*onRowEditInit(rep: IRepsSolic) {
        this.clonedRepuestos[rep.nombre] = {...rep};
      } */

      /*onRowEditSave(rep: IRepsSolic) {
          if (rep.cantidad > 0) {
            delete this.clonedRepuestos[rep.nombre];

              console.log("Valor a guardar " + JSON.stringify(rep)); 
            
          }
          else {
             
          }
      } */

      
      limpiarForm(){
        console.log("reset del formulario de la solicitud ..");
        this.crearSolicitudTaller.reset();
        this.ngOnInit();
      }

      guardarSolicitud(estado:string,respS: IRepsSolic){
        console.log("Guardando en borrador la solicitud ..");
        this.solicitudService.consultarUsuario().subscribe(usr => {
          this.usuario = usr;
          console.log("Usuario creador de la solicitud: " + JSON.stringify(this.usuario));
            if(this.usuario != null){
              this.solicitudService.consultarTaller().subscribe(usrTaller => {
                this.usrTaller = usrTaller;
                console.log("Taller creador de la solicitud: " + JSON.stringify(this.usrTaller));
                if(this.usrTaller != null){
                  this.solicitudService.guardarSolicitud(estado,this.usuario,this.usrTaller,this.crearSolicitudTaller,this._marcaSeleccionada,this._aseguradoraSeleccionada).subscribe({
                    next: solicitudCreada => {
                      this.solicitud=solicitudCreada;
                      console.log("Obteniendo la informacion de la solicitud creada en estado borrador...");
                      if(this.solicitud && this.solicitud != null){
                        this.msgs = [];
                        this.msgs.push({severity:'success', summary:'Éxito', detail:''});
                        this.alertService.error("Se ha almacenado la solicitud.");
                        setTimeout(() => {}, 3000);
                        this.ngOnInit();

                          
                      }else{
                        this.msgs = [];
                        this.msgs.push({severity:'danger', summary:'Error', detail:''});
                        this.alertService.error("No se ha podido almacenar el repuesto.");
                        setTimeout(() => {}, 3000);
                        this.ngOnInit();
                      }
                    },
                    error: err=>this.errorMessage=err
                  });
                }else{
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se ha encontrado el taller para el usuario logeado.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }
              });//cierre de consultar el taller del usuario              
            }else{
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se ha encontrado el usuario. Intente mas tarde");
              setTimeout(() => {}, 3000);
              this.ngOnInit();
            }//cierre validacion de usuario != null
        }); // cierre consultar usuario
      }//CIERRE DE GUARDAR SOLICITUD


}
