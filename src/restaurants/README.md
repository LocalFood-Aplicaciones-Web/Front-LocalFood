/**
 * @file README.md
 * @description Documentation for Restaurants Module
 */

# 🍽️ Módulo de Restaurantes

## 📋 Descripción

El módulo de **Restaurantes** es un bounded context que gestiona toda la información de restaurantes disponibles en la aplicación. Permite a los usuarios buscar, filtrar y seleccionar restaurantes para usarlos en los cálculos de distancias.

## 🎯 Funcionalidades

### ✨ Características Principales

1. **Búsqueda por Nombre** 
   - Filtro en tiempo real mientras escribes
   - Busca en nombre del restaurante y tipo de cocina
   - Muestra cantidad de resultados encontrados

2. **Agrupación de Restaurantes**
   - Agrupa por nombre base (e.g., "KFC" agrupa todos los KFC)
   - Muestra cantidad de locales por restaurante
   - Calcula rating promedio

3. **Opción Extra - Filtrado de Calidad**
   - **"Los Locales"** - Muestra TODOS los locales disponibles
   - **"Mejor Calidad"** - Muestra solo locales con rating 3-5 ⭐
   - Toggle buttons para cambiar entre vistas

4. **Selección de Restaurante**
   - Selecciona un local específico desde cualquier restaurante
   - Integración automática con el módulo de Calculate
   - Pasa la información inmediatamente a la sección de Cálculo

5. **Persistencia de Datos**
   - Carga desde localStorage para UI instantánea
   - Sincronización en background con la API
   - Datos filtrados por usuario (userId)

## 📁 Estructura DDD

```
restaurants/
├── domain/
│   └── model/
│       ├── restaurant.entity.js      # Entity con lógica de dominio
│       └── restaurant.model.js       # Model con reglas de negocio
├── application/
│   └── restaurants.store.js          # Pinia store de estado
├── infrastructure/
│   ├── restaurants-api.js            # HTTP API communication
│   ├── restaurant.resource.js        # DTO para API
│   └── restaurant.assembler.js       # Conversión Entity ↔ Resource
└── presentation/
    ├── views/
    │   └── Restaurantes.vue          # Página principal
    ├── components/
    │   ├── RestaurantCard.vue        # Card del restaurante
    │   └── RestaurantSearch.vue      # Input de búsqueda
    └── restaurants-routes.js         # Rutas del módulo
```

## 🏗️ Arquitectura

### Domain Layer (`domain/`)

#### `restaurant.entity.js` - RestaurantEntity
Entidad de dominio que representa un restaurante individual.

**Métodos principales:**
- `isHighQuality()` - Valida si tiene calidad 3-5 estrellas
- `getFullAddress()` - Retorna dirección formateada
- `getCoordinates()` - Retorna {latitude, longitude}
- `getPriceRangeDisplay()` - Formatea rango de precio
- `getCuisineIcon()` - Retorna emoji del tipo de cocina

#### `restaurant.model.js` - RestaurantModel
Model que contiene la lógica de negocio del dominio.

**Métodos estáticos:**
- `groupRestaurantsByName(restaurants)` - Agrupa por nombre base
- `filterHighQuality(restaurants)` - Filtra por calidad 3-5
- `searchByName(restaurants, term)` - Búsqueda por nombre
- `filterByCuisine(restaurants, cuisine)` - Filtra por tipo
- `getUniqueCuisines(restaurants)` - Obtiene tipos únicos
- `sortByRating(restaurants)` - Ordena por rating

### Application Layer (`application/`)

#### `restaurants.store.js` - Pinia Store
Gestiona el estado global de restaurantes.

**Estado:**
```javascript
{
  restaurants: [],           // Todos los restaurantes del usuario
  selectedRestaurant: null,  // Restaurante actualmente seleccionado
  searchTerm: '',           // Término de búsqueda actual
  filterMode: 'all',        // 'all' o 'quality'
  loading: false,
  error: null
}
```

**Computed Properties:**
- `groupedRestaurants` - Restaurantes agrupados y filtrados
- `filteredRestaurants` - Restaurantes con filtros aplicados
- `uniqueCuisines` - Tipos de cocina únicos
- `hasRestaurants` - Boolean si hay restaurantes

