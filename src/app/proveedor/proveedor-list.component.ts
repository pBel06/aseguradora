import {Component,OnInit} from '@angular/core';
import {SelectItem, Message} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IProveedor } from '../_model/proveedor.model';
import { ProveedorService } from './proveedor.service';
import { AlertService } from '../alert/alert.service';

@Component({
  templateUrl:'./proveedor-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class ProveedorListComponent implements OnInit{
  msgs: Message[] = [];
  proveedores: IProveedor[]=[];
  _proveedorSelected: IProveedor[];
  _estadoProveedor: string;
  estadosProveedor: SelectItem[];
  estado:boolean;

  errorMessage:string;
  displayDialog:boolean;
  dialogVerProv: boolean;
  dialogEditProv: boolean;
  
  cols: any[];

  registrarProvForm:FormGroup;
  verProvForm: FormGroup;
  updateProvForm: FormGroup;

constructor(private proveedorService:ProveedorService,private alertService:AlertService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' },
    { field: 'direccion', header: 'direccion' }
  ];

  this.registrarProvForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required)
  });

  this.verProvForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required)
  });

  this.updateProvForm = new FormGroup({
    idProv: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    direccion: new FormControl('',Validators.required),
    estadoProveedor: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de talleres...");  
      this._estadoProveedor="";
      this.proveedorService.getProveedores().subscribe({
        next: proveedores => {
          this.proveedores=proveedores
          console.log("Lista de proveedores registrados ...");
          console.log(JSON.stringify(this.proveedores));
        },
        error: err=>this.errorMessage=err
      });
    }

  agregarProveedor(){
    console.log("Abriendo formulario para agregar un nuevo proveedor ... ");
    this.displayDialog = true;
    this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarProvForm.controls['nombre'].setValue("");
    this.registrarProvForm.controls['direccion'].setValue("");
    this._estadoProveedor = "";
  }

  guardarProveedor(){
    console.log("Cargando formulario para crear nuevo proveedor ... ");
    
    if(this._estadoProveedor == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }

    this.proveedorService.guardarProveedor(this.registrarProvForm,this.estado).subscribe({
        next: userLog => {
          if(userLog != null){
            console.log("*** Proveedor guardado: ");
            this.displayDialog = false;
            this.estadosProveedor=[];
            this._proveedorSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Proveedor creado', detail:''});
            this.alertService.success("Se ha creado la proveedor");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }else{
            this.displayDialog = false;
            this.estadosProveedor=[];
            this._proveedorSelected=[];
            this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se ha creado el proveedor. Intente mas tarde");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
          }  
        },
        error: err=>{
          this.errorMessage=err;
          this.msgs = [];
            this.msgs.push({severity:'danger', summary:'Error', detail:''});
            this.alertService.error("No se pudo crear el proveedor. Intente mas tarde.");
            setTimeout(() => {}, 3000);
            this.ngOnInit();
        }
    });
  }

  editarProveedor(){
    console.log("editaremos el proveedor . .. ");
    this._estadoProveedor = "";
    this.estadosProveedor=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.dialogEditProv=true;
    this.updateProvForm.controls['idProv'].setValue(this._proveedorSelected[0].id);
    this.updateProvForm.controls['nombre'].setValue(this._proveedorSelected[0].nombre);
    this.updateProvForm.controls['direccion'].setValue(this._proveedorSelected[0].direccion);
   
  }

  actualizarProveedor(){
    console.log("Actualizando un proveedor ... ");
    this.proveedorService.actualizarProv(this.updateProvForm).subscribe({
      next: proveeLog => {
        if(proveeLog != null){
          console.log("Hemos actualizado al proveedor " + JSON.stringify(proveeLog));
          if (this._estadoProveedor != ""){
            if(this._estadoProveedor=="Activo"){
              this.estado=true;
            }else{
              this.estado=false;
            }
            this.proveedorService.actualizarEstado(this.updateProvForm,this.estado).subscribe({
              next: proveedor => {
                if(proveedor != null){
                  console.log("*** Proveedor actualizado: ");
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'success', summary:'Proveedor actualizado', detail:''});
                  this.alertService.success("Se ha actualizado el proveedor");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }else{
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el estado del proveedor. Actualice el estado nuevamente.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
                }
              },
              error: err=>{
                this.errorMessage=err;
                this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el proveedor. Intente mas tarde.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
              }
          });
          }else{
            console.log("*** Proveedor actualizado: ");
                  this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'success', summary:'Proveedor actualizado', detail:''});
                  this.alertService.success("Se ha actualizado el proveedor");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
          }
        }else{
          this.dialogEditProv=false;
                  this._proveedorSelected = [];
                  this.msgs = [];
                  this.msgs.push({severity:'danger', summary:'Error', detail:''});
                  this.alertService.error("No se pudo actualizar el estado del proveedor. Actualice el estado nuevamente.");
                  setTimeout(() => {}, 3000);
                  this.ngOnInit();
        }
      },
      error: err=>{
        this.errorMessage=err;
        this.msgs = [];
          this.msgs.push({severity:'danger', summary:'Error', detail:''});
          this.alertService.error("No se pudo actualizar el proveedor. Intente mas tarde.");
          setTimeout(() => {}, 3000);
          this.ngOnInit();
      }
    });    
}
 
  verProveedor(){
    console.log("visualizaremos el proveedor . .. ");
    this.dialogVerProv=true;
    this.verProvForm.controls['nombre'].setValue(this._proveedorSelected[0].nombre);
    this.verProvForm.controls['direccion'].setValue(this._proveedorSelected[0].direccion);
    if(this._proveedorSelected[0].estado == 1){
      this.verProvForm.controls['estadoProveedor'].setValue("Activo");
    }else{
      this.verProvForm.controls['estadoProveedor'].setValue("Inactivo");
    }
    this.verProvForm.controls['fechaCreacion'].setValue(this._proveedorSelected[0].fechacreacion);
  }
}
