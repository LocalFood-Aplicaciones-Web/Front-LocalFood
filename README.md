# 🍽️ LunchMate - Restaurant Distance Calculator

A modern Vue.js application for managing colleagues, groups, and finding optimal restaurant locations for team lunches.

## ✨ Features Implemented

### 🔐 Authentication (IAM)
- ✅ User registration with validation
- ✅ Login with email/password
- ✅ Protected routes with authentication guards
- ✅ Logout functionality
- ✅ Session persistence with localStorage
- ✅ Demo credentials:
  - **Admin**: admin@example.com / admin123
  - **User**: user@example.com / user123

### 👥 Colleagues Management
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ View all colleagues in card grid layout
- ✅ PrimeVue DataView with beautiful UI
- ✅ Detailed colleague information (name, email, phone, address, coordinates)

### 👥 Groups Management
- ✅ Create, edit, and delete groups
- ✅ Assign colleagues to groups
- ✅ Custom group colors
- ✅ Group descriptions
- ✅ View colleagues by group (accordion view)
- ✅ Track unassigned colleagues
- ✅ Favorite restaurants per group

### 🎨 UI/UX Enhancements
- ✅ **PrimeVue Components**: Modern, professional component library
- ✅ **PrimeIcons**: Beautiful icon set throughout the app
- ✅ **PrimeFlex**: Utility CSS for rapid layouts
- ✅ **Smooth Page Transitions**: Fade effects between routes
- ✅ **Card Animations**: Fade-in-up, hover lift effects, smooth transitions
- ✅ **Loading States**: ProgressSpinner, Skeleton loaders, Shimmer effects
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Confirmation Dialogs**: Safe delete operations
- ✅ **Responsive Design**: Mobile, tablet, and desktop layouts

### 🎭 Animation System
- ✅ Fade, Slide, and Scale transitions
- ✅ List animations (staggered entrance/exit)
- ✅ Bounce and pulse animations
- ✅ Hover effects (lift, grow)
- ✅ Keyframe animations throughout

### 🌐 Internationalization (i18n)
- ✅ English/Spanish language support
- ✅ Language toggle in sidebar
- ✅ Translations for all UI elements

### 🏗️ Architecture
- ✅ **DDD (Domain-Driven Design)** - Domain, Application, Infrastructure, Presentation layers
- ✅ **Clean Architecture** principles
- ✅ Separation of concerns
- ✅ Modular bounded contexts

## 🎯 Key Technologies

- **Vue 3.5.22** - Composition API with `<script setup>`
- **Vite 7.1.7** - Lightning-fast build tool
- **Pinia 2.3.1** - State management
- **Vue Router 4.6.3** - SPA routing with guards
- **Vue I18n 9.14.5** - Internationalization
- **Axios 1.13.2** - HTTP client
- **PrimeVue 3.53.1** - UI Component Library ⭐ NEW
- **PrimeIcons 7.0.0** - Icon set ⭐ NEW
- **PrimeFlex 3.3.1** - Utility CSS ⭐ NEW
- **JSON Server 0.17.4** - Mock REST API

## 🎨 PrimeVue Components Used

Button, Card, Dialog, InputText, InputNumber, Dropdown, Textarea, ColorPicker, Avatar, Tag, Badge, TabView, Accordion, Divider, Toast, ConfirmDialog, ProgressSpinner, Password, Message

## Project Structure 📁

