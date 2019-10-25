import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ITaller } from '../_model/taller.model';
import { TallerService } from './taller.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl:'./taller-list.component.html'
})
export class TallerListComponent implements OnInit{
  msgs: Message[] = [];
  talleres: ITaller[]=[];
  _tallerSelected: ITaller[];
  _estadoTaller: string;
  estadosTaller: SelectItem[];
  estado:boolean;

  filteredTalleres:ITaller[] = [];
  errorMessage:string;
  displayDialog:boolean;
  dialogVerTaller: boolean;
  dialogEditTlr: boolean;
  dialogDelTlr: boolean;
  
  cols: any[];

  registrarTallerForm:FormGroup;
  verTallerForm: FormGroup;
  updateTallerForm: FormGroup;

constructor(private tallerService:TallerService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' }
  ];

  this.registrarTallerForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoTaller: new FormControl('',Validators.required)
  });

  this.verTallerForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoTaller: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required)
  });

  this.updateTallerForm = new FormGroup({
    idTlr: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    estadoTaller: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de talleres...");  
      this._estadoTaller="";
      this.tallerService.getTalleres().subscribe({
        next: talleres => {
          this.talleres=talleres
          console.log("Lista de talleres registrados...");
          console.log(JSON.stringify(this.talleres));
        },
        error: err=>this.errorMessage=err
      });
    }

  agregarTaller(){
    console.log("Abriendo formulario para agregar un nuevo usuario ... ");
    this.displayDialog = true;
    this.estadosTaller=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];
    this.registrarTallerForm.controls['nombre'].setValue("");
    this._estadoTaller = "";
  }

  guardarTaller(){
    console.log("Cargando formulario para crear nuevo taller ... ");
    if(this._estadoTaller == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }

    this.tallerService.guardarTaller(this.registrarTallerForm,this.estado).subscribe({
        next: tallerLg => {
            if(tallerLg != null){
              console.log("*** Taller guardado: ");
              this.displayDialog = false;
              this.estadosTaller=[];
              this.msgs = [];
              this.msgs.push({severity:'success', summary:'Taller creado', detail:''});
              this.alertService.success("Se ha creado el nuevo taller");
  
              setTimeout(() => {}, 3000);
  
              this.ngOnInit();
            }else{
              this.displayDialog = false;
              this.estadosTaller=[];
              this.msgs = [];
              this.msgs.push({severity:'danger', summary:'Error', detail:''});
              this.alertService.error("No se ha creado el taller. Intente mas tarde");
  
              setTimeout(() => {}, 3000);
  
              this.ngOnInit();
            }
            
        },
        error: err=>{
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el taller. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarTaller(){
    console.log("editaremos el taller . .. ");
    this._estadoTaller = "";
    this.estadosTaller=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.dialogEditTlr=true;
    this.updateTallerForm.controls['idTlr'].setValue(this._tallerSelected[0].id);
    this.updateTallerForm.controls['nombre'].setValue(this._tallerSelected[0].nombre);
   
  }

  actualizarTaller(){
    console.log("Actualizando un taller ... ");
    if (this._estadoTaller != ""){
      if(this._estadoTaller=="Activo"){
        this.estado=true;
      }else{
        this.estado=false;
      }
    this.tallerService.actualizarEstado(this.updateTallerForm,this.estado).subscribe({
        next: tallerLog => {
          if(tallerLog!=null){
            console.log("*** Taller actualizado: ");
            this.dialogEditTlr=false;
            this.estadosTaller=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Taller actualizado', detail:''});
            this.alertService.success("Se ha actualizado el taller");

            setTimeout(() => {}, 3000);

            this.ngOnInit();
          }else{
            this.dialogEditTlr = false;
            this.estadosTaller=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar el estado del taller. Actualice el estado nuevamente.");

            setTimeout(() => {}, 3000);

            this.ngOnInit();

          }
            
        },
        error: err=>{
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo actualizar el taller. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }
}
 
  verTaller(){
    console.log("visualizaremos el taller . .. ");
    this.dialogVerTaller=true;
    this.verTallerForm.controls['nombre'].setValue(this._tallerSelected[0].nombre);
    if(this._tallerSelected[0].estado == 1){
      this.verTallerForm.controls['estadoTaller'].setValue("Activo");
    }else{
      this.verTallerForm.controls['estadoTaller'].setValue("Inactivo");
    }
    this.verTallerForm.controls['fechaCreacion'].setValue(this._tallerSelected[0].fechacreacion);
  }
}
