import Phaser from 'phaser';

/**
 * Event Emitter global para comunicar componentes desacoplados
 * (SRP y DRY).
 */
const events = new Phaser.Events.EventEmitter();

export const EVENTS = {
    ITEM_COLLECTED: 'item_collected',
    ITEM_PICKED: 'item_picked',
    INVENTORY_FULL: 'inventory_full',
    INVENTORY_EMPTIED: 'inventory_emptied',
    ITEMS_RECYCLED: 'items_recycled',
    CORRECT_RECYCLE: 'correct_recycle',
    SCORE_UPDATED: 'score_updated',
    ENVIRONMENT_RESTORED: 'environment_restored',
    WRONG_CONTAINER: 'wrong_container',
    MOBILE_ACTION: 'mobile_action'
};

export default events;
