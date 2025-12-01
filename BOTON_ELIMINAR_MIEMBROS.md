# 🗑️ Botón para Eliminar Miembros del Grupo

## 📋 Descripción

Se ha agregado un botón de eliminar (papelera 🗑️) en cada tarjeta de miembro del grupo. Este botón permite al líder del grupo eliminar miembros de forma segura con confirmación previa.

## 🎯 Cómo Funciona

### 1️⃣ **Ubicación del Botón**
El botón de eliminar aparece en la **esquina inferior derecha de cada tarjeta de miembro** en la sección "Grupo de Miembros".

```
┌─────────────────────┐
│   John Smith        │
│   john.smith@...    │
│                     │
│              [🗑️]  │  ← Botón eliminar aquí
└─────────────────────┘
```

### 2️⃣ **Quién Puede Eliminar**
- ✅ **Solo el líder del grupo** puede eliminar otros miembros
- ❌ Los miembros no pueden eliminarse a sí mismos
- ❌ Los miembros no pueden eliminar a otros miembros

### 3️⃣ **Proceso de Eliminación**

```
1️⃣ Haz clic en el botón 🗑️ rojo
         ↓
2️⃣ Aparece un cuadro de confirmación
   "¿Eliminar a John Smith del grupo?"
         ↓
3️⃣ Elige "Aceptar" para confirmar
         ↓
4️⃣ ✅ El miembro se elimina al instante
   📢 Se muestra mensaje de éxito
         ↓
5️⃣ La tarjeta desaparece con animación
```

## 🎨 Apariencia del Botón

### Estados del Botón

| Estado | Apariencia | Acción |
|--------|-----------|--------|
| **Normal** | Rojo claro con borde rojo | Botón visible pero no activo |
| **Hover** | Rojo sólido, se agranda | Presionable, listo para hacer clic |
| **Click** | Se comprime un poco | Retroalimentación visual |

### Ejemplo Visual

```
Estado Normal:           Estado Hover:
┌──────────────┐        ┌──────────────┐
│ John Smith   │        │ John Smith   │
│              │        │              │
│         [🗑️] │        │         [🗑️] │ ← Se agranda
└──────────────┘        └──────────────┘
```

## 🔐 Validaciones

1. **Solo el líder puede eliminar**: Si no eres el líder, el botón no aparece
2. **No puedes eliminarte a ti mismo**: El botón no aparece en tu propia tarjeta
3. **Confirmación obligatoria**: Debe confirmar antes de eliminar
4. **Prevención de errores**: Valida que el miembro exista antes de eliminar

## 📝 Mensajes y Notificaciones

### ✅ Éxito
```
Título: "Eliminado"
Mensaje: "John Smith eliminado del grupo"
Duración: 2 segundos
Color: Verde
```

### ⚠️ Error (si ocurre algo)
```
Título: "Error"
Mensaje: "No tienes permisos para eliminar miembros"
Color: Rojo
```

## 🚀 Ejemplo de Uso Paso a Paso

### Escenario: Eres el líder y quieres eliminar a Sarah del grupo

```
1. Abre la página de Calcular
2. Ve la sección "Grupo de Miembros"
3. Localiza la tarjeta de "Sarah Johnson"
4. Verás el botón 🗑️ en la esquina inferior derecha
5. Haz clic en el botón 🗑️
6. Se abre un cuadro que pregunta: "¿Eliminar a Sarah Johnson del grupo?"
7. Haz clic en "Aceptar"
8. ✅ Sarah se elimina del grupo
9. 📢 Ves: "Eliminado - Sarah Johnson eliminado del grupo"
10. La tarjeta desaparece con una animación suave
```

## 🔄 Cambios en el Sistema

Cuando eliminas un miembro:

1. ✅ **Se actualiza el contador de miembros** (de 3/8 a 2/8)
2. ✅ **Se actualiza la barra de progreso** automáticamente
3. ✅ **Se recalculan los cálculos de distancia** (si estaban listos)
4. ✅ **Se anima la salida** del miembro eliminado

## 💡 Casos de Uso

### ✅ Caso 1: Eliminar un miembro correctamente
```
Rol: Líder ✓
Intento: Eliminar a Sarah ✓
Resultado: ✅ Sarah eliminada con éxito
```

### ❌ Caso 2: Intentar auto-eliminarse
```
Rol: Miembro (no líder)
Intento: Intentar hacer clic en 🗑️
Resultado: ❌ Botón no aparece (protección)
```

### ❌ Caso 3: Miembro intenta eliminar a otro
```
Rol: Miembro (no líder)
Intento: Intentar hacer clic en 🗑️ de otro
Resultado: ❌ Botón no aparece (solo líder puede)
```

## 🎨 Componente Modificado

**Archivo**: `CalculateGroupMembers.vue`

**Cambios realizados**:
- ✅ Botón 🗑️ visual y prominente
- ✅ Confirmación antes de eliminar
- ✅ Mensajes de éxito/error
- ✅ Animaciones suaves
- ✅ Validación de permisos

## 📊 Flujo de Datos

```
┌──────────────────────────────────┐
│   Componente: CalculateGroupMembers
│   Usuario: Haz clic en 🗑️
└──────────────┬───────────────────┘
               ↓
        Aparece confirmación
               ↓
    Usuario: Confirma eliminación
               ↓
┌──────────────────────────────────┐
│   Store: calculateStore
│   Función: removeMember(memberId)
│   - Valida permisos (es líder?)
│   - Busca el miembro por ID
│   - Lo elimina del array
│   - Retorna true/false
└──────────────┬───────────────────┘
               ↓
        Actualiza UI
               ↓
    ✅ Muestra Toast de éxito
```

## 🔧 Cómo Modifica el Componente

### Antes (sin botón)
- No hay forma de eliminar miembros
- Todos los miembros son permanentes

### Después (con botón)
- ✅ Botón visible solo para el líder
- ✅ Confirmación antes de eliminar
- ✅ Feedback visual (animación y mensaje)
- ✅ Actualización automática del contador

## 📱 Responsive

El botón se adapta a todos los tamaños de pantalla:
- 📱 Móvil: Botón compacto, fácil de tocar
- 💻 Tablet: Botón normal, bien visible
- 🖥️ Desktop: Botón grande, muy visible

## ❓ Preguntas Frecuentes

**P: ¿Puedo deshacer una eliminación?**
R: No, la eliminación es permanente. Debes agregar al miembro de nuevo si lo necesitas.

**P: ¿Qué pasa con los cálculos anteriores?**
R: Se mantienen guardados. Solo se afectan los cálculos futuros.

**P: ¿Puedo eliminar al líder?**
R: No, el líder no puede eliminarse a sí mismo. Solo otros miembros pueden ser eliminados.

**P: ¿Hay límite de eliminaciones?**
R: No, puedes eliminar cuantos miembros quieras.

## 🎯 Resumen

| Característica | Detalles |
|---|---|
| **Ubicación** | Tarjetas de miembros, esquina inferior derecha |
| **Icono** | 🗑️ Papelera roja |
| **Quién puede usar** | Solo el líder del grupo |
| **Confirmación** | Sí, cuadro de confirmación |
| **Feedback** | Toast de éxito/error + animación |
| **Seguridad** | Solo líder, no auto-eliminación |
| **Reversibilidad** | No es reversible |

