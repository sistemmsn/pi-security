import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogsPage } from './logs';

@NgModule({
  declarations: [
    LogsPage
  ],
  imports: [
    IonicPageModule.forChild(LogsPage),
    PipesModule
  ],
})
export class LogsPageModule {}
