# CSS Code Ordered

Una extensión para VSCode que organiza tus propiedades CSS en grupos con comentarios descriptivos y opción de orden alfabético.

## Características
- Agrupa propiedades CSS (posicionamiento, modelo de caja, tipografía, etc.) con comentarios como `/* Tipografía */`.
- Ordena alfabéticamente dentro de cada grupo (configurable).
- Formatea automáticamente al guardar o manualmente con un comando.

## Cómo usar
1. Instala la extensión desde el Marketplace de VSCode.
2. Abre un archivo CSS.
3. Usa el comando "Format CSS with CssCodeOrdered" (`Ctrl+Shift+P`) o guarda el archivo (`Ctrl+S`).

## Configuración
- **Orden alfabético**: Activa "CSS Code Ordered: Sort Alphabetically" en la configuración de VSCode para ordenar propiedades alfabéticamente dentro de cada grupo.

## Ejemplo
**Antes:**
```css
div {
  color: white;
  padding: 1rem;
  display: flex;
  font-size: 16px;
}
```
**Después:**
```css
div {
  /* Modelo de caja */
  display: flex;

  /* Relleno */
  padding: 1rem;

  /* Tipografía */
  font-size: 16px;

  /* Colores y efectos */
  color: white;
}
```

## Contribuciones
¡Sugerencias y pull requests son bienvenidos! Reporta problemas en el repositorio de GitHub (si lo creas).

## Autor
Creado por Iker Rodríguez.

