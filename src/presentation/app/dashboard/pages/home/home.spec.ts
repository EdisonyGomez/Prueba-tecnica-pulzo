import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import Home from './home';
import { GetCharacterUseCase } from '@domain/characters/useCases/get-character.useCase';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Character } from '@domain/characters/models/character';

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let getCharacterUseCaseSpy: jasmine.SpyObj<GetCharacterUseCase>;

  const mockCharacters: Character[] = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'alive',
      species: 'Human',
      gender: 'male',
      origin: { name: 'Earth (C-137)' },
      location: { name: 'Citadel of Ricks'},
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],}
  ];

  beforeEach(async () => {
    // Crear un spy para el caso de uso
    getCharacterUseCaseSpy = jasmine.createSpyObj<GetCharacterUseCase>('GetCharacterUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,Home],
      declarations: [Home, TranslatePipe],
      providers: [
        { provide: GetCharacterUseCase, useValue: getCharacterUseCaseSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
    // Configurar el spy para devolver datos mock
    getCharacterUseCaseSpy.execute.and.returnValue(
      of({ info: { pages: 2 }, results: mockCharacters })
    );

    fixture.detectChanges(); // Triggers ngOnInit

    expect(getCharacterUseCaseSpy.execute).toHaveBeenCalledWith(1, {});
    expect(component.characters.length).toBe(1);
    expect(component.totalPages).toBe(2);
  });

  it('should apply filters and reload characters', fakeAsync(() => {
    // Configurar el spy
    getCharacterUseCaseSpy.execute.and.returnValue(
      of({ info: { pages: 1 }, results: mockCharacters })
    );

    // Simular cambios en los filtros
    component.searchControl.setValue('Rick');
    component.statusControl.setValue('alive');
    component.genderControl.setValue('male');
    
    // Avanzar el tiempo para el debounce
    tick(500);
    fixture.detectChanges();

    expect(getCharacterUseCaseSpy.execute).toHaveBeenCalledWith(1, {
      name: 'Rick',
      status: 'alive',
      gender: 'male'
    });
  }));

  it('should handle empty response', () => {
    getCharacterUseCaseSpy.execute.and.returnValue(
      of({ info: {}, results: [] })
    );

    fixture.detectChanges();

    expect(component.characters.length).toBe(0);
    expect(component.totalPages).toBe(0);
  });

  it('should toggle favorite status', () => {
    const mockChar = mockCharacters[0];
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const setItemSpy = spyOn(localStorage, 'setItem');

    // Agregar a favoritos
    component.toggleFavorite(mockChar, new Event('click'));
    expect(component.isFavorite(mockChar)).toBeTrue();
    expect(setItemSpy).toHaveBeenCalled();

    // Quitar de favoritos
    component.toggleFavorite(mockChar, new Event('click'));
    expect(component.isFavorite(mockChar)).toBeFalse();
  });

  it('should navigate between pages', () => {
    getCharacterUseCaseSpy.execute.and.returnValue(
      of({ info: { pages: 3 }, results: mockCharacters })
    );

    fixture.detectChanges();

    // Ir a página 2
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(getCharacterUseCaseSpy.execute).toHaveBeenCalledWith(2, {});

    // Volver a página 1
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should clear filters', () => {
    component.searchControl.setValue('Rick');
    component.statusControl.setValue('alive');
    component.currentPage = 2;

    getCharacterUseCaseSpy.execute.and.returnValue(
      of({ info: { pages: 1 }, results: mockCharacters })
    );

    component.clearFilters();
    
    expect(component.searchControl.value).toBe('');
    expect(component.statusControl.value).toBe('');
    expect(component.currentPage).toBe(1);
    expect(getCharacterUseCaseSpy.execute).toHaveBeenCalledWith(1, {});
  });
});