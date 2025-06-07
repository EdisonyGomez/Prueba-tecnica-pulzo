import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para traducir valores de estado y género de inglés a español.
 * 
 * Uso en templates:
 * {{ valor | translate:'tipo' }} 
 * donde 'tipo' puede ser 'status' o 'gender'
 */
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {

    // Mapeo de estados a español
    private statusTranslations: { [key: string]: string } = {
        'alive': 'Vivo',
        'dead': 'Muerto',
        'unknown': 'Desconocido'
    };

    // Mapeo de géneros a español
    private genderTranslations: { [key: string]: string } = {
        'female': 'Femenino',
        'male': 'Masculino',
        'genderless': 'Sin género',
        'unknown': 'Desconocido'
    };

    /**
   * Transforma el valor según el tipo de traducción especificado
   * @param value Valor a traducir (en inglés)
   * @param type Tipo de traducción ('status' o 'gender')
   * @returns Valor traducido al español o el original si no hay traducción
   */
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