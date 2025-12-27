/** @type {ShoppingList} */
const _DEFAULT_SHOPPING_LIST = {
    name: 'My List',
    items: []
};

/** @type {ShoppingListItem} */
const _DEFAULT_SHOPPING_LIST_ITEM = {
    name: 'Name',
    quantity: 1,
    checked: false
};

/** @type {State} */
const _DEFAULT_STATE = {
    shoppingLists: [],
    activeList: -1
};
/** @type {Settings} */
const _DEFAULT_SETTINGS = {
    theme: 'dark'
};

/**
 * @returns {ShoppingList}
 */
function DEFAULT_SHOPPING_LIST() {
    return structuredClone(_DEFAULT_SHOPPING_LIST);
}

/**
 * @returns {ShoppingListItem}
 */
function DEFAULT_SHOPPING_LIST_ITEM() {
    return structuredClone(_DEFAULT_SHOPPING_LIST_ITEM);
}

/**
 * @returns {State}
 */
function DEFAULT_STATE() {
    return structuredClone(_DEFAULT_STATE);
}

/**
 * @return {Settings}
 */
function DEFAULT_SETTINGS() {
    return structuredClone(_DEFAULT_SETTINGS);
}

export { DEFAULT_STATE, DEFAULT_SHOPPING_LIST, DEFAULT_SHOPPING_LIST_ITEM, DEFAULT_SETTINGS };