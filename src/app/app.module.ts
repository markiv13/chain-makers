import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CollapseModule, ModalModule, PopoverModule, TabsModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {MaterialModule} from './shared/material.module';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HeaderComponent} from './shared/components/header/header.component';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
import {ContentLoaderModule} from '@ngneat/content-loader';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
import {NetworkGraphComponent} from './supply-network/components/network-graph/network-graph.component';
import {PropertyGraphComponent} from './shared/components/property-graph/property-graph.component';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
import {NetworkGraphTopToolbarComponent} from './supply-network/components/network-graph/network-graph-top-toolbar/network-graph-top-toolbar.component';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    NetworkGraphComponent,
    PropertyGraphComponent,
    NetworkGraphTopToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    PopoverModule.forRoot(),
    TabsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    CommonModule,
    FontAwesomeModule,
    CollapseModule,
    ContentLoaderModule
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
