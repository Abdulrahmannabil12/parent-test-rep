import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageInfoService } from 'shared/services/page-info.service';

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
      this.pageInfo.setBreadcrumbs([
        {
          title: 'Home',
          path: '/home',
          isActive: false,
        },
        {
          title: 'Admin',
          path: '/admin',
          isActive: true,
        },
       ]);
      this.pageInfo.setTitle("dfsfsdf")
    }, 5);
  }



  ngOnDestroy() {

  }
}
