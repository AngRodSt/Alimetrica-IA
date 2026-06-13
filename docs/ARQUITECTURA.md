# Arquitectura — FoodScan

El proyecto sigue **Clean Architecture**, separando UI, reglas de negocio y acceso a datos
para que cada capa dependa solo de la inferior y sea testeable de forma aislada.

```
app/src/
├── presentation/      Capa de UI (React Native + Expo)
│   ├── screens/       Pantallas: auth, biometrics, food, analysis
│   ├── components/    Componentes reutilizables (Button, Input, Card)
│   ├── navigation/    Navegadores stack/tab
│   ├── hooks/         Custom hooks de UI
│   └── theme/         Colores, tipografía, estilos globales
│
├── domain/            Reglas de negocio (independiente de UI y datos)
│   ├── entities/      User, BiometricProfile, FoodEntry, NutritionResult
│   ├── usecases/      registerUser, generateAnalysis, getRecommendations
│   └── repositories/  Interfaces (contratos sin implementación)
│
├── data/              Acceso a datos
│   ├── repositories/  Implementan las interfaces del dominio
│   ├── datasources/   Llamadas concretas a Supabase / API de IA
│   └── models/        DTOs y mapeo a entidades del dominio
│
├── services/          Servicios transversales
│   ├── supabase/      Cliente, autenticación y queries
│   ├── ai/            Cliente de la API de IA
│   └── storage/       Sesión local
│
├── config/            Variables de entorno y constantes
└── utils/             Helpers, validaciones, formateadores

database/              Migraciones y modelo de datos en Supabase
docs/                  Documentación (arquitectura, backlog, API)
tests/                 Pruebas unitarias y end-to-end (QA)
```

## Regla de dependencias

`presentation → domain ← data`

- **domain** no importa nada de `presentation` ni de `data`; solo define entidades,
  casos de uso e interfaces de repositorio.
- **data** implementa las interfaces de `domain/repositories` usando `datasources`.
- **presentation** consume casos de uso del dominio; no llama directamente a datasources.
- **services** son utilidades transversales (Supabase, IA, storage) que `data` y
  `presentation` pueden usar.

## Estado actual de la migración

El código existente del escáner se reubicó en la nueva estructura:

| Antes (raíz)                  | Ahora                                              |
| ----------------------------- | -------------------------------------------------- |
| `components/SplashScreen.tsx` | `app/src/presentation/screens/SplashScreen.tsx`    |
| `components/WelcomeScreen.tsx`| `app/src/presentation/screens/WelcomeScreen.tsx`   |
| `components/LibraryScreen.tsx`| `app/src/presentation/screens/LibraryScreen.tsx`   |
| `components/ProductDetails.tsx`| `app/src/presentation/screens/ProductDetails.tsx` |
| `components/BarcodeScanner.tsx`| `app/src/presentation/components/BarcodeScanner.tsx` |
| `components/BottomNavigation.tsx`| `app/src/presentation/navigation/BottomNavigation.tsx` |
| `services/openFoodFacts.ts`   | `app/src/data/datasources/openFoodFacts.ts`        |
| `services/storage.ts`         | `app/src/services/storage/storage.ts`              |

`App.tsx` e `index.ts` permanecen en la raíz (entry point de Expo). Las carpetas aún
sin código contienen un `.gitkeep` como marcador y se irán llenando conforme se
implementen autenticación, perfil biométrico y análisis con IA.
