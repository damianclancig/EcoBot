import events, { EVENTS } from '../utils/Events.js';

export default class InventoryManager {
    constructor(maxCapacity = 5) {
        this.items = [];
        this.maxCapacity = maxCapacity;
    }

    addItem(itemData) {
        if (this.isFull()) return false;
        
        this.items.push(itemData);
        events.emit(EVENTS.ITEM_COLLECTED, { items: this.items.map(i => i.type), type: itemData.type });
        
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
        const itemData = this.items.shift();

        if (this.matchesContainer(itemData.type, containerType)) {
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
            events.emit(EVENTS.WRONG_CONTAINER, { item: itemData.type, containerType });
        }

        // 3. Notificar a la UI para que redibuje los íconos restantes en la mochila
        events.emit(EVENTS.INVENTORY_EMPTIED, { items: this.items.map(i => i.type) }); 

        return { success: true, points, validItems, invalidItems, itemData };
    }

    matchesContainer(itemType, containerType) {
        try {
            // Extraer el color dinámicamente según la nueva nomenclatura:
            // itemType: "ecoBot-blue-box.png" -> index 1 es "blue"
            const itemColor = itemType.split('-')[1]; 
            
            // containerType: "ecoBot-container-blue.png" -> index 2 es "blue.png", luego le quitamos el .png
            const containerColor = containerType.split('-')[2].split('.')[0]; 
            
            return itemColor === containerColor;
        } catch (e) {
            return false;
        }
    }
}
