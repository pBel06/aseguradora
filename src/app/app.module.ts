import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder ,FormGroup  } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';

import { LoginComponent } from "./login/login.component";
import { UserListComponent } from './users/user-list.component';
import {StarComponent} from './shared/star.component';
import {ConvertToSpacesPipe} from './shared/convert-to-spaces.pipe';
import { ProductDetailComponent } from './users/product-detail.component';
import { WelcomeComponent } from './home/welcomen.component';
import { ProductDetailGuard } from './users/product-detail.guard';
import {  SolicitudCorreoComponent } from './login/solicitudCorreo.component';
import { SideMenuComponent } from './header/SideMenu.component';
import { HeaderComponent } from './header/header.component';
import { ResetPassComponent } from './login/resetPass.component';
import { TallerListComponent } from './taller/taller-list.component';
import { DatePipe } from '@angular/common';
import { AseguradoraListComponent } from './aseguradora/aseguradora.component';
import { MarcaListComponent } from './marca/marca-list.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { ModeloListComponent } from './modelo/modelo-list.component';


@NgModule({
  declarations: [
    AppComponent,HeaderComponent,UserListComponent,ConvertToSpacesPipe,StarComponent,LoginComponent,ProductDetailComponent,
    WelcomeComponent,SolicitudCorreoComponent, SideMenuComponent,ResetPassComponent,TallerListComponent,AseguradoraListComponent,MarcaListComponent,ProveedorListComponent,ModeloListComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,FormsModule,PanelModule,DropdownModule,TableModule,HttpClientModule, ReactiveFormsModule,DialogModule,InputTextModule,PaginatorModule,
    RouterModule.forRoot([
      {path: 'login',component: LoginComponent},
      {path: 'solicitudCorreo',component: SolicitudCorreoComponent},
      {path: 'resetContrasena',component: ResetPassComponent},
      {path: 'users',component: UserListComponent},
      //{path: 'products/:id',canActivate:[ProductDetailGuard],component: ProductDetailComponent},
      {path: 'talleres',component: TallerListComponent},
      {path: 'aseguradoras',component: AseguradoraListComponent},
      {path: 'marcas',component: MarcaListComponent},
      {path: 'modelos',component: ModeloListComponent},
      {path: 'proveedores',component: ProveedorListComponent},
      {path: 'welcome',component: WelcomeComponent}
      //{path: '',component: WelcomeComponent,pathMatch: 'full'},
      //{path: '**',component: WelcomeComponent,pathMatch: 'full'} /* pagina 404*/
    ]) //,{useHash: true})
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
