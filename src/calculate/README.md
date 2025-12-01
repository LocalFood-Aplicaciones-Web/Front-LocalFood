# 📐 Calculate Module - Distance Calculator

## 🎯 Descripción General

El módulo `calculate` es un **Bounded Context** independiente que implementa un **calculador de distancias óptimas** para grupos que desean encontrar restaurantes cercanos.

**Stack Tecnológico:**
- Vue 3 (Composition API) como protagonista principal
- Pinia para state management
- PrimeVue para componentes UI
- DDD (Domain-Driven Design) para arquitectura
- Google Maps API (futuro) para ubicaciones
- Fake API (json-server) para persistencia

---

## 🏗️ Estructura DDD

```
calculate/
├── presentation/                        # 🎨 Capa de Presentación
│   ├── views/
│   │   └── Calculo.vue                 # Componente principal Vue 3
│   └── calculate-routes.js             # Rutas del módulo
│
├── application/                         # 🔄 Capa de Aplicación
│   └── calculate.store.js              # Pinia Store (orquestador)
│
├── domain/                              # 🧠 Capa de Dominio
│   └── model/
│       ├── calculation.entity.js       # Entidad de negocio
│       └── calculation.model.js        # Lógica de negocio pura
│
└── infrastructure/                      # 🔌 Capa de Infraestructura
    ├── calculations-api.js             # Cliente HTTP
    └── calculation.assembler.js        # Transformación de datos
```

---

## 🎨 CAPA DE PRESENTACIÓN - Vue 3 (PRINCIPAL)

### Calculo.vue - Componente Vue 3

**Ubicación:** `src/calculate/presentation/views/Calculo.vue`

#### Características principales:

✅ **Composition API** - Sintaxis moderna de Vue 3
✅ **Reactive State** - `ref()` para estado local
✅ **Computed Properties** - `computed()` para datos derivados
✅ **Event Handling** - `@click`, `@change`, etc.
✅ **Conditional Rendering** - `v-if`, `v-else`, `v-show`
✅ **List Rendering** - `v-for` con `:key`
✅ **Two-way Binding** - `v-model` para inputs
✅ **PrimeVue Components** - Interfaz profesional
✅ **Scoped Styles** - CSS aislado del componente

#### Secciones de la UI:

1. **Recuadro Restaurante (Izquierda Arriba)**
   - Imagen del restaurante seleccionado
   - Información (rating, ciudad, etc.)
   - Botón "Calcular Distancia"
   - Resultados: distancia, promedio, viabilidad

2. **Top 3 Restaurantes Cercanos (Izquierda Abajo)**
   - Lista de 3 KFC más cercanos a Lima
   - Distancia en km
   - Seleccionar restaurante

3. **Grupo de Miembros (Derecha Arriba)**
   - Máximo 8 integrantes
   - Avatar y nombre de cada uno
   - Opción eliminar (solo líder)
   - Contador de miembros

4. **Botones de Acción (Derecha Centro)**
   - "Agregar Personas" (con QR/Link)
   - "Editar Restaurante" (búsqueda)
   - "Calcular Alt." (sin top 3)

5. **Tabla de Miembros por Distancia (Centro Abajo)**
   - Miembros ordenados por distancia
   - Código de color según proximidad

6. **Google Maps (Futuro)**
   - Integración con Google Maps API
   - Mostrar ubicaciones en mapa

---

## 🔄 CAPA DE APLICACIÓN - Pinia Store

### calculate.store.js

**Responsabilidades:**
- Orquestar flujo entre presentación y dominio
- Mantener estado reactivo global
- Coordinar llamadas a APIs
- Exponer acciones para Vue

**Estado Reactivo:**
```javascript
selectedGroup           // Grupo actual
groupMembers           // Miembros del grupo
selectedRestaurant     // Restaurante seleccionado
nearestRestaurants     // Top 3 restaurantes
calculationResults     // Resultados del cálculo
isLoading             // Estado de carga
errors                // Mensajes de error
```

**Acciones Principales:**
```javascript
initializeCalculation(group, members)    // Inicializar
loadNearestRestaurants()                 // Cargar top 3
calculateDistances()                     // Calcular distancias
calculateWithoutTop3()                   // Cálculo alternativo
addMembersToGroup(memberIds)             // Agregar miembros
removeMember(memberId)                   // Remover miembro
saveCalculation()                        // Guardar en BD
fetchCalculations()                      // Cargar historial
```

---

## 🧠 CAPA DE DOMINIO

### CalculationEntity

Entidad que representa un cálculo de distancia.

**Propiedades:**
```javascript
id, groupId, restaurantId
restaurantName, groupMembers
centerPoint, distance, averageDistance
maxSpread, viabilityScore
membersByDistance, timestamp
```

### CalculationModel

Lógica de negocio pura con funciones estáticas para cálculos.

**Métodos:**
```javascript
calculateHaversineDistance(p1, p2)          // Distancia entre puntos
calculateGroupCenter(members)               // Centro del grupo
calculateDistanceToRestaurant()             // Distancia grupo-restaurante
calculateAverageDistance()                  // Distancia promedio
sortMembersByDistance()                     // Ordenar miembros
calculateMaxSpread()                        // Dispersión del grupo
calculateViabilityScore()                   // Puntuación 0-100
```

#### Fórmula Haversine

Calcula distancia entre dos puntos en la tierra usando sus coordenadas:

```
R = 6371 km (radio terrestre)
Δlat = (lat2 - lat1) × π/180
Δlng = (lng2 - lng1) × π/180
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
c = 2 × atan2(√a, √(1-a))
distancia = R × c
```

