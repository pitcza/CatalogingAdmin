import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { LogoutPopupComponent } from './components/logout-popup/logout-popup.component';

// ADMIN MAIN PAGES WHEN THEY LOGIN
import { MainComponent } from './main/main.component';
import { MainModule } from './main/main.module';

import { MaterialModule } from './modules/material/material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutPopupComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }