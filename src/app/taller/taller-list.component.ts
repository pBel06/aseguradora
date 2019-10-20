import {Component,OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
//import {ProductService} from './user-list.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { IUserVista } from '../_model/userVista.model';
//import { LoginService } from '../login/login.service';
import { ITaller } from '../_model/taller.model';
import { TallerService } from './taller.service';

@Component({
  templateUrl:'./taller-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class TallerListComponent implements OnInit{

 /* title:string='Lista de productos';
  imageWidth:number=50;
  imageMargin:number=2;
  showImage:boolean=true;
  filteredProducts:IProduct[] = [];
  products: IProduct[] = [];
  errorMessage:string;
  usuario:IUser; */

  talleres: ITaller[]=[];
  //talleresView: ITaller[]=[];
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

constructor(private tallerService:TallerService){
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
          /*for(let key in this.talleres){
            if(this.talleres.hasOwnProperty(key)){
                this.talleresView[key]={id:this.talleres[key].id,nombre:this.talleres[key].nombre};
            }
          }          
          console.log("Taller view: " + JSON.stringify(this.talleresView));*/
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
        next: userLog => {
            console.log("*** Taller guardado: ");
            this.displayDialog = false;
            this.estadosTaller=[];
            this.ngOnInit();
        },
        error: err=>this.errorMessage=err
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
            console.log("*** Taller actualizado: ");
            this.dialogEditTlr=false;
            this.ngOnInit();
        },
        error: err=>this.errorMessage=err
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
