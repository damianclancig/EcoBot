# Arquitectura y Estándares de Código (EcoBot)

1. **Responsabilidad Única (SRP)**: La lógica debe estar desacoplada.
   - `PlayerController`: Maneja exclusivamente el input y físicas de EcoBot.
   - `InventoryManager`: Gestiona el estado de los ítems recolectados.
   - `EnvironmentController`: Escucha eventos del inventario y maneja la opacidad de las capas del mapa y animaciones del entorno.

2. **No Repetir Código (DRY)**: 
   - Utilizar fábricas (Factories) o clases base para la instanciación de distintos tipos de basura y contenedores.
   - Las lógicas de colisión (overlap) deben ser genéricas y reutilizables.

3. **Comunicación por Eventos**:
   - Utilizar el `Event Emitter` integrado de Phaser para comunicar el `InventoryManager` con el `EnvironmentController` o la `UIScene` sin acoplar las clases.

4. **Idioma**:
   - Todo el código, comentarios y nombres de variables deben estar idealmente en inglés para mantener un estándar, pero la documentación generada al usuario, walkthroughs y explicaciones DEBEN estar en español.
