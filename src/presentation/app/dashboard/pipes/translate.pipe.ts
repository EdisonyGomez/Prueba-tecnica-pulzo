import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  private statusTranslations: {[key: string]: string} = {
    'alive': 'Vivo',
    'dead': 'Muerto',
    'unknown': 'Desconocido'
  };

  private genderTranslations: {[key: string]: string} = {
    'female': 'Femenino',
    'male': 'Masculino',
    'genderless': 'Sin género',
    'unknown': 'Desconocido'
  };

  transform(value: string, type: 'status' | 'gender'): string {
    if (!value) return '';
    
    const lowerValue = value.toLowerCase();
    
    if (type === 'status') {
      return this.statusTranslations[lowerValue] || value;
    } else if (type === 'gender') {
      return this.genderTranslations[lowerValue] || value;
    }
    
    return value;
  }
}