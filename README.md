# ⏱️ Time Tracker

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Time Tracker** es una aplicación móvil de alto rendimiento diseñada para la precisión y la simplicidad. Construida con un enfoque minimalista, permite a los usuarios gestionar cronómetros y temporizadores con una precisión absoluta mediante el uso de sincronización con el reloj del sistema.

Este proyecto forma parte de mi portafolio profesional, demostrando habilidades en arquitectura modular, gestión de estado global y persistencia de datos nativa.

## ✨ Características Principales

- **Dual Mode:** Intercambio fluido entre Cronómetro (Stopwatch) y Temporizador (Countdown).
- **Precisión Atómica:** Motor de tiempo basado en `Date.now()` para evitar el desfasaje acumulado de los intervalos estándar de JavaScript.
- **Gestión de Presets:** Configuración rápida de tiempos comunes y selector personalizado mediante modal optimizado.
- **Historial de Sesiones:** Registro persistente de cada actividad, incluyendo fecha, modo, duración y marcas registradas.
- **Ajustes de Usuario:** Control global sobre la visibilidad de milisegundos y prevención de bloqueo de pantalla (`Keep Awake`).
- **Diseño Premium:** Interfaz limpia con tipografía tabular para evitar saltos visuales en el contador y acentos en Magenta dinámico.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/) (SDK 51+).
- **Lenguaje:** TypeScript para un desarrollo robusto y tipado.
- **Navegación:** React Navigation (Bottom Tabs).
- **Estado:** Context API para una gestión de estado global ligera y eficiente.
- **Persistencia:** AsyncStorage para el almacenamiento local de preferencias e historial.
- **Hooks Personalizados:** Lógica de negocio aislada en `useTimer`, `useHistory` y `useSettings`.

## 🚀 Instalación y Uso

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el [Expo Go](https://expo.dev/go) en tu dispositivo móvil.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JaiRB19/TimeTrackerApp.git
   cd TimeTrackerApp
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto:**
   ```bash
   npx expo start
   ```

4. **Escanear el código QR** con la app de Expo Go para visualizar en tu dispositivo.

## 🗺️ Roadmap V2 (Próximamente)

- [ ] **Feedback Háptico:** Integración de `expo-haptics` para respuestas táctiles en cada interacción.
- [ ] **Notificaciones Locales:** Alertas sonoras y visuales cuando un temporizador finaliza en segundo plano.
- [ ] **Visualización de Datos:** Gráficas de rendimiento semanal basadas en el historial de sesiones.
- [ ] **Animaciones Avanzadas:** Transiciones fluidas con `React Native Reanimated`.

---

Desarrollado con ❤️ por [Jai](https://github.com/JaiRB19)
