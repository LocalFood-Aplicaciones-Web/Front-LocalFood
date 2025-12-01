/**
 * GUÍA DE INTEGRACIÓN - Módulo de Restaurantes
 * ============================================
 * 
 * Este documento explica cómo el nuevo módulo de Restaurantes
 * se integra con el resto de la aplicación LunchMate.
 */

# 📱 Guía de Integración - Módulo de Restaurantes

## ✅ Lo que se ha Creado

### 1. Estructura de Carpetas
```
src/restaurants/
├── domain/model/
│   ├── restaurant.entity.js      ✅ Entidad de dominio
│   └── restaurant.model.js       ✅ Lógica de negocio
├── application/
│   └── restaurants.store.js      ✅ Store Pinia con estado reactivo
├── infrastructure/
│   ├── restaurants-api.js        ✅ Comunicación HTTP
│   ├── restaurant.resource.js    ✅ DTO para API
│   └── restaurant.assembler.js   ✅ Conversión Entity ↔ DTO
├── presentation/
│   ├── views/
│   │   └── Restaurantes.vue      ✅ Vista principal
│   ├── components/
│   │   ├── RestaurantCard.vue    ✅ Card del restaurante
│   │   └── RestaurantSearch.vue  ✅ Input de búsqueda
│   └── restaurants-routes.js     ✅ Rutas del módulo
└── README.md                      ✅ Documentación
```

## 🔗 Integraciones Realizadas

### 1. Router (`src/router/index.js`) ✅
**Cambio:** Importación de rutas del módulo de restaurantes
```javascript
import { restaurantsRoutes } from "../restaurants/presentation/restaurants-routes.js";

// En el array de rutas:
...restaurantsRoutes,
```

**Resultado:** La ruta `/restaurantes` ahora está disponible

### 2. Navbar/Encabezado ✅
**Ya integrado:** El menú ya tiene el item "🍴 Restaurantes"
```javascript
{ icon: '🍴', name: 'restaurantes', label: t('option.restaurants'), path: '/restaurantes' }
```

**Resultado:** El usuario puede navegar a restaurantes desde la barra lateral

### 3. Locales/i18n ✅
**Ya disponible:** Traducciones en español e inglés
- `option.restaurants` → "Restaurantes" / "Restaurants"
- `restaurants.title` → "Restaurantes" / "Restaurants"

**Resultado:** La interfaz se adapta al idioma del usuario

### 4. Calculate Store (`src/calculate/application/calculate.store.js`) ✅
**Ya existe:** El método `setSelectedRestaurant(restaurant)` está implementado
```javascript
function setSelectedRestaurant(restaurant) {
  console.log('🍽️ Restaurant selected:', restaurant.name)
  selectedRestaurant.value = restaurant
}
```

**Resultado:** Cuando el usuario selecciona un restaurante, pasa automáticamente a Calculate

## 🎯 Flujo de Uso Completo

### Paso 1: Ir a la sección de Contactos (Colegas)
```
Usuario → Barra Lateral → "👥 Colegas"
Resultado: Va a /colleagues para seleccionar personas al grupo
```

### Paso 2: Crear o seleccionar grupo
```
Usuario selecciona grupo o lo crea
Resultado: Grupo disponible para el cálculo
```

### Paso 3: Ir a la sección de Restaurantes
```
Usuario → Barra Lateral → "🍴 Restaurantes"
Resultado: Ve lista de restaurantes agrupados por nombre
```

### Paso 4: Buscar Restaurante
```
Usuario escribe en barra de búsqueda (ej: "KFC")
Resultado: Se filtran en tiempo real los restaurantes
```

### Paso 5: Ver Locales Disponibles
```
Usuario hace clic en "Los Locales" o "Mejor Calidad"
Resultado:
- "Los Locales" → Muestra todos los locales del restaurante
- "Mejor Calidad" → Muestra solo los con rating 3-5 ⭐
```

