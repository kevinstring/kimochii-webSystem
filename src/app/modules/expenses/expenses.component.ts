import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface Expense {
  description: string;
  category: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading: boolean = false;
  
  newExpense: Expense = {
    description: '',
    category: 'otros',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };

  categories = [
    { value: 'arriendo', label: 'Arriendo' },
    { value: 'servicios', label: 'Servicios (Luz, agua, etc)' },
    { value: 'salarios', label: 'Salarios' },
    { value: 'materiales', label: 'Materiales y Suministros' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'publicidad', label: 'Publicidad y Marketing' },
    { value: 'otros', label: 'Otros' }
  ];

  totalExpenses: number = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {}

  addExpense() {
    if (this.newExpense.description && this.newExpense.amount > 0) {
      const expense: Expense = { ...this.newExpense };
      this.expenses.push(expense);
      this.calculateTotal();
      this.notificationService.success(`Gasto de Q${this.newExpense.amount.toFixed(2)} agregado`, 'Gasto registrado');
      this.resetForm();
    } else {
      this.notificationService.warning('Por favor completa todos los campos correctamente', 'Validación');
    }
  }

  removeExpense(index: number) {
    this.expenses.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  resetForm() {
    this.newExpense = {
      description: '',
      category: 'otros',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    };
  }

  saveExpenses() {
    if (this.expenses.length > 0) {
      this.isLoading = true;
      
      const expenseData = {
        expenses: this.expenses,
        total: this.totalExpenses,
        date: new Date()
      };

      // Simular petición al backend (reemplazar con API real)
      setTimeout(() => {
        try {
          console.log('Gastos para enviar al backend:', expenseData);
          
          this.expenses = [];
          this.totalExpenses = 0;
          this.isLoading = false;
          this.notificationService.success('Los gastos han sido registrados correctamente', 'Gastos Guardados');
        } catch (error) {
          this.isLoading = false;
          this.notificationService.error('No se pudieron registrar los gastos. Intenta de nuevo.', 'Error');
        }
      }, 1000);
    }
  }

  getCategoryLabel(value: string): string {
    return this.categories.find(c => c.value === value)?.label || value;
  }
}
