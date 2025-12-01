/**
 * RESTRUCTURACIÓN DE PATHS - Módulo de Restaurantes
 * ==================================================
 * 
 * Documento que explica cómo se reorganizó el módulo de restaurantes
 * para seguir el patrón de estructura de Shared
 */

# 📂 Restructuración de Paths - Módulo Restaurantes

## ✅ Cambios Realizados

### Antes (Estructura Inicial)
```
src/restaurants/
├── presentation/
│   └── views/
│       └── Restaurantes.vue          ← Página aquí
├── ...
```

### Después (Estructura Correcta - Siguiendo Shared)
```
src/restaurants/
├── presentation/
│   ├── components/
│   │   ├── RestaurantCard.vue
│   │   └── RestaurantSearch.vue
│   └── restaurants-routes.js

src/Shared/presentation/
├── pages/
│   └── Restaurantes.vue              ← Página aquí (en Shared)
└── components/
    └── Contenido_restaurante.vue     ← Contenedor aquí (en Shared)
```

## 🔄 Flujo de Imports Actualizado

### 1. Router (`src/router/index.js`)
```javascript
import { restaurantsRoutes } from "../restaurants/presentation/restaurants-routes.js";

// El restaurantsRoutes a su vez importa desde Shared:
```

### 2. Rutas (`src/restaurants/presentation/restaurants-routes.js`)
```javascript
import Restaurantes from '../../Shared/presentation/pages/Restaurantes.vue';

export const restaurantsRoutes = [
  {
    path: '/restaurantes',
    name: 'restaurantes',
    component: Restaurantes,
    meta: { requiresAuth: true }
  }
];
```

### 3. Página (`src/Shared/presentation/pages/Restaurantes.vue`)
```javascript
import Contenido_restaurante from '../components/Contenido_restaurante.vue';

<template>
  <div class="page-container">
    <Contenido_restaurante />
  </div>
</template>
```

### 4. Contenedor (`src/Shared/presentation/components/Contenido_restaurante.vue`)
```javascript
import { useRestaurantsStore } from '../../../restaurants/application/restaurants.store.js';
import RestaurantCard from '../../../restaurants/presentation/components/RestaurantCard.vue';
import RestaurantSearch from '../../../restaurants/presentation/components/RestaurantSearch.vue';

// Importa componentes específicos del módulo restaurants
```

### 5. Componentes del Módulo
```
RestaurantCard.vue
  └─ Importa: useRestaurantsStore, useCalculateStore

RestaurantSearch.vue
  └─ Importa: useRestaurantsStore
```

## 📊 Estructura de Carpetas Completa

```
src/
├── restaurants/                          ← MÓDULO RESTAURANTS (DDD)
│   ├── domain/
│   │   └── model/
│   │       ├── restaurant.entity.js      ✅ Lógica de dominio
│   │       └── restaurant.model.js       ✅ Reglas de negocio
│   ├── application/
│   │   └── restaurants.store.js          ✅ Estado Pinia
│   ├── infrastructure/
│   │   ├── restaurants-api.js            ✅ HTTP API
│   │   ├── restaurant.resource.js        ✅ DTO
│   │   └── restaurant.assembler.js       ✅ Entity ↔ DTO
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── RestaurantCard.vue        ✅ Card individual
│   │   │   └── RestaurantSearch.vue      ✅ Búsqueda
│   │   └── restaurants-routes.js         ✅ Rutas (importa desde Shared)
│   └── README.md
│
├── Shared/                               ← SHARED (Componentes comunes)
│   ├── presentation/
│   │   ├── pages/
│   │   │   ├── Restaurantes.vue          ✅ Página principal (aquí)
│   │   │   ├── Colegas.vue               ← Patrón a seguir
│   │   │   ├── Calculo.vue
│   │   │   └── Home.vue
│   │   └── components/
│   │       ├── Contenido_restaurante.vue ✅ Contenedor (aquí)
│   │       ├── Contenido_colegas.vue     ← Patrón a seguir
│   │       ├── Contenido_calculo.vue
│   │       ├── Encabezado.vue
│   │       └── ...
│   └── infrastructure/
│
├── colleagues/                           ← MÓDULO COLLEAGUES (DDD)
├── calculate/                            ← MÓDULO CALCULATE (DDD)
├── iam/                                  ← MÓDULO IAM (DDD)
├── router/
│   └── index.js                          ← Aquí se importan restaurantsRoutes
└── main.js
```

## 🎯 Ventajas de esta Estructura

