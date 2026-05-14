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
- **Historial Detallado:** Registro persistente con métricas de "Tiempo Real" vs "Tiempo Productivo", marcas y ordenación dinámica.
- **Ajustes de Usuario:** Control global sobre la visibilidad de milisegundos y prevención de bloqueo de pantalla (`Keep Awake`).
- **Diseño Premium:** Interfaz limpia con tipografía tabular, feedback háptico y notificaciones locales integradas.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/) (SDK 51+).
- **Lenguaje:** TypeScript para un desarrollo robusto y tipado.
- **Navegación:** React Navigation (Bottom Tabs).
- **Estado:** Context API para una gestión de estado global ligera y eficiente.
- **Persistencia:** AsyncStorage para el almacenamiento local de preferencias e historial.
- **Feedback:** Expo Haptics y Expo Notifications para una experiencia inmersiva.

## 🚀 Instalación y Uso

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el [Expo Go](https://expo.dev/go) en tu dispositivo móvil.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JaiRB19/TimeTrackerApp.git
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto:**
   ```bash
   npx expo start
   ```

## 🗺️ Roadmap: Smart History & Evolution

- [ ] **Smart History (Análisis de Eficiencia):**
    - Implementación de gráficas semanales para visualizar picos de productividad.
    - Sistema de etiquetas (Trabajo, Estudio, Deporte) para categorizar sesiones.
    - Cálculo automático de "Porcentaje de Enfoque" basado en la comparación de tiempo real vs. tiempo trackeado.
- [ ] **Home Widgets:** Widgets para Android e iOS que permitan ver el temporizador activo desde la pantalla de inicio.
- [ ] **Exportación Pro:** Generación de reportes mensuales en formato CSV o PDF para control de horas.
- [ ] **Advanced UI:** Micro-interacciones complejas con `React Native Reanimated` y soporte completo para Dark Mode.

---

Desarrollado con ❤️ por [Jai](https://github.com/JaiRB19)
