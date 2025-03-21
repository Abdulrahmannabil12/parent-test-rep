import {  Component,   Input,   OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PageLink, PageInfoService } from 'shared/services/page-info.service';

@Component({
  selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false

})
export class ToolbarComponent implements OnInit {

  private unsubscribe: Subscription[] = [];


  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;

  constructor(private pageInfo: PageInfoService) { }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();
    this.pageInfo.breadcrumbs.asObservable().subscribe(res => console.log(res));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
