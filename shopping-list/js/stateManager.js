import {debouncedUpdateState, getState} from "./state.js";
import {ids} from "./names.js";
import {clearList, createListItem, createShoppingListItem, showListUI} from "./uiManager.js";

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
    document.getElementById(ids.LIST_NAME_TEXT).innerText = activeList.name;
    document.getElementById(ids.LIST_NAME_INPUT).value = activeList.name;
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
    setActiveListInUIState(activeList.name);
}

/**
 * Retrieves a shopping list at the specified index from the state object.
 *
 * @param {State} state - The state object containing an array of shopping lists.
 * @param {number} listIdx - The index of the shopping list to retrieve.
 * @return {ShoppingList|undefined} The shopping list at the specified index, or undefined if the index is invalid.
 */
function getListAtIndex(state, listIdx) {
    if (listIdx < 0 || listIdx >= state.shoppingLists.length) {
        console.error(`Invalid list index: ${listIdx}`);
        return;
    }
    return state.shoppingLists[listIdx];
}

/**
 * Retrieves the item at the specified index from the provided shopping list.
 *
 * @param {ShoppingList} list - The list object containing an `items` array property.
 * @param {number} itemIdx - The index of the item to retrieve.
 * @return {ShoppingListItem|undefined} The item at the specified index, or undefined if the index is invalid.
 */
function getItemAtIndex(list, itemIdx) {
    if (itemIdx < 0 || itemIdx >= list.items.length) {
        console.error(`Invalid item index: ${itemIdx}`);
        return;
    }
    return list.items[itemIdx];
}

/**
 * Retrieves the active item at the specified index from the currently active shopping list.
 *
 * @param {number} itemIdx - The index of the item to retrieve from the active shopping list.
 * @return {ShoppingListItem|undefined} The item located at the specified index in the active shopping list,
 *              or undefined if the index is invalid.
 */
function getActiveItemAtIndex(itemIdx) {
    const state = getState();
    return getItemAtIndex(state.shoppingLists[state.activeList], itemIdx);
}

/**
 * Updates the item at the specified index within the list.
 *
 * @param {ShoppingList} list - The list object containing an array of items.
 * @param {number} itemIdx - The index of the item to be updated in the list.
 * @param {ShoppingListItem} item - The new item to set at the specified index.
 * @return {void} This method does not return a value.
 */
function setItemAtIndex(list, itemIdx, item) {
    if (itemIdx < 0 || itemIdx >= list.items.length) {
        console.error(`Invalid item index: ${itemIdx}`);
        return;
    }
    list.items[itemIdx] = item;
    debouncedUpdateState(getState());
}

/**
 * Sets the active item at the specified index in the currently active shopping list.
 *
 * @param {number} itemIdx - The index of the item to be set as active.
 * @param {ShoppingListItem} item - The item object to set at the specified index.
 * @return {void} This method does not return a value.
 */
function setActiveItemAtIndex(itemIdx, item) {
    const state = getState();
    setItemAtIndex(state.shoppingLists[state.activeList], itemIdx, item);
}

/**
 * Add an item to a shopping list.
 * @param listIdx {Number} The index of the shopping list to add the item to.
 * @param item {ShoppingListItem} The item to add.
 */
function addShoppingListItem(listIdx, item) {
    const state = getState();
    const list = getListAtIndex(state, listIdx);
    list.items.push(item);
    debouncedUpdateState(state);
}

/**
 * Removes an item from the currently active shopping list based on the provided index.
 *
 * @param {number} itemIdx*/
function removeShoppingListItemFromActiveList(itemIdx) {
    const state = getState();
    const list = getListAtIndex(state, state.activeList);
    list.items.splice(itemIdx, 1);
    debouncedUpdateState(state);
}

/**
 * Moves a shopping list item from one position to another within the active list.
 * @param {number} sourceIdx - The index of the item to move.
 * @param {number} destIdx - The destination index where the item should be moved to.
 * @return {void}
 */
function moveShoppingListItemInActiveList(sourceIdx, destIdx) {
    const state = getState();
    const list = getListAtIndex(state, state.activeList);
    const item = list.items.splice(sourceIdx, 1)[0];
    list.items.splice(destIdx, 0, item);
    debouncedUpdateState(state);
}

/**
 * Adds a shopping list to the system.
 * @param {ShoppingList} list - A shopping list to add.
 */
function addShoppingList(list) {
    const state = getState();
    state.shoppingLists.push(list);
    state.activeList = state.shoppingLists.length - 1;
    debouncedUpdateState(state);
}

/**
 * Removes a shopping list from the application's state by its index.
 * Also adjusts the active list index if the removed list was the active list.
 *
 * @param {number} idx - The index of the shopping list to remove.
 * @return {void}
 */
function removeShoppingList(idx) {
    const state = getState();
    if (idx < 0 || idx > state.shoppingLists.length) {
        console.error(`Invalid list index: ${idx}`)
        return;
    }
    state.shoppingLists.splice(idx, 1);
    // Handle the case where we delete our currently active list
    if (state.activeList === idx) {
        state.activeList = state.shoppingLists.length > 0 ? Math.max(state.activeList - 1, 0) : -1;
    }
    debouncedUpdateState(state);
}

function renameActiveList(name) {
    const state = getState();
    setActiveListInUIState(name, state);
    debouncedUpdateState(state);
}

function setActiveListInUIState(name, state = getState()) {
    const activeList = getListAtIndex(state, state.activeList);
    activeList.name = name;
}

/**
 * Sets the active list by its index in the shopping lists array.
 * Validates that the provided index is within the bounds of the shopping lists array.
 * Updates the active list index and triggers a debounced update of the state.
 *
 * @param {number} idx - The index of the shopping list to set as active.
 *          Must be within the range of the shopping lists array.
 * @return {void}
 */
function setActiveList(idx) {
    const state = getState();
    if (idx < 0 || idx > state.shoppingLists.length) {
        console.error(`Invalid active list index: ${idx}`);
        return;
    }
    state.activeList = idx;
    debouncedUpdateState(state);
}

export { renderUI, addShoppingListItem, addShoppingList, removeShoppingList, removeShoppingListItemFromActiveList,
    moveShoppingListItemInActiveList, setActiveList, getActiveItemAtIndex, setActiveItemAtIndex, renameActiveList };
