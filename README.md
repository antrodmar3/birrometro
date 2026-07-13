# Birrómetro

MVP local-first para registrar el consumo de cerveza. No necesita instalación ni compilación.

## Probar en local

Sirve esta carpeta con cualquier servidor estático, por ejemplo:

```powershell
npx serve .
```

También se puede abrir `index.html` directamente, aunque la instalación como PWA y el modo sin conexión requieren HTTP/HTTPS.

## Funciones incluidas

- Botón móvil fijo “+1 cerveza” con selección rápida de litro, lata o yonkilata.
- Registro automático del día y la hora exactos en cada alta.
- Menú rápido para añadir registros olvidados o deshacer el último.
- Racha actual y gráficos por día de la semana y franja horaria.
- Respuesta háptica ligera en dispositivos compatibles.
- Selector con litro, lata estilizada (330 ml), lata gordita (330 ml), Sin (330 ml y 0 %), copa, cortá, tercio, botellín, pinta, caña, grande en vaso de sidra (400 ml) y yonkilata.
- Resumen de volumen en litros o mililitros para hoy, semana, mes y año.
- Importación inicial única de 207 consumiciones aportadas por el usuario.
- Distribución extrapolada de esa importación desde el 13 de enero de 2026, con horarios y mayor peso en viernes y sábados.
- Navegación móvil inferior para Inicio, Formatos, Estadísticas, Historial, Mi perfil y Álbum.
- Ranking de formatos con porcentajes, litros, barras y gráfico circular.
- Panel de insights con favorito, día más activo, media semanal y evolución mensual.
- Sistema visual renovado con Plus Jakarta Sans y Bricolage Grotesque.
- Donut interactivo mediante hover, teclado o pulsación táctil.
- Navegación inferior con iconos SVG y etiquetas legibles.
- Resumen diario, semanal y mensual.
- Cálculo orientativo de unidades de alcohol: `ml × % vol. / 1000`.
- Historial, borrado y exportación JSON.
- Persistencia local y PWA instalable.
- Álbum cerrado de 522 cervezas con nombre, país, bandera, tipo, graduación, fermentación y perfil de sabor.

## Catálogo de cervezas

La fuente maestra es `Cervezas.xlsx`. Para regenerar el archivo estático que consume la app después de actualizar el Excel:

```powershell
.\tools\generate-beer-catalog.ps1
```

El resultado se guarda en `beer-catalog.js`; no debe editarse manualmente.

Para buscar y auditar fotografías abiertas en Wikimedia Commons:

```powershell
C:\Python39\python.exe .\tools\enrich-beer-images.py
```

Las coincidencias quedan registradas en `tools/beer-image-audit.csv`. Las fichas sin una fotografía suficientemente fiable muestran una ilustración propia, por lo que el álbum nunca deja el área visual vacía.

## Publicación

Cada cambio enviado a la rama `main` se publica automáticamente con GitHub Pages mediante GitHub Actions.

La app sincroniza de forma privada los datos de cada usuario mediante Google Authentication y Cloud Firestore.
