import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface SizeInventory {
  size: string;
  quantity: number;
}

interface ProductForm {
  name: string;
  provider: string;
  description: string;
  character: string;
  isClothing: boolean;
  isConsigned: boolean;
  consignmentCode: string;
  cost: number;
  price: number;
  quantity: number;
  selectedCategories: string[];
  selectedTags: string[];
  sizes: SizeInventory[];
}

interface Category {
  id: string;
  label: string;
}

interface Tag {
  id: string;
  label: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  availableSizes: string[] = ['S', 'M', 'L', 'XL', '10', '12', '14'];

  productForm: ProductForm = {
    name: '',
    provider: '',
    description: '',
    character: '',
    isClothing: false,
    isConsigned: false,
    consignmentCode: '',
    cost: 0,
    price: 0,
    quantity: 0,
    selectedCategories: [],
    selectedTags: [],
    sizes: []
  };

  categories: Category[] = [
    { id: 'collares', label: 'collares' },
    { id: 'cadenas', label: 'cadenas' },
    { id: 'billeteras', label: 'billeteras' },
    { id: 'vapes', label: 'vapes' },
    { id: 'relojis', label: 'Relojis' },
    { id: 'posters', label: 'Posters' },
    { id: 'electronico', label: 'Electronico' },
    { id: 'articulos', label: 'Artículos' },
    { id: 'legos', label: 'Legos' },
    { id: 'llaveros', label: 'Llaveros' },
    { id: 'cumplanos', label: 'Cumpleaños' },
    { id: 'anillos', label: 'Anillos' },
    { id: 'regalos', label: 'Regalos' },
    { id: 'peluches', label: 'Peluches' },
    { id: 'telefonos', label: 'Telefonos' },
    { id: 'juguetes', label: 'Juguetes' },
    { id: 'pines', label: 'Pines' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'mascotas', label: 'Mascotas' },
    { id: 'tazas', label: 'Tazas' },
    { id: 'playeras', label: 'Playeras' },
    { id: 'almohadas', label: 'Almohadas' },
    { id: 'sublimaciones', label: 'Sublimaciones' },
    { id: '3d', label: '3D' },
    { id: 'hotwheels', label: 'Hotwheels' },
    { id: 'mousepada', label: 'Mousepada' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'familiar', label: 'Familiar' },
    { id: 'mangas', label: 'Mangas' },
    { id: 'pokemontcg', label: 'Pokemon TCG' },
    { id: 'peluches-almohada', label: 'Peluches/almohada' },
    { id: 'aretes', label: 'Aretes' },
    { id: 'funko', label: 'Funko' },
    { id: 'figuras', label: 'Figuras' },
    { id: 'squishys', label: 'Squishys' }
  ];

  tags: Tag[] = [
    { id: 'anime', label: 'anime' },
    { id: 'vapes', label: 'vapes' },
    { id: 'ropa', label: 'ropa' },
    { id: 'naruto', label: 'Naruto' },
    { id: 'onepiece', label: 'One Piece' },
    { id: 'dragonball', label: 'Dragon ball' },
    { id: 'amor', label: 'amor' },
    { id: 'cables', label: 'Cables' },
    { id: 'cargadores', label: 'cargadores' },
    { id: 'shinigeki', label: 'Shinigeki No Kiojin' },
    { id: 'chibi', label: 'chibi' },
    { id: 'demonslayer', label: 'Demon Slayer' },
    { id: 'electronicos', label: 'Electronicos' },
    { id: 'regalo', label: 'Regalo' },
    { id: 'adorno', label: 'Adorno' },
    { id: 'legos', label: 'Legos' },
    { id: 'parejas', label: 'Parejas' },
    { id: 'anillos', label: 'Anillos' },
    { id: 'loveiswar', label: 'Love is war' },
    { id: 'casual', label: 'Casual' },
    { id: 'chainsaw', label: 'Chainsaw Man' },
    { id: 'jujutsu', label: 'Jujutsu Kaisen' },
    { id: 'neko', label: 'Neko' },
    { id: 'gracioso', label: 'Gracioso' },
    { id: 'series', label: 'Series' },
    { id: 'marvel', label: 'Marvel' },
    { id: 'fortnite', label: 'Fortnite' },
    { id: '3d', label: '3d' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'dc', label: 'DC' },
    { id: 'starwars', label: 'Starwars' },
    { id: 'calcetines', label: 'Calcetines' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'comida', label: 'Comida' },
    { id: 'mangas', label: 'Mangas' },
    { id: 'coleccionable', label: 'Coleccionable' },
    { id: 'personalizable', label: 'Personalizable' }
  ];

