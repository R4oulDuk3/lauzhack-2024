import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BoberComponent} from "./bober/bober.component";

const routes: Routes = [
  {
    path: '',
    component: BoberComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
