import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PageLink {
  title: string;
  path: string;
  isActive: boolean;
  isSeparator?: boolean;
}

export class PageInfo {
  breadcrumbs: Array<PageLink> = [];
  title: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class PageInfoService {
  public title: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Home'
  );
  public description: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public breadcrumbs: BehaviorSubject<Array<PageLink>> = new BehaviorSubject<
    Array<PageLink>
  >([]);

  constructor() { }

  public setTitle(_title: string) {
    this.title.next(_title);
  }

  public updateTitle(_title: string) {
    setTimeout(() => {
      this.setTitle(_title);
    }, 1);
  }

  public setDescription(_title: string) {
    this.description.next(_title);
  }

  public updateDescription(_description: string) {
    setTimeout(() => {
      this.setDescription(_description);
    }, 1);
  }

  public setBreadcrumbs(_bs: Array<PageLink>) {
    this.breadcrumbs.next(_bs);
  }


  }





 
