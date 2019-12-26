import { Component } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; //activar navegacion de paginas por medio de parametros y por boton 
import { SolicitudService } from '../crearSolicitud/solicitud.service';
import { ISolicitud } from '../_model/solicitud.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRepuestoXSol } from '../_model/repuestpoXSoli.model';
import { Message } from 'primeng/api';
import { AlertService } from '../alert/alert.service';

@Component({ /* no podemos selector porque no lo sera un componente nested, sino que será una nueva pagina a mostrar por medio de enrutamiento*/
    templateUrl:'./solicitudDetail.component.html'
})
export class SolicitudDetailComponent {
    errorMessage:string;
    pageTitle: string = 'Detalle de solicitud';
    solicitudSeleccionada: ISolicitud;
    repXSolicitud: IRepuestoXSol[] = [];
    solicitudTaller:FormGroup;
    msgs: Message[] = [];

    constructor(private route:ActivatedRoute, private router:Router, private solicitudService:SolicitudService,private alertService:AlertService){
        this.solicitudTaller = new FormGroup({
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

    ngOnInit(){
        let codigoSolicitud =this.route.snapshot.paramMap.get('codigoSolicitud');
        let id = +this.route.snapshot.paramMap.get('id');
        console.log("Cargando el detalle de la solicitud: " + codigoSolicitud+ " id:" + id);
        this.pageTitle += `: ${codigoSolicitud}`;
        this.consultarSolicitud(codigoSolicitud, id);
    }

    consultarSolicitud(codigoSolicitud: string, id: number){
         //CARGANDO LA INFORMACION DE LA SOLICITUD SELECCIONADA
         this.solicitudService.consultarSolicitudByCode(codigoSolicitud).subscribe({
            next: solicitud => {
                if(solicitud != null){
                    this.solicitudService.consultarRepXSol(id).subscribe({
                        next: repXSol => {
                            if(repXSol != null){
                                this.repXSolicitud=repXSol;
                                console.log("Solicitud a revisar.... ");
                                console.log(JSON.stringify(this.solicitudSeleccionada));
                                console.log("Repuestos.... ");
                                console.log(JSON.stringify(this.repXSolicitud));
                                //llenamos el formulario con la informacion de la solicitud consultada
                                this.solicitudTaller.controls['codigoSol'].setValue(this.solicitudSeleccionada.codigoSolicitud);
                                this.solicitudTaller.controls['nombre'].setValue(this.solicitudSeleccionada.nombreAsegurado);
                                this.solicitudTaller.controls['marca'].setValue(this.solicitudSeleccionada.idMarca.nombre);
                                this.solicitudTaller.controls['modelo'].setValue("");
                                this.solicitudTaller.controls['anho'].setValue(this.solicitudSeleccionada.anioCarro);
                                this.solicitudTaller.controls['tipoV'].setValue(this.solicitudSeleccionada.tipoVehiculo);
                                this.solicitudTaller.controls['placa'].setValue(this.solicitudSeleccionada.placa);
                                this.solicitudTaller.controls['chasis'].setValue(this.solicitudSeleccionada.chasis);
                                this.solicitudTaller.controls['motor'].setValue(this.solicitudSeleccionada.motor);
                                this.solicitudTaller.controls['siniestro'].setValue(this.solicitudSeleccionada.siniestro);
                                this.solicitudTaller.controls['poliza'].setValue(this.solicitudSeleccionada.poliza);
                                this.solicitudTaller.controls['aseguradora'].setValue(this.solicitudSeleccionada.idAseguradora.nombre);
                                this.solicitudTaller.controls['tiempo'].setValue(this.solicitudSeleccionada.fechaFin);
                                for(let key in this.repXSolicitud){
                                    console.log("Leemos los repuestos");
                                    if(this.repXSolicitud.hasOwnProperty(key)){
                                        this.solicitudTaller.controls['repuestos'].setValue(this.repXSolicitud[key].repuesto);
                                        this.solicitudTaller.controls['cantidadRep'].setValue(this.repXSolicitud[key].solicitud);
                                    }
                               }
                                this.solicitudTaller.controls['comentarios'].setValue(this.solicitudSeleccionada.comentariosTaller);
                            }else{
                                this.msgs = [];
                                this.msgs.push({severity:'danger', summary:'Error', detail:'No se hay repuestos para la solicitud seleccionada'});
                                this.alertService.error("No se han encontrado repuestos para esta solicitud. Intente mas tarde");
                                setTimeout(() => {}, 3000);
                                //this.ngOnInit();
                            }
                        },
                        error: err=>{
                            //this.errorMessage=err,
                            this.msgs = [];
                            this.msgs.push({severity:'danger', summary:'Error', detail:'No se ha podido completar su consulta. Intente mas tarde'});
                            this.alertService.error("No se ha podido completar su consulta. Intente mas tarde.");
                            setTimeout(() => {}, 3000);
                            //this.ngOnInit();
                        }
                    });
                }
              },
              error: err=>{
                //this.errorMessage=err,
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:'No se ha podido completar su consulta. Intente mas tarde'});
                this.alertService.error("No se ha podido completar su consulta. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                //this.ngOnInit();
            }
            });
      }//CIERRE DE consultarSolicitud
    
    onBack(): void{
        this.router.navigate(['/verSolicitud']);
    }
}