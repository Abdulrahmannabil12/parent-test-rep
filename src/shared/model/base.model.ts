export class BaseModel {
  id: any;

}
export class Base {
  id: number;
  Active: boolean;
  IsDeleted: boolean;
  CreateDate: Date;
  constructor() {
    this.id = 0;
    this.Active = false;
    this.IsDeleted = false;
    this.CreateDate = new Date();
  }
}
