import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
  characters: Character[] = [];
  currentPage = 1;
  totalPages = 0;

  favoriteCharacters: Character[] = [];

  // Controles de formulario
  searchControl = new FormControl('');
  statusControl = new FormControl('');
  genderControl = new FormControl('');

  // Variables para el modal
  showModal = false;
  selectedCharacter: Character | null = null;

  showFavorites = false; // Control para mostrar favoritos


  // Opciones para los selects
  statusOptions = ['', 'alive', 'dead', 'unknown'];
  genderOptions = ['', 'female', 'male', 'genderless', 'unknown'];

  private destroy$ = new Subject<void>();
  private getCharactersUseCase = inject(GetCharacterUseCase);

  ngOnInit(): void {
    this.setupFilterListeners();
    this.loadCharacters();
    this.loadCharacters();
  }

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

  private onFilterChange(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  loadCharacters(): void {
    const filters = {
      name: this.searchControl.value || undefined,
      status: this.statusControl.value || undefined,
      gender: this.genderControl.value || undefined,
    };

    this.getCharactersUseCase.excecute(this.currentPage, filters)
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
    this.selectedCharacter = character;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Deshabilita el scroll
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCharacter = null;
    document.body.style.overflow = 'auto'; // Habilita el scroll nuevamente
  }


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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}