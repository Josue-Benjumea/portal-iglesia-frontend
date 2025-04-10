import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepertorioService } from '../../services/repertorio.service';
import { CancionService } from '../../services/cancion.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

 // Fix the import statement for ngx-color-picker
import ColorPickerModule from 'ngx-color-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editar-diapositivas',
  templateUrl: './editar-diapositivas.component.html',
  styleUrls: ['./editar-diapositivas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    //ColorPickerModule ,
    DragDropModule
  ]
})
export class EditarDiapositivasComponent implements OnInit {
  // Add environment property to make it accessible in the template
  environment = environment;
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewContainer') previewContainer!: ElementRef;
  
  repertorioId: number = 0;
  canciones: any[] = [];
  cancionSeleccionada: any = null;
  diapositivas: any[] = [];
  editorForm!: FormGroup;
  loading = false;
  buscandoLetra = false;
  modoEdicion = false;
  diapositivaActual = 0;
  modoVistaPrevia = false;
  
  // Nuevas propiedades para el editor avanzado
  fontFamilies = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' }
  ];
  
  fontSizes = [
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
    { value: '42px', label: '42' },
    { value: '48px', label: '48' },
    { value: '56px', label: '56' },
    { value: '64px', label: '64' },
    { value: '72px', label: '72' }
  ];
  
  textAlignments = [
    { value: 'left', label: 'Izquierda', icon: 'format_align_left' },
    { value: 'center', label: 'Centro', icon: 'format_align_center' },
    { value: 'right', label: 'Derecha', icon: 'format_align_right' },
    { value: 'justify', label: 'Justificado', icon: 'format_align_justify' }
  ];
  
  backgrounds = [
    { value: 'none', label: 'Ninguno' },
    { value: 'color', label: 'Color sólido' },
    { value: 'image', label: 'Imagen' },
    { value: 'gradient', label: 'Gradiente' }
  ];
  
  recursos: any = {
    imagenes: []
  };

  // Modificar el constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private repertorioService: RepertorioService,
    private cancionService: CancionService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef // <-- Agregar esto
  ) { }

  ngOnInit(): void {
    const repertorioIdStr = localStorage.getItem('repertorioId');
    
    if (!repertorioIdStr) {
      this.snackBar.open('No se ha seleccionado ningún repertorio', 'Cerrar', {
        duration: 5000
      });
      this.router.navigate(['/multimedia/listar-repertorios']);
      return;
    }
    
    this.repertorioId = parseInt(repertorioIdStr);
    this.cargarCanciones();
    
    this.editorForm = this.formBuilder.group({
      contenido: ['', Validators.required],
      fontFamily: ['Arial, sans-serif'],
      fontSize: ['32px'],
      textAlign: ['center'],
      textColor: ['#FFFFFF'],
      fontWeight: [false],
      fontStyle: [false],
      textDecoration: [false],
      backgroundType: ['color'],
      backgroundColor: ['#3F51B5'],
      backgroundImage: [''],
      gradientStart: ['#3F51B5'],
      gradientEnd: ['#2196F3'],
      gradientDirection: ['to bottom']
    });
    
    // Add this: Subscribe to form value changes to update preview in real-time
    this.editorForm.valueChanges.subscribe(() => {
      // Force change detection to update the preview
      this.actualizarPreviewEnTiempoReal();
    })
  }

  

  cargarCanciones(): void {
    this.loading = true;
    this.repertorioService.obtenerCancionesRepertorio(this.repertorioId)
      .subscribe({
        next: (data) => {
          this.canciones = data;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al cargar las canciones: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
          this.router.navigate(['/multimedia/listar-repertorios']);
        }
      });
  }
  // Add this new method to update the preview in real-time
