import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService<T> {
  private dataSourceListItemSource = new BehaviorSubject<T[]>([]);
  private dataItemSource = new BehaviorSubject<T>({} as T);

  currentDataSourceList = this.dataSourceListItemSource.asObservable();
  currentData = this.dataItemSource.asObservable();

  constructor() {}

  changeCurrentDataSourceList(dataSourceList: T[]): void {
    this.dataSourceListItemSource.next(dataSourceList);
  }

  changeCurrentDataList(DataItem: T): void {
    this.dataItemSource.next(DataItem);
  }
}