**Actions:**
- `fetchRestaurants()` - Carga desde API (con localStorage)
- `selectRestaurant(restaurant)` - Selecciona un restaurante
- `clearSelection()` - Limpia selección
- `setSearchTerm(term)` - Establece término de búsqueda
- `toggleFilterMode(mode)` - Cambia entre 'all' y 'quality'
- `getRestaurantsByName(baseName)` - Obtiene todos los locales
- `getBestRated(limit)` - Obtiene mejor calificados

### Infrastructure Layer (`infrastructure/`)

#### `restaurants-api.js` - API Client
Comunicación HTTP con el backend.

**Métodos:**
```javascript
restaurantsApi.getAll()           // GET /restaurants
restaurantsApi.getById(id)        // GET /restaurants/:id
restaurantsApi.create(restaurant) // POST /restaurants
restaurantsApi.update(id, data)   // PUT /restaurants/:id
restaurantsApi.delete(id)         // DELETE /restaurants/:id
```

#### `restaurant.resource.js` - DTO
Data Transfer Object para la comunicación API.

#### `restaurant.assembler.js` - Assembler
Convierte entre RestaurantEntity (dominio) y RestaurantResource (DTO).

### Presentation Layer (`presentation/`)

#### `Restaurantes.vue` - Vista Principal
Página que agrupa todo el módulo de restaurantes.

**Características:**
- Header con estadísticas (restaurantes, locales totales)
- Componente de búsqueda
- Grid responsivo de cards
- Loading/Error states

#### `RestaurantCard.vue` - Componente Card
Card que muestra un restaurante con todos sus locales.

**Props:**
```javascript
{
  restaurant: {
    name: string,
    cuisine: string,
    priceRange: string,
    locales: RestaurantEntity[],
    count: number,
    averageRating: number
  }
}
```

**Features:**
- Muestra nombre, rating promedio, tipo de cocina
- Botones toggle: "Los Locales" vs "Mejor Calidad"
- Lista de locales con detalles (dirección, teléfono, horario)
- Botón "Seleccionar" para cada local

#### `RestaurantSearch.vue` - Componente Búsqueda
Input para filtrar restaurantes por nombre.

**Features:**
- Búsqueda en tiempo real
- Botón para limpiar búsqueda
- Muestra cantidad de resultados

## 🔄 Flujo de Datos

### 1. Cargar Restaurantes
```
Restaurantes.vue (onMounted)
    ↓
restaurantsStore.fetchRestaurants()
    ├→ loadFromLocalStorage()    (UI instantánea)
    └→ restaurantsApi.getAll()   (background sync)
         └→ RestaurantAssembler.fromJsonList()
```

### 2. Buscar Restaurante
```
User escribe en RestaurantSearch
    ↓
setSearchTerm(value)
    ↓
restaurantsStore.searchTerm = value
    ↓
groupedRestaurants computed (re-ejecuta)
    ├→ RestaurantModel.searchByName()
    └→ RestaurantCard renderiza resultados
```

### 3. Cambiar Filtro de Calidad
```
User hace clic en "Mejor Calidad"
    ↓
toggleFilterMode('quality')
    ↓
restaurantsStore.filterMode = 'quality'
    ↓
displayLocales computed en Card (re-ejecuta)
    ├→ RestaurantModel.filterHighQuality()
    └→ Card renderiza solo locales 3-5 estrellas
```

### 4. Seleccionar Restaurante
```
User hace clic en "Seleccionar" de un local
    ↓
selectRestaurant(locale)
    ├→ restaurantsStore.selectRestaurant(locale)
    └→ calculateStore.setSelectedRestaurant(locale)
    ↓
Navega a /calculo con restaurante seleccionado
```

## 🗄️ Estructura de Base de Datos

En `server/db.json`:

```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "KFC - San Isidro",
      "cuisine": "Comida Rápida",
      "rating": 4.5,
      "priceRange": "$$",
      "address": {
        "street": "Av. Paseo de la República 5150",
        "city": "Lima",
        "latitude": -12.0904,
        "longitude": -77.0396
      },
      "phone": "+51 1 555-1001",
      "openHours": "10:00 AM - 11:00 PM",
      "userId": 1
    },
    ...
  ]
}
```