actualizarPreviewEnTiempoReal(): void {
  if (!this.diapositivas || this.diapositivas.length === 0 || this.diapositivaActual < 0) {
    return;
  }
  
  // Create a temporary copy of the current slide with the new form values
  // This doesn't save the changes permanently until guardarDiapositiva() is called
  const formValues = this.editorForm.value;
  
  // Update the current slide's style properties for preview purposes
  this.diapositivas[this.diapositivaActual] = {
    ...this.diapositivas[this.diapositivaActual],
    contenido: formValues.contenido,
    estilo: {
      fontFamily: formValues.fontFamily,
      fontSize: formValues.fontSize,
      textAlign: formValues.textAlign,
      textColor: formValues.textColor,
      fontWeight: formValues.fontWeight,
      fontStyle: formValues.fontStyle,
      textDecoration: formValues.textDecoration,
      backgroundType: formValues.backgroundType,
      backgroundColor: formValues.backgroundColor,
      backgroundImage: formValues.backgroundImage,
      gradientStart: formValues.gradientStart,
      gradientEnd: formValues.gradientEnd,
      gradientDirection: formValues.gradientDirection
    }
  };
}

  seleccionarCancion(cancion: any): void {
    this.cancionSeleccionada = cancion;
    this.modoEdicion = false;
    this.diapositivaActual = 0;
    this.modoVistaPrevia = false;
    
    // Cargar recursos si existen
    if (cancion.recursos) {
      try {
        this.recursos = JSON.parse(cancion.recursos);
      } catch (e) {
        this.recursos = { imagenes: [] };
      }
    } else {
      this.recursos = { imagenes: [] };
    }
    
    if (cancion.diapositivas) {
      try {
        this.diapositivas = JSON.parse(cancion.diapositivas);
        
        // Asegurarse de que todas las diapositivas tengan las propiedades de estilo
        this.diapositivas = this.diapositivas.map(diapositiva => {
          return {
            tipo: diapositiva.tipo || 'texto',
            contenido: diapositiva.contenido || '',
            estilo: diapositiva.estilo || {
              fontFamily: 'Arial, sans-serif',
              fontSize: '32px',
              textAlign: 'center',
              textColor: '#FFFFFF',
              fontWeight: false,
              fontStyle: false,
              textDecoration: false,
              backgroundType: 'color',
              backgroundColor: '#3F51B5',
              backgroundImage: '',
              gradientStart: '#3F51B5',
              gradientEnd: '#2196F3',
              gradientDirection: 'to bottom'
            }
          };
        });
      } catch (e) {
        this.diapositivas = [];
      }
    } else {
      this.diapositivas = [];
    }
    
    if (this.diapositivas.length === 0 && !cancion.letra) {
      this.buscarLetraAutomatica();
    } else if (this.diapositivas.length === 0 && cancion.letra) {
      this.generarDiapositivasDesdeLetra(cancion.letra);
    } else {
      this.modoEdicion = true;
      this.cargarDiapositivaActual();
    }
  }

  buscarLetraAutomatica(): void {
    this.buscandoLetra = true;
    this.cancionService.obtenerLetra(this.cancionSeleccionada.artista, this.cancionSeleccionada.titulo)
      .subscribe({
        next: (data) => {
          this.buscandoLetra = false;
          if (data && data.lyrics) {
            this.cancionSeleccionada.letra = data.lyrics;
            this.generarDiapositivasDesdeLetra(data.lyrics);
          } else {
            this.snackBar.open('No se encontró la letra de la canción automáticamente. Por favor, ingrésela manualmente.', 'Cerrar', {
              duration: 5000
            });
            this.iniciarEdicionManual();
          }
        },
        error: (error) => {
          this.buscandoLetra = false;
          this.snackBar.open('Error al buscar la letra: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
          this.iniciarEdicionManual();
        }
      });
  }

  generarDiapositivasDesdeLetra(letra: string): void {
    // Dividir la letra en estrofas (separadas por líneas en blanco)
    const estrofas = letra.split(/\n\s*\n/);
    
    this.diapositivas = estrofas.map(estrofa => ({
      tipo: 'texto',
      contenido: estrofa.trim(),
      estilo: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        textAlign: 'center',
        textColor: '#FFFFFF',
        fontWeight: false,
        fontStyle: false,
        textDecoration: false,
        backgroundType: 'color',
        backgroundColor: '#3F51B5',
        backgroundImage: '',
        gradientStart: '#3F51B5',
        gradientEnd: '#2196F3',
        gradientDirection: 'to bottom'
      }
    }));
    
    if (this.diapositivas.length > 0) {
      this.modoEdicion = true;
      this.diapositivaActual = 0;
      this.cargarDiapositivaActual();
    } else {
      this.iniciarEdicionManual();
    }
  }

  iniciarEdicionManual(): void {
    this.diapositivas = [{
      tipo: 'texto',
      contenido: '',
      estilo: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        textAlign: 'center',
        textColor: '#FFFFFF',
        fontWeight: false,
        fontStyle: false,
        textDecoration: false,
        backgroundType: 'color',
        backgroundColor: '#3F51B5',
        backgroundImage: '',
        gradientStart: '#3F51B5',
        gradientEnd: '#2196F3',
        gradientDirection: 'to bottom'
      }
    }];
    this.modoEdicion = true;
    this.diapositivaActual = 0;
    this.cargarDiapositivaActual();
  }

  cargarDiapositivaActual(): void {
      const diapositiva = this.diapositivas[this.diapositivaActual];
      this.editorForm.patchValue({
        contenido: diapositiva.contenido,
        fontFamily: diapositiva.estilo.fontFamily || 'Arial, sans-serif',
        fontSize: diapositiva.estilo.fontSize || '32px',
        textAlign: diapositiva.estilo.textAlign || 'center',
        textColor: diapositiva.estilo.textColor || '#FFFFFF',
        fontWeight: diapositiva.estilo.fontWeight || false,
        fontStyle: diapositiva.estilo.fontStyle || false,
        textDecoration: diapositiva.estilo.textDecoration || false,
        backgroundType: diapositiva.estilo.backgroundType || 'color',
        backgroundColor: diapositiva.estilo.backgroundColor || '#3F51B5',
        backgroundImage: diapositiva.estilo.backgroundImage || '',
        gradientStart: diapositiva.estilo.gradientStart || '#3F51B5',
        gradientEnd: diapositiva.estilo.gradientEnd || '#2196F3',
        gradientDirection: diapositiva.estilo.gradientDirection || 'to bottom'
      }, { emitEvent: false });
      
      // Force immediate update of the form and view
      this.cdr.detectChanges();
  }
  
  moverDiapositiva(direccion: 'arriba' | 'abajo'): void {
      if (direccion === 'arriba' && this.diapositivaActual > 0) {
        debugger;
          this.guardarDiapositiva();
          
          
          // Create new array reference to trigger Angular change detection
          const newDiapositivas = [...this.diapositivas];
          [newDiapositivas[this.diapositivaActual - 1], newDiapositivas[this.diapositivaActual]] = 
          [newDiapositivas[this.diapositivaActual], newDiapositivas[this.diapositivaActual - 1]];
          
          this.diapositivas = newDiapositivas;
          this.diapositivaActual--;
          
          this.cargarDiapositivaActual();
      } else if (direccion === 'abajo' && this.diapositivaActual < this.diapositivas.length - 1) {
          this.guardarDiapositiva();
          
          // Create new array reference to trigger Angular change detection
          const newDiapositivas = [...this.diapositivas];
          [newDiapositivas[this.diapositivaActual], newDiapositivas[this.diapositivaActual + 1]] = 
          [newDiapositivas[this.diapositivaActual + 1], newDiapositivas[this.diapositivaActual]];
          
          this.diapositivas = newDiapositivas;
          this.diapositivaActual++;
          
          this.cargarDiapositivaActual();
      }
  }

  guardarDiapositiva(): void {
    if (this.editorForm.invalid || !this.diapositivas[this.diapositivaActual]) {
      return;
    }
    
    const formValues = this.editorForm.value;
    
    this.diapositivas[this.diapositivaActual] = {
      ...this.diapositivas[this.diapositivaActual],
      contenido: formValues.contenido,
      estilo: {
        ...this.diapositivas[this.diapositivaActual].estilo,
        fontFamily: formValues.fontFamily,
        fontSize: formValues.fontSize,
        textAlign: formValues.textAlign,
        textColor: formValues.textColor,
        fontWeight: formValues.fontWeight,
        fontStyle: formValues.fontStyle,
        textDecoration: formValues.textDecoration,
        backgroundType: formValues.backgroundType,
        backgroundColor: formValues.backgroundColor,
        backgroundImage: formValues.backgroundImage,
        gradientStart: formValues.gradientStart,
        gradientEnd: formValues.gradientEnd,
        gradientDirection: formValues.gradientDirection
      }
    };
}

  nuevaDiapositiva(): void {
    this.guardarDiapositiva();
    
    // Clonar el estilo de la diapositiva actual para la nueva
    const estiloActual = { ...this.diapositivas[this.diapositivaActual].estilo };
    
    this.diapositivas.push({
      tipo: 'texto',
      contenido: '',
      estilo: estiloActual
    });
    
    this.diapositivaActual = this.diapositivas.length - 1;
    this.editorForm.patchValue({
      contenido: ''
    });
  }

  eliminarDiapositiva(): void {
    if (this.diapositivas.length <= 1) {
      this.snackBar.open('No se puede eliminar la única diapositiva', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    this.diapositivas.splice(this.diapositivaActual, 1);
    
    if (this.diapositivaActual >= this.diapositivas.length) {
      this.diapositivaActual = this.diapositivas.length - 1;
    }
    
    this.cargarDiapositivaActual();
  }

  cambiarDiapositiva(index: number): void {
      if (index < 0 || index >= this.diapositivas.length) {
        return;
      }
      
      // Save current slide changes
      this.guardarDiapositiva();
      
      // Update current slide index
      this.diapositivaActual = index;
      
      // Load new slide data
      this.cargarDiapositivaActual();
      
      // Force UI update
      this.cdr.detectChanges();
  }

  guardarCambios(): void {
    this.guardarDiapositiva();
    
    this.loading = true;
    this.cancionService.actualizarCancion(
      this.cancionSeleccionada.id,
      this.cancionSeleccionada.letra || '',
      this.diapositivas,
      this.recursos
    ).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Diapositivas guardadas correctamente', 'Cerrar', {
          duration: 3000
        });
        this.cancionSeleccionada = null;
        this.cargarCanciones();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al guardar las diapositivas: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.cancionSeleccionada = null;
    this.modoVistaPrevia = false;
  }

  marcarRepertorioCompleto(): void {
    this.loading = true;
    this.repertorioService.actualizarEstadoRepertorio(this.repertorioId, 'listo')
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Repertorio marcado como completo', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/multimedia/listar-repertorios']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar el estado del repertorio: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  canMarcarRepertorioCompleto(): boolean {
    if (!this.canciones || this.canciones.length === 0) {
      return false;
    }
    return this.canciones.every(c => c.estado === 'lista');
  }

  volver(): void {
    this.router.navigate(['/multimedia/listar-repertorios']);
  }

  // Nuevos métodos para el editor avanzado
  toggleVistaPrevia(): void {
    this.guardarDiapositiva();
    this.modoVistaPrevia = !this.modoVistaPrevia;
  }

  subirImagenFondo(): void {
    this.fileInput.nativeElement.click();
  }

  // Agregar esta variable en la clase
  selectedTabIndex = 2; // Iniciar en el tab de Fondo (índice 2)
  
  // Modificar el método onFileSelected
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      this.cancionService.subirImagenFondo(file).subscribe({
        next: (response) => {
          this.loading = false;
          // Ensure the image path is properly formatted
          const imagePath = response.imagePath.startsWith('/') ? 
                         response.imagePath.substring(1) : 
                         response.imagePath;
          
          this.recursos.imagenes.push({
            path: imagePath,
            name: file.name
          });
          
          // Actualizar el formulario para usar la imagen subida
          this.editorForm.patchValue({
            backgroundType: 'image',
            backgroundImage: imagePath
          });
          
          // Forzar actualización de la vista
          this.cdr.detectChanges();
          
          // Mantener en el tab de Fondo
          this.selectedTabIndex = 2;
          
          // Actualizar preview
          this.actualizarPreviewEnTiempoReal();
          
          this.snackBar.open('Imagen subida correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al subir la imagen: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }



  getBackgroundStyle(): any {
    const formValues = this.editorForm.value;
    let style: any = {};
    
    if (this.modoVistaPrevia && this.diapositivas.length > 0) {
      const diapositivaActual = this.diapositivas[this.diapositivaActual];
      if (!diapositivaActual || !diapositivaActual.estilo) return {};
      
      const estilo = diapositivaActual.estilo;
      
      switch (estilo.backgroundType) {
        case 'image':
          if (estilo.backgroundImage) {
            // Construct proper URL
            const imageUrl = this.getImageUrl(estilo.backgroundImage);
            style.backgroundImage = `url('${imageUrl}')`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
          }
          break;
        case 'gradient':
          style.backgroundImage = `linear-gradient(${estilo.gradientDirection || 'to bottom'}, ${estilo.gradientStart || '#3F51B5'}, ${estilo.gradientEnd || '#2196F3'})`;
          break;
        default:
          style.backgroundColor = '#3F51B5';
      }
    } else {
      switch (formValues.backgroundType) {
        case 'image':
          if (formValues.backgroundImage) {
            // Construct proper URL
            const imageUrl = this.getImageUrl(formValues.backgroundImage);
            style.backgroundImage = `url('${imageUrl}')`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
          }
          break;
        case 'gradient':
          style.backgroundImage = `linear-gradient(${formValues.gradientDirection || 'to bottom'}, ${formValues.gradientStart || '#3F51B5'}, ${formValues.gradientEnd || '#2196F3'})`;
          break;
        default:
          style.backgroundColor = '#3F51B5';
      }
    }
    
    return style;
}
// Add this new helper method
getImageUrl(imagePath: string): string {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  // Ensure environment URL doesn't have trailing slash
  const baseUrl = this.environment.apiUrl.endsWith('/') 
                 ? this.environment.apiUrl.slice(0, -1) 
                 : this.environment.apiUrl;
  return `${baseUrl}/${cleanPath}`;
}

  getTextStyle(): any {
    const formValues = this.editorForm.value;
    let style: any = {};
    
    if (this.modoVistaPrevia && this.diapositivas.length > 0) {
      // En modo vista previa, usar los estilos de la diapositiva actual
      const diapositivaActual = this.diapositivas[this.diapositivaActual];
      if (!diapositivaActual || !diapositivaActual.estilo) return {};
      
      const estilo = diapositivaActual.estilo;
      
      style.fontFamily = estilo.fontFamily || 'Arial, sans-serif';
      style.fontSize = estilo.fontSize || '32px';
      style.textAlign = estilo.textAlign || 'center';
      style.color = estilo.textColor || '#FFFFFF';
      style.fontWeight = estilo.fontWeight ? 'bold' : 'normal';
      style.fontStyle = estilo.fontStyle ? 'italic' : 'normal';
      style.textDecoration = estilo.textDecoration ? 'underline' : 'none';
    } else {
      // En modo edición, usar los valores del formulario
      style.fontFamily = formValues.fontFamily || 'Arial, sans-serif';
      style.fontSize = formValues.fontSize || '32px';
      style.textAlign = formValues.textAlign || 'center';
      style.color = formValues.textColor || '#FFFFFF';
      style.fontWeight = formValues.fontWeight ? 'bold' : 'normal';
      style.fontStyle = formValues.fontStyle ? 'italic' : 'normal';
      style.textDecoration = formValues.textDecoration ? 'underline' : 'none';
    }
    
    return style;
  }

  duplicarDiapositiva(): void {
    if (this.diapositivas.length === 0) {
      return;
    }
    
    this.guardarDiapositiva();
    
    // Crear una copia profunda de la diapositiva actual
    const diapositivaActual = JSON.parse(JSON.stringify(this.diapositivas[this.diapositivaActual]));
    
    // Insertar la copia después de la diapositiva actual
    this.diapositivas.splice(this.diapositivaActual + 1, 0, diapositivaActual);
    
    // Cambiar a la nueva diapositiva
    this.diapositivaActual++;
    this.cargarDiapositivaActual();
  }



  seleccionarImagenExistente(imagePath: string): void {
    this.editorForm.patchValue({
      backgroundType: 'image',
      backgroundImage: imagePath
    });
    
    // Force update the current slide's background
    this.diapositivas[this.diapositivaActual].estilo.backgroundType = 'image';
    this.diapositivas[this.diapositivaActual].estilo.backgroundImage = imagePath;
    
    // Force change detection
    this.cdr.detectChanges();
  }
}


