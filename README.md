# Alimetrica IA

Alimetrica IA es una aplicación móvil que te permite escanear códigos de barras de productos alimenticios y obtener información nutricional detallada usando la base de datos de OpenFoodFacts.

## Probar la app con Expo Go

### Requisitos previos

- **Dispositivo móvil** (Android o iOS)
- **Expo Go** instalado en tu dispositivo:
  - [Android - Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

### Pasos para ejecutar

#### 1. Clonar el repositorio

```bash
git clone https://github.com/AngRodSt/Alimetrica IA.git
cd Alimetrica IA
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Iniciar el servidor de desarrollo

```bash
npm start
```

o con Expo CLI:

```bash
npx expo start
```

#### 4. Abrir en tu dispositivo

Una vez iniciado, verás un código QR en la terminal:

- **Android**: Abre la app **Expo Go** y escanea el código QR desde la pestaña "Projects"
- **iOS**: Abre la app **Cámara** nativa, escanea el código QR y selecciona el banner de Expo Go

> ⚠️ **Importante**: Tu computadora y tu dispositivo móvil deben estar en la misma red WiFi.

### Alternativas de conexión

Si el código QR no funciona:

```bash
# Usar túnel (más lento pero funciona con cualquier red)
npx expo start --tunnel

# Usar conexión LAN (más rápido, misma red)
npx expo start --lan

# Usar localhost (solo para emuladores)
npx expo start --localhost
```

## Características

- Escaneo de códigos de barras
- Información nutricional detallada
- Guardado de productos favoritos
- Historial de búsquedas
- Interfaz intuitiva y moderna

## Tecnologías utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma para React Native
- **TypeScript** - Lenguaje de programación
- **Expo Camera** - Acceso a la cámara del dispositivo
- **Expo Barcode Scanner** - Escaneo de códigos de barras
- **OpenFoodFacts API** - Base de datos de productos alimenticios
- **AsyncStorage** - Almacenamiento local persistente

## Estructura del proyecto

```
Alimetrica IA/
├── components/          # Componentes reutilizables
│   ├── BarcodeScanner.tsx
│   ├── ProductDetails.tsx
│   ├── LibraryScreen.tsx
│   └── ...
├── services/           # Servicios y APIs
│   ├── openFoodFacts.ts
│   └── storage.ts
├── assets/            # Imágenes e iconos
├── App.tsx            # Componente principal
└── package.json       # Dependencias del proyecto
```

## Scripts disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web
```

## Solución de problemas

### El código QR no funciona

1. Verifica que estés en la misma red WiFi
2. Intenta usar el modo túnel: `npx expo start --tunnel`
3. Reinicia el servidor de desarrollo

### Error de permisos de cámara

- La app solicitará permisos de cámara al primer uso
- Si los rechazaste, ve a Configuración > Apps > Expo Go > Permisos y activa la cámara

### La app no encuentra productos

- Verifica tu conexión a internet
- Algunos productos pueden no estar en la base de datos de OpenFoodFacts

## Licencia

Este proyecto está bajo la licencia MIT.

## Autor

**AngRodSt**

- GitHub: [@AngRodSt](https://github.com/AngRodSt)


