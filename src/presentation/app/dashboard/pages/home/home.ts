import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Character } from '@domain/characters/models/character';
import { GetCharacterUseCase } from '@domain/characters/useCases/get-character.useCase';
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home implements OnInit, OnDestroy {

  // Lista de personajes y paginación
  characters: Character[] = [];
  currentPage = 1;
  totalPages = 0;

  // Lista de personajes favoritos
  favoriteCharacters: Character[] = [];
  showFavorites = false;

  // Controles de formulario para filtros
  searchControl = new FormControl('');
  statusControl = new FormControl('');
  genderControl = new FormControl('');

  // BehaviorSubject para el modal
  private modalState$ = new BehaviorSubject<{
    show: boolean;
    character: Character | null;
  }>({ show: false, character: null });

  // Opciones para los selects
  statusOptions = ['', 'alive', 'dead', 'unknown'];
  genderOptions = ['', 'female', 'male', 'genderless', 'unknown'];

  // Para manejar la desuscripción de observables
  private destroy$ = new Subject<void>();

  // Caso de uso para obtener personajes
  private getCharactersUseCase = inject(GetCharacterUseCase);

  ngOnInit(): void {
    this.setupFilterListeners();
    this.loadCharacters();
    this.loadFavorites();
  }

  // Configuración de los listeners para cambios en los filtros
  private setupFilterListeners(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.onFilterChange());

    this.statusControl.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => this.onFilterChange());

    this.genderControl.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => this.onFilterChange());
  }

  // Maneja cambios en los filtros (reinicia paginación)
  private onFilterChange(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  // Carga personajes con los filtros actuales
  loadCharacters(): void {
    const filters = {
      name: this.searchControl.value || undefined,
      status: this.statusControl.value || undefined,
      gender: this.genderControl.value || undefined,
    };

    this.getCharactersUseCase.execute(this.currentPage, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.characters = response.results;
          this.totalPages = response.info.pages;
        },
        error: (error) => {
          this.characters = [];
          this.totalPages = 0;
          console.error('Error loading characters:', error);
        }
      });
  }

  // Navegación de páginas
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  previousPage(): void {  // Asegúrate que coincida con el template
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCharacters();
    }
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusControl.setValue('');
    this.genderControl.setValue('');
    this.currentPage = 1;
    this.loadCharacters();
  }

  // Métodos para el modal
  openModal(character: Character): void {
    this.modalState$.next({ show: true, character });
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.modalState$.next({ show: false, character: null });
    document.body.style.overflow = 'auto';
  }

  get modalState() {
    return this.modalState$.value;
  }

 //métodos para manejar favoritos
  private loadFavorites(): void {
    const favorites = localStorage.getItem('rickAndMortyFavorites');
    this.favoriteCharacters = favorites ? JSON.parse(favorites) : [];
  }

  private saveFavorites(): void {
    localStorage.setItem('rickAndMortyFavorites', JSON.stringify(this.favoriteCharacters));
  }

  isFavorite(character: Character): boolean {
    return this.favoriteCharacters.some(fav => fav.id === character.id);
  }

  toggleFavorite(character: Character, event: Event): void {
    event.stopPropagation(); // Evita que se abra el modal

    const index = this.favoriteCharacters.findIndex(fav => fav.id === character.id);

    if (index === -1) {
      // Agregar a favoritos
      this.favoriteCharacters.push(character);
    } else {
      // Quitar de favoritos
      this.favoriteCharacters.splice(index, 1);
    }

    this.saveFavorites();
  }

  toggleShowFavorites(): void {
    this.showFavorites = !this.showFavorites;
    if (!this.showFavorites) {
      this.loadCharacters();
    }
  }

  // Limpieza al destruir componente
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}