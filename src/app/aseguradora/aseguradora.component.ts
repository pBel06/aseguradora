import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAseguradora } from '../_model/aseguradora.model';
import { AseguradoraService } from './aseguradora.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl:'./aseguradora-list.component.html'
  //styleUrls:['./product-list.component.css']
})

export class AseguradoraListComponent implements OnInit{
  msgs: Message[] = [];
  aseguradoras: IAseguradora[]=[];
  _aseguradoraSelected: IAseguradora[];
  cols: any[];
  _estadoAseguradora: string;
  errorMessage:string;
  displayDialog:boolean;
  dialogEditAseg: boolean;
  dialogVerAseg: boolean;
  estado:boolean;
  registrarAseguradoraForm:FormGroup;
  updateAsegForm: FormGroup;
  verAseguradoraForm: FormGroup;
  
  estadosAseguradora: SelectItem[];
  filteredTalleres:IAseguradora[] = [];
  
  updateTallerForm: FormGroup;

constructor(private aseguradoraService: AseguradoraService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' }
  ];

  this.registrarAseguradoraForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoAseguradora: new FormControl('',Validators.required)
  });

  this.updateAsegForm = new FormGroup({
    idAseg: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    estadoAseg: new FormControl('',Validators.required)
  });

  

  
  this.verAseguradoraForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoAseguradora: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required)
  });

}
  
ngOnInit():void{
      console.log("Cargando ventana principal de talleres...");  
      this.aseguradoraService.getAseguradoras().subscribe({
        next: aseguradoras => {
          this.aseguradoras=aseguradoras
          console.log("Lista de aseguradas registradas...");
          console.log(JSON.stringify(this.aseguradoras));
        },
        error: err=>this.errorMessage=err
      });
    }

    
    agregarAseguradora(){
        console.log("Abriendo formulario para agregar una nueva aseguradora...");
        this.displayDialog = true;
        this.estadosAseguradora=[
          {label:'', value:null},
          {label:'Activo', value:true},
          {label:'Inactivo', value:false}
        ];

        this.registrarAseguradoraForm.controls['nombre'].setValue("");
        this._estadoAseguradora = "";
    }

    
    guardarAseguradora(){
        console.log("Cargando formulario para crear nueva aseguradora ... ");
        if(this._estadoAseguradora == "Activo"){
          this.estado=true;
        }
        else{
          this.estado=false;
        }

        this.aseguradoraService.guardarAseguradora(this.registrarAseguradoraForm,this.estado).subscribe({
            next: userLog => {
              if(userLog!=null){
                console.log("*** Aseguradora guardada: ");
                this.displayDialog = false;
                this.estadosAseguradora=[];
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Aseguradora creada', detail:''});
                this.alertService.success("Se ha creado la nueva aseguradora");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }else{
                this.displayDialog = false;
                this.estadosAseguradora=[];
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se ha creado la aseguradora. Intente mas tarde");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }
            },
            error: err=>{
              this.errorMessage=err;
              this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo crear la aseguradora. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
            }
        });
    }

    editarAseguradora(){
        console.log("editaremos el taller . .. ");
        this.dialogEditAseg=true;
        this._estadoAseguradora = "";

        this.estadosAseguradora=[
          {label:'', value:null},
          {label:'Activo', value:"Activo"},
          {label:'Inactivo', value:"Inactivo"}
        ];

        this.updateAsegForm.controls['idAseg'].setValue(this._aseguradoraSelected[0].id);
        this.updateAsegForm.controls['nombre'].setValue(this._aseguradoraSelected[0].nombre);
       
      }
    
      actualizarAseguradora(){
        console.log("Actualizando un taller ... ");
        if (this._estadoAseguradora != ""){
          if(this._estadoAseguradora=="Activo"){
            this.estado=true;
          }else{
            this.estado=false;
          }
        }
        this.aseguradoraService.actualizarEstado(this.updateAsegForm,this.estado).subscribe({
            next: asegLog => {
              if(asegLog != null){
                console.log("*** Aseguradora actualizada: ");
                this.dialogEditAseg=false;
                this.estadosAseguradora=[];
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Aseguradora actualizada', detail:''});
                this.alertService.success("Se ha actualizado la aseguradora");
    
                setTimeout(() => {}, 3000);
    
                this.ngOnInit();
              }else{
                this.dialogEditAseg=false;
                this.estadosAseguradora=[];
                this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo actualizar el estado de la asrguradora. Actualice el estado nuevamente.");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
              }
            },
            error: err=>{
              this.errorMessage=err;
              this.msgs = [];
                this.msgs.push({severity:'danger', summary:'Error', detail:''});
                this.alertService.error("No se pudo actualizar la aseguradora. Intente mas tarde.");
                setTimeout(() => {}, 3000);
                this.ngOnInit();
            }
        });
      }

      verAseguradora(){
        console.log("visualizaremos el taller . .. ");
        this.dialogVerAseg=true;
        this.verAseguradoraForm.controls['nombre'].setValue(this._aseguradoraSelected[0].nombre);
        if(this._aseguradoraSelected[0].estado){
          this.verAseguradoraForm.controls['estadoAseguradora'].setValue("Activo");
        }else{
          this.verAseguradoraForm.controls['estadoAseguradora'].setValue("Inactivo");
        }
        this.verAseguradoraForm.controls['fechaCreacion'].setValue(this._aseguradoraSelected[0].fechacreacion);
    }
    /*
  eliminarTaller(){
    console.log("eliminaremos el taller . .. ");
    this.dialogDelTlr=true;
    
  }

  eliminarTalr(){
    //llamanos al servicio que actualiza para cambiar el estado
    this.dialogDelTlr = false;
    this._tallerSelected = null;
    this.ngOnInit();
  }
  }*/
}