```
src/
├── colleagues/                    # Colleagues Bounded Context
│   ├── domain/
│   │   └── model/
│   │       ├── colleague.entity.js
│   │       └── colleague.model.js
│   ├── application/
│   │   └── colleagues.store.js
│   ├── infrastructure/
│   │   ├── colleagues-api.js
│   │   ├── colleague.resource.js
│   │   └── colleague.assembler.js
│   └── presentation/
│       ├── views/
│       │   └── colleagues-list.vue
│       ├── components/
│       │   ├── colleague-item.vue
│       │   └── colleague-form.vue
│       └── colleagues-routes.js
├── Shared/
│   ├── infrastructure/
│   │   ├── base-api.js
│   │   └── base-endpoint.js
│   └── presentation/
│       ├── components/
│       │   └── navbar.vue
│       └── pages/
├── locales/
│   ├── en.json
│   └── es.json
└── router/
    └── index.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the JSON Server (API)**
   ```bash
   npm run api
   ```
   The API will run on http://localhost:3000

3. **Start the Development Server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:5173

4. **Open your browser** and navigate to http://localhost:5173

## 🔑 First Steps

1. **Login Page**: You'll be redirected to `/login`
2. **Use demo credentials**:
   - Email: `admin@example.com`
   - Password: `admin123`
3. **Explore the dashboard** with real-time stats
4. **Navigate to Colleagues** to see the full CRUD with groups

## 🔄 API Endpoints

The JSON Server provides these RESTful endpoints:

```
GET    /colleagues      # List all colleagues
GET    /colleagues/:id  # Get colleague by ID
POST   /colleagues      # Create colleague
PUT    /colleagues/:id  # Update colleague
DELETE /colleagues/:id  # Delete colleague

GET    /groups          # List all groups ⭐ NEW
GET    /groups/:id      # Get group by ID ⭐ NEW
POST   /groups          # Create group ⭐ NEW
PUT    /groups/:id      # Update group ⭐ NEW
DELETE /groups/:id      # Delete group ⭐ NEW

GET    /users           # List users (with filters)
POST   /users           # Register new user ⭐ NEW

GET    /restaurants     # List all restaurants
GET    /lunchHistory    # List lunch history ⭐ NEW
```

## DDD Architecture 🏗️

### Domain Layer
- **Entities**: Pure domain objects (`colleague.entity.js`)
- **Models**: Business logic and domain rules (`colleague.model.js`)

### Application Layer
- **Stores**: Pinia stores for state management
- Uses domain entities and coordinates with infrastructure

### Infrastructure Layer
- **APIs**: HTTP communication with backend
- **Resources**: DTOs for API communication
- **Assemblers**: Convert between domain entities and API resources

### Presentation Layer
- **Views**: Page components
- **Components**: Reusable UI components
- **Routes**: Route configuration

## ✅ What's Working

1. ✅ **Full Authentication Flow**
   - Login redirects to dashboard
   - Register creates account and auto-logs in
   - Logout clears session
   - Protected routes work correctly

2. ✅ **Colleagues CRUD**
   - Add, edit, delete colleagues with smooth animations
   - Beautiful card layouts with PrimeVue
   - Group assignment via dropdown
   - Form validation

3. ✅ **Groups Management**
   - Create groups with custom colors (ColorPicker)
   - Assign colleagues to groups
   - View by groups with accordion
   - Delete groups (unassigns colleagues automatically)

4. ✅ **Animations & Transitions**
   - Page transitions between routes
   - Card enter/exit animations with TransitionGroup
   - Hover effects on cards
   - Loading skeletons with shimmer effect
   - Smooth fade-ins

5. ✅ **Responsive Design**
   - Mobile sidebar collapse
   - Responsive grid layouts
   - Touch-friendly on mobile

## 🎬 Demo Data

The `server/db.json` includes:
- 5 colleagues (distributed across 3 groups)
- 3 groups (Marketing Team, Engineering Squad, Friday Lunch Crew)
- 6 restaurants
- 2 users (admin and regular user)
- 2 lunch history records

## 🚧 Future Enhancements

- Restaurant CRUD (similar to colleagues)
- Distance calculation algorithm
- Map integration (Google Maps/Leaflet)
- Voting system for restaurants
- Analytics dashboard
- Dark mode
- PWA capabilities

## 🎉 Completed Features Summary

This implementation includes:
- ✅ Complete IAM system (login, register, logout, guards)
- ✅ Full PrimeVue integration with 20+ components
- ✅ Groups system with CRUD operations
- ✅ Beautiful animations and transitions throughout
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Responsive design
- ✅ i18n support
- ✅ Clean architecture with DDD
- ✅ Modern UI with smooth UX

**The application is production-ready for demo purposes!** 🚀

---

Made with ❤️ using Vue 3 + PrimeVue + Clean Architecture
