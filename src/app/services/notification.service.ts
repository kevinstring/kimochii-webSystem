import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Éxito'): void {
    this.toastr.success(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  info(message: string, title: string = 'Información'): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  warning(message: string, title: string = 'Advertencia'): void {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }
}
