import {Component,OnChanges,Input,Output,EventEmitter, OnInit} from '@angular/core';
import { SolicitudService } from '../crearSolicitud/solicitud.service';

@Component({
  selector:'buscadorSol',
  templateUrl:'./buscador.component.html'
})

export class BuscadorComponent implements OnInit {

    constructor(private solicitudService:SolicitudService){}

    ngOnInit(){
       /* //CARGANDO LISTADO DE ESTADOS DISPONIBLES
        this.solicitudService.consultarSolByEstado().subscribe(marcas => {
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
        }); */

      //  this.marcasModelo.push({label: this.marcasSource[key].nombre, value: {id:this.marcasSource[key].id,nombre:this.marcasSource[key].nombre}});
    }

    


     


 /* @Input() rating:number;
  starWidth:number;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  onClick():void{
    this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
  }

  ngOnChanges():void{
    this.starWidth=this.rating*75/5;
  } */

}