**Campos:**
- `id` - ID único del restaurante
- `name` - Nombre del local (incluye ubicación)
- `cuisine` - Tipo de cocina
- `rating` - Calificación (1-5 estrellas)
- `priceRange` - Rango de precio ($, $$, $$$)
- `address` - Ubicación con coordenadas GPS
- `phone` - Teléfono de contacto
- `openHours` - Horarios de apertura
- `userId` - ID del usuario propietario

## 🔗 Integración con Otros Módulos

### Calculate Module (`calculate/`)
Cuando selecciona un restaurante, se integra con el store de cálculo:

```javascript
// En RestaurantCard.vue
calculateStore.setSelectedRestaurant(locale);

// En calculate.store.js
function setSelectedRestaurant(restaurant) {
  selectedRestaurant.value = restaurant;
}
```

El restaurante seleccionado se usa en el cálculo de distancias.

## 📊 Estadísticas

La página muestra:
- **Restaurantes**: Cantidad de cadenas/marcas únicas
- **Locales Totales**: Cantidad total de sucursales en toda Perú

## 🎨 Estilos y Temas

- **Color primario**: #4ecdc4 (Teal)
- **Color secundario**: #44a8a0 (Darker Teal)
- **Hover effects**: Elevación y cambios de color
- **Responsive**: Grid que se adapta a cualquier pantalla

## 🚀 Cómo Usar

### Desde la UI

1. **Ir a Restaurantes**
   - Navega a `/restaurantes` desde la barra lateral

2. **Buscar Restaurante**
   - Escribe en la barra de búsqueda
   - Los resultados se filtran en tiempo real

3. **Ver Locales**
   - Haz clic en "Los Locales" o "Mejor Calidad"
   - Ve la lista de sucursales del restaurante

4. **Seleccionar Restaurante**
   - Haz clic en "Seleccionar" en el local deseado
   - Automáticamente va a `/calculo` con el restaurante seleccionado

### Desde el Código

```javascript
import { useRestaurantsStore } from '@/restaurants/application/restaurants.store.js';

const restaurantsStore = useRestaurantsStore();

// Cargar restaurantes
await restaurantsStore.fetchRestaurants();

// Buscar
restaurantsStore.setSearchTerm('KFC');

// Cambiar filtro
restaurantsStore.toggleFilterMode('quality'); // 'all' o 'quality'

// Seleccionar restaurante
restaurantsStore.selectRestaurant(restaurantObject);

// Obtener seleccionado
const selected = restaurantsStore.selectedRestaurant;
```

## 📈 Performance

### Optimizaciones Implementadas

1. **localStorage Caching**
   - Carga instantánea desde caché local
   - Sincronización en background sin bloquear UI

2. **Computed Properties**
   - Cálculos reactivos solo cuando cambian dependencias
   - Búsqueda y filtrado eficientes

3. **Lazy Rendering**
   - Solo renderiza restaurantes visibles
   - Grid responsivo evita overflow

## 🔐 Seguridad

- ✅ Filtrado por userId - Solo ve restaurantes del usuario
- ✅ Validación en componentes
- ✅ Manejo de errores en API calls

## 🐛 Debugging

Abre la consola del navegador (F12) para ver logs:

```
📡 Fetched all restaurants: [...]
💾 Saved 12 restaurants to localStorage for user 1
📂 Loaded 12 restaurants from localStorage for user 1
🔍 Filter mode set to: quality
✅ Restaurante seleccionado: KFC - San Isidro
```

## 📝 API Endpoints

```
GET    /api/v1/restaurants              # Listar todos
GET    /api/v1/restaurants/:id          # Obtener por ID
POST   /api/v1/restaurants              # Crear (admin)
PUT    /api/v1/restaurants/:id          # Actualizar (admin)
DELETE /api/v1/restaurants/:id          # Eliminar (admin)
```

## 🎯 Próximas Mejoras

- [ ] Agregar filtro por rango de precio
- [ ] Mapa interactivo de restaurantes
- [ ] Valoraciones/reviews de usuarios
- [ ] Menú del restaurante
- [ ] Reservas en línea
- [ ] Filtro por horario de apertura

---

**Módulo desarrollado con ❤️ siguiendo Clean Architecture y DDD**

