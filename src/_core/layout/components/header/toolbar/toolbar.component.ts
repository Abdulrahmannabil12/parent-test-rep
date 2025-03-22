import {  Component,   ComponentFactoryResolver,   Input,   OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { PageLink, PageInfoService } from 'shared/services/page-info.service';

@Component({
  selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false

})
export class ToolbarComponent implements OnInit {

  private unsubscribe: Subscription[] = [];

  toolbarCustomComponent: any;
  @ViewChild('childComponentContainer', { read: ViewContainerRef }) childComponentContainer: ViewContainerRef;
  private componentRef: any;
  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;
  com$: Observable<string>;
  comData$: Observable<any>;
  subscription: Subscription;

  constructor(private pageInfo: PageInfoService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();
    this.com$ = this.pageInfo.componentSubject.asObservable();
    this.comData$ = this.pageInfo.componentDataSubject.asObservable();

  }

  ngAfterViewInit() {

    this.subscription = combineLatest([this.comData$, this.com$]).subscribe(results => {
      // results[0] contains the result of Observable1
      // results[1] contains the result of Observable2
      if (this.componentRef) {
        this.componentRef.destroy();
      }

      const data = results[0]
      const component = results[1]

      if (component) {

        const toolbarCustomComponent = component as any; // This holds the component class reference
        const childComponentFactory = this.componentFactoryResolver.resolveComponentFactory(toolbarCustomComponent);
        this.componentRef = this.childComponentContainer.createComponent(childComponentFactory);
        this.componentRef.instance.InputData = data;

      } else {
        if (this.componentRef) {
          this.componentRef.destroy();
        }
      }
    });

  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
