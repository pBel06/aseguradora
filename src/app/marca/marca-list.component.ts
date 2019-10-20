import {Component,OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMarca } from '../_model/marca.model';
import { MarcaService } from './marca.service';

@Component({
  templateUrl:'./marca-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class MarcaListComponent implements OnInit{
  marcas: IMarca[]=[];
   _marcaSelected: IMarca[];
  _estadoMarca: string;
  estadosMarca: SelectItem[];
  estado:boolean;

  //filteredTalleres:ITaller[] = [];
  errorMessage:string;
  displayDialog:boolean;
  dialogVerMarca: boolean;
  dialogEditMrc: boolean;
    
  cols: any[];

  registrarMarcaForm:FormGroup;
  verMarcaForm: FormGroup;
  updateMarcaForm: FormGroup;

constructor(private marcaService:MarcaService){
  this.cols=[
    { field: 'id', header: 'numero' },
    { field: 'nombre', header: 'nombre' }
  ];

 

  this.registrarMarcaForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoMarca: new FormControl('',Validators.required)
  });

  this.verMarcaForm = new FormGroup({
    nombre: new FormControl('',Validators.required),
    estadoMarca: new FormControl('',Validators.required),
    fechaCreacion: new FormControl('',Validators.required)
  });

  this.updateMarcaForm = new FormGroup({
    idMrc: new FormControl('',Validators.required),
    nombre: new FormControl('',Validators.required),
    estadoMarca: new FormControl('',Validators.required)
  });
}

  ngOnInit():void{
      console.log("Cargando ventana principal de marca...");  
      this._estadoMarca="";
      this.marcaService.getMarcas().subscribe({
        next: marcas => {
          this.marcas=marcas;
          console.log("Lista de marcas registradas...");
          console.log(JSON.stringify(this.marcas));
        },
        error: err=>this.errorMessage=err
      });
    }

  agregarMarca(){
    console.log("Abriendo formulario para agregar una nueva marca ... ");
    this.displayDialog = true;
    this.estadosMarca=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarMarcaForm.controls['nombre'].setValue("");
    this._estadoMarca = "";
  }

  guardarMarca(){
    console.log("Cargando formulario para crear una nueva marca ... ");
    
    if(this._estadoMarca == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }

    this.marcaService.guardarMarca(this.registrarMarcaForm,this.estado).subscribe({
        next: userLog => {
            console.log("*** Marca guardada: ");
            this.displayDialog = false;
            this.estadosMarca=[];
            this._marcaSelected=[];
            this.ngOnInit();
        },
        error: err=>this.errorMessage=err
    });
  }

  editarMarca(){
    console.log("editaremos la marca . .. ");
    this._estadoMarca = "";
    this.estadosMarca=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.dialogEditMrc=true;
    this.updateMarcaForm.controls['idMrc'].setValue(this._marcaSelected[0].id);
    this.updateMarcaForm.controls['nombre'].setValue(this._marcaSelected[0].nombre);
   
  }

  actualizarMarca(){
    console.log("Actualizando una nueva marca ... ");
    if (this._estadoMarca != ""){
      if(this._estadoMarca=="Activo"){
        this.estado=true;
      }else{
        this.estado=false;
      }
    this.marcaService.actualizarEstado(this.updateMarcaForm,this.estado).subscribe({
        next: tallerLog => {
            console.log("*** Marca actualizado: ");
            this.dialogEditMrc=false;
            this._marcaSelected=[];
            this.ngOnInit();
        },
        error: err=>this.errorMessage=err
    });
  }
}
 
  verMarca(){
    console.log("visualizaremos la marca . .. ");
    this.dialogVerMarca=true;
    this.verMarcaForm.controls['nombre'].setValue(this._marcaSelected[0].nombre);
    if(this._marcaSelected[0].estado == 1){
      this.verMarcaForm.controls['estadoMarca'].setValue("Activo");
    }else{
      this.verMarcaForm.controls['estadoMarca'].setValue("Inactivo");
    }
    this.verMarcaForm.controls['fechaCreacion'].setValue(this._marcaSelected[0].fechacreacion);
  }
}