---

## 🔌 CAPA DE INFRAESTRUCTURA

### CalculationsApi

Cliente HTTP para comunicar con la fake API (json-server).

**Métodos:**
```javascript
getAllCalculations()              // GET /calculations
getCalculationById(id)            // GET /calculations/:id
getCalculationsByGroupId(id)      // GET /calculations?groupId=X
createCalculation(data)           // POST /calculations
updateCalculation(id, data)       // PUT /calculations/:id
deleteCalculation(id)             // DELETE /calculations/:id
```

### CalculationAssembler

Transforma datos entre capas:
- API → Entity
- Entity → DTO
- Plain Data → Entity

---

## 📍 UBICACIONES EN LIMA, PERÚ

Todas las ubicaciones están configuradas en Lima:

| Persona | Latitud | Longitud | Ubicación |
|---------|---------|----------|-----------|
| John Smith | -12.0904 | -77.0396 | Av. Paseo de la República (San Isidro) |
| Sarah Johnson | -12.1265 | -77.0305 | Av. Larco (Miraflores) |
| Michael Brown | -12.0469 | -77.0289 | Jr. Lampa (Centro Histórico) |
| Emily Davis | -12.0789 | -77.0321 | Av. Arequipa |
| David Wilson | -12.0461 | -77.0283 | Jr. de la Unión |

### Restaurantes KFC (Mock Data):

| Nombre | Latitud | Longitud | Distancia |
|--------|---------|----------|-----------|
| KFC - San Isidro | -12.0904 | -77.0396 | 2.5 km |
| KFC - Miraflores | -12.1265 | -77.0305 | 5.2 km |
| KFC - Centro | -12.0469 | -77.0289 | 7.1 km |

---

## 🎯 FLUJO DE USO

```
1. Usuario navega a /calculo
   ↓ [onMounted en Vue]
2. Cargar grupos y colegas desde API
   ↓ [watch selectedGroup]
3. Inicializar cálculo con grupo seleccionado
   ↓ [computed groupMembers]
4. Cargar top 3 restaurantes cercanos
   ↓ [usuario selecciona restaurante]
5. Actualizar selectedRestaurant en store
   ↓ [usuario hace click en "Calcular"]
6. Ejecutar calculateDistances()
   ↓ [store llama al dominio]
7. CalculationModel calcula distancias (Haversine)
   ↓ [computed properties actualizan UI]
8. Vue renderiza resultados automáticamente
   ↓ [usuario puede guardar]
9. saveCalculation() → API → db.json
```

---

## 🔗 INVITACIONES CON QR Y LINK

### QR + Link para invitar miembros:

```javascript
// Link generado
https://app.localhost/?groupId=1&inviteCode=a1b2c3d4e5

// QR Code
Generado con QR.js (biblioteca)
Contiene el mismo link
```

**Características:**
- ✅ Generar QR dinámico
- ✅ Copiar link al portapapeles
- ✅ Compartir con otros usuarios
- ✅ Validar código de invitación en backend (futuro)

---

## 📊 VIABILITY SCORE (0-100)

Puntuación que mide cuán viable es ir a un restaurante:

```
score = 100

// Penalización por distancia (hasta -40)
score -= min(averageDistance × 2, 40)

// Bonus por tamaño de grupo (hasta +10)
if (groupMembers >= 5) score += 10

// Penalización por dispersión (hasta -20)
score -= min(maxSpread / 10, 20)

// Asegurar rango 0-100
score = max(0, min(100, score))
```

**Ejemplo:**
- Distancia promedio: 2 km → -4 puntos
- 5 miembros → +10 puntos
- Dispersión: 15 km → -15 puntos
- **Score final: 91/100**

---

## 🔐 PERMISOS Y CONTROL DE ACCESO

- ✅ **Solo líder del grupo** puede eliminar miembros
- ✅ **Cualquier miembro** puede agregar nuevas personas
- ✅ **Cualquier miembro** puede editar restaurante
- ✅ **Máximo 8 miembros** por grupo

---

## 🚀 CARACTERÍSTICAS FUTURAS

- [ ] Integración real con Google Maps API
- [ ] Validación de invitaciones en backend
- [ ] Historial de cálculos
- [ ] Exportar resultados (PDF)
- [ ] Votación de restaurantes
- [ ] Integración con reservas
- [ ] Notificaciones en tiempo real
- [ ] Múltiples idiomas (i18n)

---

## 📝 NOTAS IMPORTANTES

⚠️ **Fake API:** Usa json-server en `server/db.json`
⚠️ **Google Maps:** Actualmente mock data, implementar API real
⚠️ **Ubicaciones:** Todas en Lima, Perú con coordenadas reales
⚠️ **Máximo miembros:** 8 por grupo
⚠️ **Mínimo miembros:** 1 para calcular

---

## 🛠️ BUENAS PRÁCTICAS IMPLEMENTADAS

✅ **DDD:** Domain-Driven Design con capas clara
✅ **Vue 3:** Composition API como estándar
✅ **Reactividad:** Computed + Watchers para sync
✅ **Separation of Concerns:** Cada capa tiene responsabilidad clara
✅ **Type Safety:** Clases para entidades
✅ **Error Handling:** Try-catch y mensajes de error
✅ **Logging:** Console logs con emojis para debugging
✅ **Documentación:** Comentarios explicativos en código
✅ **Composables:** Store como composable
✅ **Scoped Styles:** CSS no contaminado

---

**Módulo Calculate: Vue 3 + DDD + Lima, Perú** 🚀✨