### ✅ Separación de Responsabilidades
- **restaurants/** → Lógica DDD pura del dominio
- **Shared/** → UI compartida y presentación
- **router/** → Orquestación de rutas

### ✅ Escalabilidad
- Fácil agregar más rutas
- Componentes reutilizables
- Stores independientes por módulo

### ✅ Consistencia
- Sigue el patrón de **Colegas**
- Sigue el patrón de **Calculo**
- Uniformidad en toda la app

### ✅ Fácil Mantenimiento
- Imports claros y predecibles
- Jerarquía visual en carpetas
- DDD separado de presentación

## 🔗 Tabla de Imports Correctos

| Archivo | Import | Ruta |
|---------|--------|------|
| **router/index.js** | `restaurantsRoutes` | `../restaurants/presentation/restaurants-routes.js` |
| **restaurants-routes.js** | `Restaurantes` | `../../Shared/presentation/pages/Restaurantes.vue` |
| **Restaurantes.vue** (Shared/pages) | `Contenido_restaurante` | `../components/Contenido_restaurante.vue` |
| **Contenido_restaurante.vue** | `useRestaurantsStore` | `../../../restaurants/application/restaurants.store.js` |
| **Contenido_restaurante.vue** | `RestaurantCard` | `../../../restaurants/presentation/components/RestaurantCard.vue` |
| **Contenido_restaurante.vue** | `RestaurantSearch` | `../../../restaurants/presentation/components/RestaurantSearch.vue` |
| **RestaurantCard.vue** | `useRestaurantsStore` | `../../application/restaurants.store.js` |
| **RestaurantCard.vue** | `useCalculateStore` | `../../../calculate/application/calculate.store.js` |
| **RestaurantSearch.vue** | `useRestaurantsStore` | `../../application/restaurants.store.js` |

## 📝 Comparación con Colegas

### Estructura Colegas (Ya Existente)
```
colleagues/
├── domain/model/
├── application/
├── infrastructure/
└── presentation/
    └── colleagues-routes.js

Shared/presentation/
├── pages/Colegas.vue              ← Página
└── components/Contenido_colegas.vue ← Contenedor
```

### Estructura Restaurantes (Ahora Igual)
```
restaurants/
├── domain/model/
├── application/
├── infrastructure/
└── presentation/
    └── restaurants-routes.js

Shared/presentation/
├── pages/Restaurantes.vue              ← Página
└── components/Contenido_restaurante.vue ← Contenedor
```

## 🚀 Cómo Navegar en la App

```
Usuario navega a /restaurantes
         ↓
router/index.js
  └─ restaurantsRoutes
      └─ componente: Restaurantes
         ↓
Shared/presentation/pages/Restaurantes.vue
  └─ Contenido_restaurante
     ↓
Shared/presentation/components/Contenido_restaurante.vue
  ├─ RestaurantSearch (del módulo)
  └─ RestaurantCard (del módulo)
     ├─ Usa restaurantsStore
     └─ Usa calculateStore
```

## ✨ Verificación de Estructura

### ✅ Checklist
- [x] Restaurantes.vue en **Shared/presentation/pages/**
- [x] Contenido_restaurante.vue en **Shared/presentation/components/**
- [x] RestaurantCard.vue en **restaurants/presentation/components/**
- [x] RestaurantSearch.vue en **restaurants/presentation/components/**
- [x] restaurants-routes.js importa desde Shared
- [x] Contenido_restaurante importa componentes desde restaurants/
- [x] Todos los paths relativos correctos
- [x] Sigue patrón de Colegas y Calculo

## 🔐 Regla de Oro para Imports

```
┌────────────────────────────────────────┐
│ REGLA: Desde Shared hacia restaurants  │
│ ✅ Allowed: ../../restaurants/         │
│ ✅ Allowed: ../../../restaurants/      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ REGLA: Desde restaurants hacia Shared  │
│ ✅ Allowed: ../../Shared/              │
│ ✅ Allowed: ../../../Shared/           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ REGLA: Dentro de restaurants          │
│ ✅ Allowed: ../application/            │
│ ✅ Allowed: ../../domain/              │
│ ✅ Allowed: ../../infrastructure/      │
└────────────────────────────────────────┘
```

## 📚 Documentación Relacionada

- Ver `src/restaurants/README.md` para detalles técnicos
- Ver `INTEGRACION_RESTAURANTES.md` para flujo completo
- Comparar con `colleagues/` para ver estructura similar

---

**✨ La estructura está 100% alineada con el patrón de Shared**

