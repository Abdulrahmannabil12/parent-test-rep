import { Injectable } from "@angular/core";

import { ToastContainerDirective, ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  toastContainer: ToastContainerDirective;
  constructor(public toastr: ToastrService) {}
  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
  }
  showSuccesss() {
    this.toastr.success("Hello world!", "Toastr fun!");
  }
  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }
}
