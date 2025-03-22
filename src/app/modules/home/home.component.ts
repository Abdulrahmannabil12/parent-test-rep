import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageInfoService } from 'shared/services/page-info.service';
import { CustomToolBarActions } from '../users/users-list/components/toolbarCustom.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {



  constructor(private pageInfo: PageInfoService) { }

  ngOnInit(): void {
    setTimeout(() => {
   
      this.pageInfo.setTitle("Home");


    }, 5);
  }



  ngOnDestroy() {

  }
}
