import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageInfoService } from '../../../shared/services/page-info.service';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  constructor(private pageInfoService:PageInfoService) {}

  ngOnInit(): void {
    this.pageInfoService.showToolBar(false)
  }

  ngOnDestroy() {
    this.pageInfoService.showToolBar(true)

  }
}
