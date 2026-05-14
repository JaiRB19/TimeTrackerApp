# 🚀 Historial de Lanzamientos - Time Tracker

Este archivo documenta todas las versiones oficiales de **Time Tracker**, detallando las mejoras, correcciones y nuevas funcionalidades de cada lanzamiento.

---

## [v1.0.0] - Lanzamiento Inicial (MVP) - 13 de mayo de 2026

### ✨ Funcionalidades Principales
- **Dual Engine:** Soporte completo para Cronómetro y Temporizador con precisión basada en el reloj del sistema (`Date.now()`).
- **Control de Presets:** Cuadrícula de 3x3 para selección rápida de tiempos en el temporizador y selector personalizado.
- **Módulo de Marcas (Flags):** Capacidad de registrar marcas de tiempo ilimitadas tanto en cronómetro como en temporizador.
- **Motor de "Tiempo Real":** Seguimiento de la duración real de la sesión (wall-clock time), permitiendo comparar el tiempo productivo vs. tiempo transcurrido total.

### 📊 Gestión de Historial
- **Historial Detallado:** Vista completa de sesiones pasadas con soporte para borrado individual.
- **Modal de Detalles:** Interfaz inmersiva para revisar estadísticas de sesión, marcas y métricas de eficiencia.
- **Ordenación Dinámica:** Capacidad de ordenar marcas por "Recientes" o "Antiguas" dentro de los detalles.

### 🎨 Diseño y UX
- **Estética Premium:** Interfaz limpia con tema "Cloudy Sky", tipografía tabular y acentos dinámicos en azul y magenta.
- **Feedback Háptico:** Respuestas táctiles integradas en botones y alertas mediante `expo-haptics`.
- **Notificaciones Locales:** Alertas sonoras y visuales cuando el temporizador finaliza, incluso en segundo plano.
- **Tap-to-Close:** Navegación intuitiva en modales con cierre por toque exterior.

### ⚙️ Configuración y Privacidad
- **Keep Awake:** Opción para mantener la pantalla encendida durante sesiones de enfoque.
- **Toggle de Milisegundos:** Control sobre el nivel de detalle visual del reloj.
- **Privacy Portal:** Acceso directo a la política de privacidad oficial desde los ajustes.
- **Local First:** Todos los datos se almacenan de forma segura y privada en el dispositivo del usuario (`AsyncStorage`).

---

## 🛠️ Próximamente (v1.1.0)
- **Smart Analysis:** Gráficas de productividad semanal.
- **Categorías:** Etiquetas personalizables para sesiones (Trabajo, Estudio, Deporte).
- **Home Widgets:** Monitoreo del tiempo desde la pantalla de inicio.

---
*Desarrollado con precisión por [Jai](https://github.com/JaiRB19)*