### Paso 6: Seleccionar un Local
```
Usuario hace clic en "Seleccionar" de un local específico
Resultado: 
- Restaurante se guarda en restaurantsStore.selectedRestaurant
- Se pasa a calculateStore.selectedRestaurant
- (En futuro) Puede redirigir a /calculo
```

### Paso 7: Ir a la sección de Cálculo
```
Usuario → Barra Lateral → "📐 Cálculo"
Resultado: Ve el restaurante seleccionado en la tarjeta
```

### Paso 8: Calcular Distancias
```
Usuario hace clic en "Calcular Distancia"
Resultado: Calcula distancias con el restaurante seleccionado
```

### Paso 9: Cambiar Restaurante (Opcional)
```
Usuario hace clic en "Editar Restaurante" en /calculo
(En futuro) Resultado: Abre modal/modal para seleccionar otro restaurante
SIN perder la lista de miembros
```

## 🗄️ Estructura de Datos en db.json

### Restaurantes en la BD
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "KFC - San Isidro",           // Nombre con ubicación
      "cuisine": "Comida Rápida",           // Tipo de cocina
      "rating": 4.5,                        // 1-5 estrellas
      "priceRange": "$$",                   // $, $$, $$$
      "address": {
        "street": "Av. Paseo de la República 5150",
        "city": "Lima",
        "latitude": -12.0904,
        "longitude": -77.0396
      },
      "phone": "+51 1 555-1001",
      "openHours": "10:00 AM - 11:00 PM",
      "userId": 1                           // Vinculado a usuario
    }
  ]
}
```

## 🎨 Componentes Principales

### RestaurantCard.vue
**Props:**
```javascript
{
  restaurant: {
    name: "KFC",
    cuisine: "Comida Rápida",
    priceRange: "$$",
    locales: [RestaurantEntity],
    count: 3,                    // Cantidad de locales
    averageRating: 4.5
  }
}
```

**Features:**
- ✅ Agrupa todos los locales de un restaurante
- ✅ Botones toggle: "Los Locales" vs "Mejor Calidad"
- ✅ Lista de locales filtrada
- ✅ Botón "Seleccionar" para cada local
- ✅ Información detallada (dirección, teléfono, horario)

### RestaurantSearch.vue
**Features:**
- ✅ Input de búsqueda en tiempo real
- ✅ Filtra por nombre del restaurante
- ✅ Filtra por tipo de cocina
- ✅ Muestra cantidad de resultados
- ✅ Botón para limpiar búsqueda

### Restaurantes.vue
**Features:**
- ✅ Página principal del módulo
- ✅ Header con estadísticas
- ✅ Incluye RestaurantSearch y RestaurantCard
- ✅ Grid responsivo
- ✅ Estados de loading/error

## 💾 Store Pinia (restaurants.store.js)

### Estado
```javascript
restaurants: []                    // Todos los restaurantes
selectedRestaurant: null          // El seleccionado actualmente
searchTerm: ''                    // Término de búsqueda
filterMode: 'all'                 // 'all' o 'quality'
loading: false
error: null
```

### Computed Properties
```javascript
groupedRestaurants    // Restaurantes agrupados + filtrados
filteredRestaurants   // Con búsqueda + filtro calidad
uniqueCuisines        // Tipos de cocina únicos
hasRestaurants        // Boolean si hay datos
```

### Actions
```javascript
fetchRestaurants()                // Carga desde API
selectRestaurant(restaurant)      // Selecciona uno
clearSelection()                  // Limpia selección
setSearchTerm(term)              // Establece búsqueda
toggleFilterMode(mode)           // Cambia 'all' ↔ 'quality'
getRestaurantsByName(name)       // Obtiene todos los locales
getBestRated(limit)              // Mejor calificados
```

## 🔄 Flujo de Datos del Store

```
┌─────────────────────┐
│ Restaurantes.vue    │ (Página)
└──────────┬──────────┘
           │
    onMounted()
           │
           ▼
