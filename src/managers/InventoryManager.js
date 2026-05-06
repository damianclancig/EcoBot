import events, { EVENTS } from '../utils/Events.js';

export default class InventoryManager {
    constructor(maxCapacity = 5) {
        this.items = [];
        this.maxCapacity = maxCapacity;
    }

    addItem(itemType) {
        if (this.isFull()) return false;
        
        this.items.push(itemType);
        events.emit(EVENTS.ITEM_COLLECTED, { items: this.items, type: itemType });
        
        if (this.isFull()) {
            events.emit(EVENTS.INVENTORY_FULL);
        }
        return true;
    }

    isFull() {
        return this.items.length >= this.maxCapacity;
    }

    recycle(containerType) {
        if (this.items.length === 0) return { success: false, points: 0, recycled: 0 };

        let points = 0;
        let validItems = 0;
        let invalidItems = 0;

        // Sacar solo el primer elemento que entró a la cola (FIFO)
        const item = this.items.shift();

        if (this.matchesContainer(item, containerType)) {
            points = 10;
            validItems = 1;
        } else {
            points = -5;
            invalidItems = 1;
        }

        // 1. Siempre emitir el puntaje PRIMERO, para que el HUD se actualice antes que nada
        events.emit(EVENTS.SCORE_UPDATED, { delta: points });

        // 2. Notificar al motor si se limpió contaminación o si hay penalización de dispersión
        if (validItems > 0) {
            events.emit(EVENTS.ITEMS_RECYCLED, { points, validItems });
        } else {
            events.emit(EVENTS.WRONG_CONTAINER, { item, containerType });
        }

        // 3. Notificar a la UI para que redibuje los íconos restantes en la mochila
        events.emit(EVENTS.INVENTORY_EMPTIED, { items: this.items }); 

        return { success: true, points, validItems, invalidItems };
    }

    matchesContainer(itemType, containerType) {
        const matches = {
            'organico': ['manzana', 'platano'],
            'plastico': ['plastico_botella', 'bolsa'],
            'papel': ['papel_hoja', 'papel_diario', 'papel_servilleta', 'carton_leche', 'carton_crema', 'carton'],
            'vidrio': ['vidrio_botella'],
            'ewaste': ['bateria', 'movil']
        };

        return matches[containerType]?.includes(itemType) || false;
    }
}
