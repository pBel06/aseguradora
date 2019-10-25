import {Component,OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IModelo } from '../_model/modelo.model';
import { IModeloVista } from '../_model/modeloVista.model';
import { MarcaService } from '../marca/marca.service';
import { IMarca } from '../_model/marca.model';
import { ModeloService } from './modelo.service';

@Component({
  templateUrl:'./modelo-list.component.html'
  //styleUrls:['./product-list.component.css']
})
export class ModeloListComponent implements OnInit{
    modelos: IModelo[]=[];
    modelosView: IModeloVista[]=[];
    _modeloSelected: IModeloVista[];
    _marcaSeleccionada: string;
  
    errorMessage:string;
    displayDialog:boolean;
    dialogVerMdl: boolean;
    dialogEditMdl: boolean;
    cols: any[];
    _estadoModelo: string;


  //formulario registro de usuarios
    registrarModeloForm:FormGroup;
    verModeloForm: FormGroup;
    updateModeloForm: FormGroup;

    marcasModelo: SelectItem[]=[];
    marcasSource: IMarca[];
    estadosModelo: SelectItem[];

    estado: boolean;
    _estadoUsuarioEdit: boolean;
    _tipoSeleccionadoEdit: string;
    
  get marcaSeleccionada(): string{
      return this._marcaSeleccionada;
  }

  set marcaSeleccionada(value:string){
      this._marcaSeleccionada = value;
  }

  get estadoModelo(): string{
    return this._estadoModelo;
}

set estadoModelo(value:string){
    this._estadoModelo = value;
}

  constructor(private marcaService:MarcaService,private modeloService: ModeloService){

    this.cols=[
      { field: 'nombre', header: 'nombre' },
      { field: 'nombreMarca', header: 'marca' }
    ];

    this.registrarModeloForm = new FormGroup({
      nombre: new FormControl('',Validators.required),
      marcaModelo: new FormControl('',Validators.required),
      estadoModelo: new FormControl('',Validators.required)
    });

    this.verModeloForm = new FormGroup({
        nombre: new FormControl('',Validators.required),
        marcaModelo: new FormControl('',Validators.required),
        estadoModelo: new FormControl('',Validators.required),
        fechaCreacion: new FormControl('',Validators.required)
    });

    this.updateModeloForm = new FormGroup({
        idMdl: new FormControl('',Validators.required),
        nombre: new FormControl('',Validators.required),
        marcaModelo: new FormControl('',Validators.required),
        estadoModelo: new FormControl('',Validators.required)
    });

  }

  ngOnInit():void{
      console.log("Cargando ventana principal de modelos...");
      this.marcasSource = [];
      
      this._estadoModelo="";
      this._marcaSeleccionada="";
  
      this.modeloService.getModelos().subscribe({
        next: modelos => {
          this.modelos=modelos;
          console.log("Lista de modelos registrados...");
          console.log(JSON.stringify(this.modelos));
          for(let key in this.modelos){
            if(this.modelos.hasOwnProperty(key)){
              this.modelosView[key]={
                id:this.modelos[key].id,
                nombre:this.modelos[key].nombre,
                usuariocrea: this.modelos[key].usuariocrea,
                estado: this.modelos[key].estado,
                fechacreacion: this.modelos[key].fechacreacion,

                idMarca: this.modelos[key].marca.id,
                nombreMarca:this.modelos[key].marca.nombre,
                estadoMarca: this.modelos[key].marca.estado,
                fechacreacionMarca: this.modelos[key].marca.fechacreacion,
                usuariocreaMarca: this.modelos[key].marca.usuariocrea
              }
            }
          }
        
          console.log("Modelo view: " + JSON.stringify(this.modelosView));
        },
        error: err=>this.errorMessage=err
      });

      //CARGANDO LISTA DE MARCAS
      this.marcaService.getMarcas().subscribe(marcas => {
        this.marcasSource = marcas;
        //this.tiposUsuarios.push({label: "Tipo de usuario", value: null});
        if(this.marcasSource && this.marcasSource.length > 0){
            for(let key in this.marcasSource){
                 console.log("Llenamos el dropdownList de marcas");
                 if(this.marcasSource.hasOwnProperty(key)){
                     this.marcasModelo.push({label: this.marcasSource[key].nombre, value: {id:this.marcasSource[key].id,nombre:this.marcasSource[key].nombre}});
                 }
            }
        }
     });
    }

