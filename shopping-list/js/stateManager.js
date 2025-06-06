import {getState, updateState} from "./state.js";
import {classes, ids} from "./names.js";
import {clearList, createListItem, createShoppingListItem, setNameOfActiveListInUI, showListUI} from "./uiManager.js";
import {
    DEFAULT_LIST_NAME,
    DEFAULT_SHOPPING_LIST,
    DEFAULT_SHOPPING_LIST_ITEM, DEFAULT_STATE
} from "./defaults.js";

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time
 * the debounced function was called.
 *
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay the invocation of the function.
 * @return {Function} Returns the new debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * A debounced version of the `updateState` function.
 *
 * The debounce interval (300 milliseconds) ensures that `updateState` is executed
 * only after the specified delay has elapsed since the last call.
 */
const debouncedUpdateState = debounce(updateState, 300);

/**
 * Listen for changes and update the state accordingly.
 * @param elem {HTMLElement} The element to listen for changes on.
 */
function listenForChanges(elem) {
    elem.addEventListener('change', () => {
        debouncedUpdateState(getState());
    });
}

/**
 * Parse the state from the UI.
 * @returns {State} The parsed state.
 */
function parseStateFromUI() {
    const newState = DEFAULT_STATE();
    const oldState = getState(); // We have to assume that non-displayed lists are current
    /** @type {NodeList} */
    const lists = document.querySelectorAll(classes.SELECTION_LIST_ITEM.dot);
    lists.forEach((list, idx) => {
        const listName = list.querySelector(classes.SELECTION_LIST_ITEM_NAME.dot).textContent;
        if (!listName) {
            console.error('Failed to find list name element');
        }
        if (list.classList.contains("active")) {
            newState.activeList = idx;
        }
        newState.shoppingLists[idx] = oldState.activeList === idx
            ? parseActiveListFromUI() : JSON.parse(JSON.stringify(oldState.shoppingLists[idx]));
    });
    return newState;
}

/**
 * Parses the active list of items from the user interface and returns it in a structured format.
 *
 * @return {ShoppingList} A structured representation of the active list parsed from the UI.
 */
function parseActiveListFromUI() {
    /** @type {HTMLDivElement} */
    const activeListElement = document.getElementById(ids.SHOPPING_LIST_ID);
    if (!activeListElement) {
        console.error('Failed to find active list in UI');
        return DEFAULT_SHOPPING_LIST();
    }
    /** @type {HTMLDivElement} */
    const listNameRoot = document.getElementById(ids.LIST_NAME_INPUT);
    if (!listNameRoot) {
        console.error('Failed to find list name input element');
    }
    /** @type {string} */
    const listName = listNameRoot
        ? document.getElementById(ids.LIST_NAME_INPUT).value.trim()
        : DEFAULT_LIST_NAME();
    /** @type {ShoppingListItem[]} */
    const items = [];
    for (const itemElement of activeListElement.children) {
        if (itemElement.getElementsByClassName(classes.SHOPPING_LIST_ITEM.raw).length > 0) {
            items.push(parseShoppingListItemFromUI(itemElement));
        }
    }
    return {
        name: listName,
        items: items,
    };
}


function parseShoppingListItemFromUI(itemElement) {
    const nameInput = itemElement.querySelector('input[name="name"]');
    const quantityInput = itemElement.querySelector('input[name="quantity"]');
    const checkbox = itemElement.querySelector('input[name="checked"]');
    if (!nameInput || !quantityInput || !checkbox) {
        console.error('Failed to find input elements for shopping list item');
        return DEFAULT_SHOPPING_LIST_ITEM();
    }
    return {
        name: nameInput.value,
        quantity: quantityInput.value,
        checked: checkbox.checked,
    };
}

/**
 * Render the UI from the state.
 * @param {State} state
 * @return {void} The function does not return a value.
 */
function renderUI(state) {
    renderListsMenu(state);
    renderSelectedList(state);
}

/**
 * Render the shopping lists menu.
 * @param {State} state
 * @return {void} The function does not return a value.
 */
function renderListsMenu(state) {
    const lists = state.shoppingLists;
    const shoppingListMenuRootElement =
        document.getElementById(ids.SHOPPING_LIST_MENU_GROUP_ID);
    shoppingListMenuRootElement != null
        || console.error("Could not find shopping list menu root element");
    clearList(shoppingListMenuRootElement);
    const activeListIndex = state.activeList;
    lists.forEach((list, idx) => {
        try {
            const newListItem = createListItem(list.name, idx, idx === activeListIndex);
            if (shoppingListMenuRootElement.children.length >= 2) {
                shoppingListMenuRootElement.insertBefore(newListItem,
                    shoppingListMenuRootElement.children[idx]);
            } else {
                shoppingListMenuRootElement.insertBefore(newListItem,
                    shoppingListMenuRootElement.children[0]);
            }
        } catch (error) {
            console.error("Failed to create shopping list menu item:", error);
        }
    });
}

/**
 * Render the selected shopping list.
 * @param {State} state
 * @return {void} The function does not return a value.
 */
function renderSelectedList(state) {
    const activeListIdx = state.activeList;
    const activeList = state.shoppingLists[activeListIdx];
    const shoppingListRootElement = document.getElementById(ids.SHOPPING_LIST_ID);
    clearList(shoppingListRootElement);
    if (!activeList) {
        showListUI(false);
        return;
    }
    showListUI(true);
    activeList.items.forEach((item, idx) => {
        try {
            if (shoppingListRootElement.children.length >= 2) {
                shoppingListRootElement.insertBefore(createShoppingListItem(item, idx),
                    shoppingListRootElement.children[idx]);
            } else {
                shoppingListRootElement.insertBefore(createShoppingListItem(item, idx),
                    shoppingListRootElement.children[0]);
            }
        } catch (error) {
            console.error("Failed to create shopping list item:", error);
        }
    });
    setNameOfActiveListInUI(activeList.name);
}

/**
 * Adds a shopping list item to the specified shopping list in the state object.
 * Validates the input parameters and logs an error if the state or list data is invalid.
 *
 * @param {Object} state - The state object containing shopping lists.
 * @param {number} listIdx - The index of the shopping list to which the item will be added.
 * @param {Object} item - The shopping list item to be added to the specified list.
 * @return {void} No return value; modifies the state object directly.
 */
function addShoppingListItemToState(state, listIdx, item) {
    if (!state) {
        console.error('State is null or undefined');
        return;
    }
    if (!Array.isArray(state.shoppingLists)) {
        console.error('State shopping list data is malformed');
        return;
    }
    if (listIdx < 0 || listIdx >= state.shoppingLists.length) {
        console.error(`Invalid list index: ${listIdx}`);
        return;
    }

    const list = state.shoppingLists[listIdx];
    list.items.push(item);
}

/**
 * Add an item to a shopping list.
 * @param listIdx {Number} The index of the shopping list to add the item to.
 * @param item {ShoppingListItem} The item to add.
 */
function addShoppingListItem(listIdx, item) {
    const state = getState();
    addShoppingListItemToState(state, listIdx, item);
    updateState(state);
}

/**
 * Adds a shopping list to the system.
 * @param {ShoppingList} list - A shopping list to add.
 */
function addShoppingList(list) {
    const state = getState();
    state.shoppingLists.push(list);
    state.activeList = state.shoppingLists.length - 1;
    updateState(state);
}

export { renderUI, listenForChanges, addShoppingListItem, addShoppingList };
