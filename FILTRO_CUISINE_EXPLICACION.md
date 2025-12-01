# 🍽️ Sistema de Filtrado por Tipo de Cocina (Cuisine)

## 📋 Descripción General

Se ha implementado un sistema completo que permite filtrar restaurantes por tipo de cocina (cuisine) y garantiza que cuando hagas clic en "Calcular Distancia", solo se procesen restaurantes del tipo seleccionado.

## 🔄 Flujo de Funcionamiento

### 1️⃣ **Seleccionar tipo de cocina en Top 3 Restaurants**
```
Usuario: Haz clic en botón "🍟 Comida Rápida"
         ↓
Component: CalculateTop3Restaurants.vue
         ↓
Action: selectCuisine('Comida Rápida')
         ↓
Store: calculateStore.selectedCuisine = 'Comida Rápida'
         ↓
Result: Filtran automáticamente los Top 3 restaurantes de comida rápida más cercanos
```

### 2️⃣ **Seleccionar un restaurante del Top 3**
```
Usuario: Haz clic en "KFC - Miraflores"
         ↓
Component: CalculateTop3Restaurants.vue
         ↓
Action: selectRestaurantFromTop3(restaurant)
         ↓
Store: calculateStore.selectedRestaurant = KFC object
       calculateStore.selectedCuisine = 'Comida Rápida' (se mantiene)
         ↓
Result: Aparece el restaurante en el card izquierdo
```

### 3️⃣ **Hacer clic en "Calcular Distancia"**
```
Usuario: Haz clic en botón "Calcular Distancia"
         ↓
Component: CalculateRestaurantCard.vue
         ↓
Function: performCalculation()
         ↓
Validation: ¿selectedCuisine existe? 
            ¿El restaurante es del mismo tipo?
         ↓
         ├─ SÍ → Ejecuta cálculo ✅
         └─ NO → Muestra error ❌
         ↓
Store: calculateStore.calculateDistances()
         ↓
Result: Muestra distancias con label del tipo de cocina
```

## 📁 Archivos Modificados

### 1. **calculate.store.js**
```javascript
// NUEVO: Estado para guardar el tipo de cocina seleccionado
const selectedCuisine = ref(null)

// En el return del store:
selectedCuisine,
```

### 2. **CalculateTop3Restaurants.vue**
```javascript
// Propiedad computada que conecta con el store
const selectedCuisine = computed({
  get: () => calculateStore.selectedCuisine,
  set: (value) => {
    calculateStore.selectedCuisine = value;
  }
});

// Función para seleccionar cuisine
function selectCuisine(cuisine) {
  selectedCuisine.value = cuisine;  // Actualiza el store
}

// Función para limpiar el filtro
function clearCuisineFilter() {
  selectedCuisine.value = null;  // Limpia el store
}

// Computed que filtra restaurantes por cuisine
const nearestRestaurants = computed(() => {
  let restaurantsToFilter = allRestaurants.value;
  
  // Si hay cuisine seleccionado, filtra
  if (selectedCuisine.value) {
    restaurantsToFilter = restaurantsToFilter.filter(
      r => r.cuisine === selectedCuisine.value
    );
  }
  
  // ... resto de lógica de distancia y Top 3
});
```

### 3. **CalculateRestaurantCard.vue**
```javascript
function performCalculation() {
  // ... validaciones previas ...
  
  // NUEVA: Validar que el restaurante coincida con el cuisine filtrado
  if (calculateStore.selectedCuisine && 
      selectedRestaurant.value?.cuisine !== calculateStore.selectedCuisine) {
    toast.add({
      severity: 'error',
      summary: 'Tipo de cocina incompatible',
      detail: `El restaurante seleccionado no coincide con el filtro "${calculateStore.selectedCuisine}"`
    });
    return;  // ❌ No permite calcular
  }
  
  // ✅ Procede con el cálculo
  calculateStore.calculateDistances();
}
```

## 🎯 Casos de Uso

