import {  Component,   OnInit } from '@angular/core';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
  standalone: false

})
export class NavbarComponent implements OnInit {


  isCollapsed: boolean;
  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit() {
  }

  collapseNavMenu() {

      this.isCollapsed = !this.isCollapsed;

  }

}
