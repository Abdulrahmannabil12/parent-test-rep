import { Component, ComponentFactoryResolver, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { combineLatest, filter, Observable, Subscription, switchMap } from 'rxjs';
import { PageLink, PageInfoService } from 'shared/services/page-info.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false

})
export class ToolbarComponent implements OnInit {
  @ViewChild('childComponentContainer', { read: ViewContainerRef }) childComponentContainer!:  ViewContainerRef ;

  private unsubscribe: Subscription[] = [];
  private componentRef: any;

  toolbarCustomComponent: any;
  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;
  com$: Observable<string>;
  comData$: Observable<any>;
  activeToolbar$: Observable<Boolean>;
  subscriptions: Subscription[];

  constructor(private pageInfo: PageInfoService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();
    this.com$ = this.pageInfo.componentSubject.asObservable();
    this.comData$ = this.pageInfo.componentDataSubject.asObservable();
    this.activeToolbar$ = this.pageInfo.activeToolbar.asObservable();

  }

  ngAfterViewInit() {
      this.getNestedChildObservable().subscribe({
      complete: () => {
        this.loadComponent();
      }
    })



  }
  loadComponent() {

  combineLatest([this.comData$, this.com$]).
      subscribe(results => {
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

  getNestedChildObservable(): Observable<ViewContainerRef> {

    return new Observable<ViewContainerRef>(observer => {

      const checkNestedChild = setInterval(() => {
        if (this.childComponentContainer) {
          observer.next(this.childComponentContainer);
          observer.complete();
          clearInterval(checkNestedChild);
        }
      }, 100); // Check every 100ms
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