  productList: ProductForm[] = [];
  isLoading: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.info('Agregar nuevo producto al sistema', 'Nuevo Producto');
  }

  toggleCategory(categoryId: string) {
    const index = this.productForm.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.productForm.selectedCategories.splice(index, 1);
    } else {
      this.productForm.selectedCategories.push(categoryId);
    }
  }

  toggleTag(tagId: string) {
    const index = this.productForm.selectedTags.indexOf(tagId);
    if (index > -1) {
      this.productForm.selectedTags.splice(index, 1);
    } else {
      this.productForm.selectedTags.push(tagId);
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.productForm.selectedCategories.includes(categoryId);
  }

  isTagSelected(tagId: string): boolean {
    return this.productForm.selectedTags.includes(tagId);
  }

  onClothingToggle() {
    if (this.productForm.isClothing && this.productForm.sizes.length === 0) {
      // Inicializar tallas
      this.productForm.sizes = this.availableSizes.map(size => ({
        size: size,
        quantity: 0
      }));
    } else if (!this.productForm.isClothing) {
      // Limpiar tallas
      this.productForm.sizes = [];
    }
  }

  getTotalClothingQuantity(): number {
    return this.productForm.sizes.reduce((total, size) => total + size.quantity, 0);
  }

  validateProduct(): boolean {
    if (!this.productForm.name.trim()) {
      this.notificationService.error('El nombre del producto es requerido', 'Validación');
      return false;
    }
    if (!this.productForm.provider.trim()) {
      this.notificationService.error('El proveedor es requerido', 'Validación');
      return false;
    }
    if (this.productForm.price <= 0) {
      this.notificationService.error('El precio debe ser mayor a 0', 'Validación');
      return false;
    }
    if (this.productForm.isClothing) {
      const totalClothingQty = this.getTotalClothingQuantity();
      if (totalClothingQty <= 0) {
        this.notificationService.error('Debes agregar cantidad en al menos una talla', 'Validación');
        return false;
      }
    } else {
      if (this.productForm.quantity <= 0) {
        this.notificationService.error('La cantidad debe ser mayor a 0', 'Validación');
        return false;
      }
    }
    if (this.productForm.isConsigned && !this.productForm.consignmentCode.trim()) {
      this.notificationService.error('El código de consignación es requerido', 'Validación');
      return false;
    }
    return true;
  }

  saveProduct() {
    if (!this.validateProduct()) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const newProduct = JSON.parse(JSON.stringify(this.productForm));
      this.productList.unshift(newProduct);
      
      this.notificationService.success(
        `Producto "${this.productForm.name}" guardado exitosamente`,
        'Producto Guardado'
      );

      this.resetForm();
      this.isLoading = false;
    }, 800);
  }

  saveAndAddMore() {
    if (!this.validateProduct()) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const newProduct = JSON.parse(JSON.stringify(this.productForm));
      this.productList.unshift(newProduct);
      
      this.notificationService.success(
        `Producto "${this.productForm.name}" guardado. Listo para agregar más`,
        'Producto Guardado'
      );

      this.resetForm();
      this.isLoading = false;
    }, 800);
  }

  saveAll() {
    if (!this.validateProduct()) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const newProduct = JSON.parse(JSON.stringify(this.productForm));
      this.productList.unshift(newProduct);
      
      this.notificationService.success(
        `${this.productList.length} producto(s) guardado(s) exitosamente`,
        'Guardado Total'
      );

      this.resetForm();
      this.productList = [];
      this.isLoading = false;
    }, 800);
  }

  resetForm() {
    this.productForm = {
      name: '',
      provider: '',
      description: '',
      character: '',
      isClothing: false,
      isConsigned: false,
      consignmentCode: '',
      cost: 0,
      price: 0,
      quantity: 0,
      selectedCategories: [],
      selectedTags: [],
      sizes: []
    };
  }

  getCategoryLabel(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.label || categoryId;
  }

  getTagLabel(tagId: string): string {
    const tag = this.tags.find(t => t.id === tagId);
    return tag?.label || tagId;
  }

  getProfitMargin(): number {
    if (this.productForm.price > 0 && this.productForm.cost > 0) {
      return this.productForm.price - this.productForm.cost;
    }
    return 0;
  }

  getTotalProductValue(): number {
    return this.productForm.price * this.productForm.quantity;
  }
}
