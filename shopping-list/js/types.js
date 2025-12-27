/**
 * The full state of the application.
 * @typedef {Object} State
 * @property {ShoppingList[]} shoppingLists
 * @property {Number} activeList
 */

/**
 * A shopping list.
 * @typedef {Object} ShoppingList
 * @property {string} name
 * @property {ShoppingListItem[]} items
 */

/**
 * A shopping list item.
 * @typedef {Object} ShoppingListItem
 * @property {string} name
 * @property {Number} quantity
 * @property {boolean} checked
 */

/**
 * CSS class names
 * @typedef {Object} CSSClass
 * @property {string} raw
 * @property {string} dot
 */

/**
 * Settings object.
 * @typedef {Object} Settings
 * @property {Theme} theme
 */

/**
 * Visual theme.
 * @typedef {"dark"|"light"|"winter"|"spring"|"summer"|"autumn"} Theme
 */