import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inventory-container">
      <h1>Control de Inventario</h1>
      <p>Esta sección está en desarrollo...</p>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 2rem;
    }
  `]
})
export class InventoryComponent {}
