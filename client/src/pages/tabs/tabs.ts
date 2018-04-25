import { LogsPage } from './../logs/logs';
import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ImagesPage } from '../images/images';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ImagesPage;
  tab3Root = LogsPage;

  constructor() {

  }
}
