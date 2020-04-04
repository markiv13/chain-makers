import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
// tslint:disable-next-line:max-line-length
import {NetworkGraphComponent} from './supply-network/components/network-graph/network-graph.component';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length

const routes: Routes = [
  {
    path: 'supply-network/network-masks',
    component: NetworkGraphComponent
  },
  {
    path: '**',
    component: NetworkGraphComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}/*{enableTracing: true}*/)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