┌──────────────────────────┐
│ restaurantsStore.         │
│ fetchRestaurants()       │
└──────────┬───────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
localStorage   restaurantsApi.getAll()
(instant)      (background)
    │             │
    └──────┬──────┘
           │
           ▼
    restaurants.value ← Datos cargados
           │
    ┌──────┴──────────────┐
    │                     │
    ▼                     ▼
groupedRestaurants   filteredRestaurants
(computed)           (computed)
    │                     │
    └──────────┬──────────┘
               │
               ▼
        RestaurantCard.vue (renderiza)
```

## 🎯 Integración con Calculate

### Cuando selecciona un restaurante:

```javascript
// En RestaurantCard.vue
function selectRestaurant(locale) {
  restaurantsStore.selectRestaurant(locale)           // Store local
  calculateStore.setSelectedRestaurant(locale)        // Store global
}
```

### En Calculo.vue puede acceder a:

```javascript
import { useRestaurantsStore } from '@/restaurants/application/restaurants.store.js'
import { useCalculateStore } from '@/calculate/application/calculate.store.js'

const restaurantsStore = useRestaurantsStore()
const calculateStore = useCalculateStore()

// Ambos tienen el mismo restaurante seleccionado
console.log(restaurantsStore.selectedRestaurant)   // El objeto
console.log(calculateStore.selectedRestaurant)     // El objeto
```

## 🔐 Seguridad y Privacidad

- ✅ **Filtrado por userId**: Solo ve restaurantes del usuario
- ✅ **localStorage por usuario**: `restaurants_${userId}`
- ✅ **API filtering**: El backend filtra por userId
- ✅ **No hay datos sensibles**: Solo info pública de restaurantes

## 📊 Performance

### Optimizaciones Implementadas

1. **localStorage Caching**
   - Carga instantánea (0ms)
   - Sincronización en background

2. **Computed Properties Reactivas**
   - Solo recalcula cuando cambian dependencias
   - Búsqueda y filtrado eficientes

3. **Grid Responsivo**
   - Adapta automaticamente a cualquier pantalla
   - No overflow de contenido

## 🚀 Cómo Testear

### 1. Ir a Restaurantes
```
http://localhost:5173/restaurantes
```

### 2. Buscar un Restaurante
```
Escribe "KFC" en la barra de búsqueda
Resultado: Muestra solo restaurantes KFC
```

### 3. Ver "Los Locales"
```
Haz clic en botón "Los Locales"
Resultado: Muestra todos los KFC disponibles (3 locales)
```

### 4. Ver "Mejor Calidad"
```
Haz clic en botón "Mejor Calidad"
Resultado: Muestra solo KFC con rating 3-5 ⭐
```

### 5. Seleccionar un Local
```
Haz clic en "Seleccionar" de un local
Resultado: Se guarda en el store y puede usarse en Cálculo
```

### 6. Verificar en Consola
```
F12 → Consola
Filtra por logs con emojis:
- 📡 Fetch restaurantes
- 💾 Guardado en localStorage
- 🔍 Filtro de búsqueda
- ✅ Restaurante seleccionado
```

## 📝 Próximas Mejoras

- [ ] Modal para cambiar restaurante durante cálculo
- [ ] Filtro por rango de precio
- [ ] Mapa interactivo de restaurantes
- [ ] Integración con Google Maps
- [ ] Historial de restaurantes visitados
- [ ] Favoritos por grupo
- [ ] Valoraciones de usuarios
- [ ] Menú del restaurante

## 🔗 Rutas Disponibles

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/restaurantes` | `Restaurantes.vue` | Lista de restaurantes |
| `/calculo` | `Calculo.vue` | Cálculo de distancias (usa restaurante seleccionado) |
| `/colegas` | `Colegas.vue` | Gestión de colegas |

## 📚 Documentación Adicional

- Leer `src/restaurants/README.md` para detalles técnicos
- Leer `src/restaurants/domain/model/restaurant.model.js` para métodos de negocio
- Leer `src/restaurants/application/restaurants.store.js` para estado y acciones

---

**¡El módulo está 100% integrado y funcional!** ✨