### ✅ Caso 1: Usuario selecciona KFC
```
1. Haz clic en "🍟 Comida Rápida"
2. Top 3 muestra: KFC - Miraflores, KFC - San Isidro, KFC - Centro Histórico
3. Selecciona: KFC - Miraflores
4. Hace clic: "Calcular Distancia"
5. Resultado: ✅ Calcula distancia para KFC - Miraflores
```

### ✅ Caso 2: Usuario selecciona Chifa
```
1. Haz clic en "🥡 Chinese"
2. Top 3 muestra: Solo restaurantes chinos cercanos
3. Selecciona: Chifa Oriental
4. Hace clic: "Calcular Distancia"
5. Resultado: ✅ Calcula distancia para Chifa Oriental
```

### ❌ Caso 3: Usuario intenta mezclar tipos
```
1. Haz clic en "🍟 Comida Rápida"
2. Top 3 muestra: KFC options
3. Intenta seleccionar: Chifa Oriental (desde otra lista)
4. Hace clic: "Calcular Distancia"
5. Resultado: ❌ ERROR - "El restaurante seleccionado no coincide con el filtro"
```

### ✅ Caso 4: Usuario limpia el filtro
```
1. Haz clic en "✕ Todos"
2. Top 3 muestra: Todos los restaurantes más cercanos (sin filtro)
3. Selecciona: Cualquier restaurante
4. Hace clic: "Calcular Distancia"
5. Resultado: ✅ Calcula distancia normalmente
```

## 🎨 UI Elementos

### Botones de Filtro
```
┌─────────────────────────────────────────┐
│ Filtrar por tipo:                       │
│ 🍔 American  🥩 Argentine  🏮 Asian Fusion
│ 🥡 Chinese   🍟 Comida Rápida 🥗 Healthy
│ 🍝 Italian   🍣 Japanese   🌮 Mexican
│ 🍗 Peruvian  🍤 Seafood    🍲 Thai
│ ✕ Todos                                │
└─────────────────────────────────────────┘
```

- **Botones inactivos**: Gris claro, bordeados
- **Botones activos**: Naranja degradado, fondo blanco
- **Botón "Todos"**: Gris cuando está activo, y limpia el filtro

## 🔐 Validaciones

1. **En Top 3 Restaurants**: Filtra automáticamente los restaurantes disponibles
2. **En Restaurant Card**: Valida que el restaurante seleccionado coincida con el tipo filtrado
3. **Mensajes de error**: Muestra notificaciones Toast si hay incompatibilidad

## 📊 Flujo de Datos (Pinia Store)

```
┌──────────────────────────────────────────────┐
│         useCalculateStore (Pinia)            │
├──────────────────────────────────────────────┤
│ selectedCuisine: 'Comida Rápida' | null     │
│ selectedRestaurant: Restaurant object        │
│ groupMembers: Array of members              │
│ calculationResults: Calculation data        │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│    CalculateTop3Restaurants Component        │
│ - Lee selectedCuisine del store             │
│ - Actualiza selectedCuisine en store        │
│ - Filtra Top 3 según cuisine               │
└──────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────┐
│    CalculateRestaurantCard Component         │
│ - Lee selectedCuisine del store             │
│ - Valida compatibilidad                     │
│ - Ejecuta cálculo si es válido             │
└──────────────────────────────────────────────┘
```

## 🚀 Cómo Probar

1. Abre la aplicación en http://localhost:3000
2. Selecciona un grupo
3. En la sección "Top 3 Restaurantes Cercanos", haz clic en un tipo de cocina (ej: 🍟 Comida Rápida)
4. Verás que solo aparecen 3 restaurantes de ese tipo
5. Selecciona uno de ellos
6. Haz clic en "Calcular Distancia"
7. ✅ Deberías ver la distancia calculada para ese tipo de cocina

## 📝 Notas Técnicas

- El estado `selectedCuisine` se reinicia cuando cambias de grupo
- El filtro es opcional (puedes dejar "Todos" seleccionado)
- Las distancias se calculan usando la fórmula Haversine (precisión real)
- Los iconos emoji se personalizan según el tipo de cocina