  agregarModelo(){
    console.log("Abriendo formulario para agregar un nuevo modelo ... ");
    this.displayDialog = true;

    this.estadosModelo=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];

    this.registrarModeloForm.controls['nombre'].setValue("");
    this._marcaSeleccionada = "";
    this._estadoModelo = "";
  }

  guardarModelo(){
    console.log("Guardando nuevo modelo ... ");

    if(this._estadoModelo == "Activo"){
      this.estado=true;
    }
    else{
      this.estado=false;
    }
    this.modeloService.guardarModelo(this.registrarModeloForm,this._marcaSeleccionada,this.estado).subscribe({
        next: modeloLog => {
            console.log("*** Modelo guardado: ");
            this.displayDialog = false;
            this.estadosModelo=[];
            this.ngOnInit();
        },
        error: err=>this.errorMessage=err
    });
  }

  editarModelo(){
    console.log("editaremos el modelo . .. ");
    this._estadoModelo = "";
    this.estadosModelo=[
      {label:'', value:null},
      {label:'Activo', value:"Activo"},
      {label:'Inactivo', value:"Inactivo"}
    ];
    
    this.dialogEditMdl=true;
    this.updateModeloForm.controls['idMdl'].setValue(this._modeloSelected[0].id);
    this.updateModeloForm.controls['nombre'].setValue(this._modeloSelected[0].nombre);
  }

  actualizarModelo(){
    console.log("Actualizando el modelo ... ");
    if ( this._marcaSeleccionada != "" && this._marcaSeleccionada != ""){
      this.modeloService.actualizarModelo(this.updateModeloForm,this._marcaSeleccionada).subscribe({
          next: modeloLog => {
              console.log("*** Se actualizo la marca y estado: ESTADO" + this._estadoModelo);
              if(this._estadoModelo=="Activo"){
                this.estado=true;
              }else{
                this.estado=false;
              }
              if(this._estadoModelo != ""){
                this.modeloService.actualizarEstado(this.updateModeloForm.controls['nombre'].value,this.estado).subscribe({
                    next: userAc => {
                      this.ngOnInit();                     
                    },
                    error: err=>this.errorMessage=err
                });
              }
          },
          error: err=>this.errorMessage=err
      });
    }else if(this._marcaSeleccionada != "" && this._estadoModelo == ""){
      this.modeloService.actualizarModelo(this.updateModeloForm,this._marcaSeleccionada).subscribe({
        next: userLog => {
          console.log("*** Se actualizo la marca: ");
          this.ngOnInit();
        },
        error: err=>this.errorMessage=err
    });
  }else if(this._marcaSeleccionada == "" && this._estadoModelo != ""){
    if(this._estadoModelo=="Activo"){
      this.estado=true;
    }else{
      this.estado=false;
    }
    this.modeloService.actualizarEstado(this.updateModeloForm.controls['nombre'].value,this.estado).subscribe({
            next: userLog => {
                console.log("*** Se actualizo estado: ");
                this.ngOnInit();
            },
            error: err=>this.errorMessage=err
        });
    }
    
    this.dialogEditMdl=false;  
  }
  
  verModelo(){
    console.log("visualizaremos el modelo . .. ");
    this.dialogVerMdl=true;
    this.verModeloForm.controls['nombre'].setValue(this._modeloSelected[0].nombre);
    this.verModeloForm.controls['marcaModelo'].setValue(this._modeloSelected[0].nombreMarca);
    if(this._modeloSelected[0].estado==1){
      this.verModeloForm.controls['estadoModelo'].setValue("Activo");
    }else{
      this.verModeloForm.controls['estadoModelo'].setValue("Inactivo");
    }
    
    this.verModeloForm.controls['fechaCreacion'].setValue(this._modeloSelected[0].fechacreacion);
  }
}
