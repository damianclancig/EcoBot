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
            points += 10;
            validItems = 1;
            // Se asume que el reciclaje fue exitoso
            events.emit(EVENTS.ITEMS_RECYCLED, { points, validItems });
        } else {
            // Reciclaje fallido, penalización. El item desaparece igual
            points -= 5;
            invalidItems = 1;
            events.emit(EVENTS.WRONG_CONTAINER, { item, containerType });
        }

        // Siempre avisamos que el inventario se actualizó (para redibujar la pila visual)
        events.emit(EVENTS.INVENTORY_EMPTIED, { items: this.items }); // Usamos EMPTIED temporalmente como 'changed'
        
        if (points !== 0) {
            events.emit(EVENTS.SCORE_UPDATED, { delta: points });
        }

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
