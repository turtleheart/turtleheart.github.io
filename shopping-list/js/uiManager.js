import {classes, ids} from "./names.js";

/**
 * Creates a new list item element with a name and a delete button.
 *
 * @param {string} name - The text to display as the name of the list item.
 * @param {Number} idx - The item's index as it appears in the list of lists.
 * @param {Boolean} active - Whether the item is active or not
 * @return {HTMLAnchorElement} The created list item element.
 */
function createListItem(name, idx, active) {
    // Create the main anchor element
    const listItem = document.createElement('a');
    listItem.href = '#';
    listItem.className = 'selection-list-item d-flex justify-content-between list-group-item list-group-item-action py-3';
    if (active) {
        listItem.className += ' active';
    }
    listItem.dataset.idx = String(idx);

    // Create the span for the list name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.className = 'selection-list-item-name';

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm';

    // Create the rubbish icon
    const trashIcon = document.createElement('i');
    trashIcon.className = 'bi bi-trash';

    // Assemble the elements
    deleteButton.appendChild(trashIcon);
    listItem.appendChild(nameSpan);
    listItem.appendChild(deleteButton);

    initSelectListItem(listItem);
    initRemoveListButton(deleteButton);

    return listItem;
}

function initSelectListItem(item) {
    item.addEventListener('click', () => {
        selectListAsActive(item);
    });
}

function selectListAsActive(item) {
    const listItems = document.querySelectorAll(classes.SELECTION_LIST_ITEM.dot);
    listItems.forEach((listItem) => {
        listItem.classList.remove("active");
    });
    item.classList.add("active");
    dispatchGlobalChangeEvent();
}

function initRemoveListButton(deleteButton) {
    const listItem = deleteButton.closest(classes.SELECTION_LIST_ITEM.dot);
    deleteButton.addEventListener('click', (event) => {
        // TODO: handle case if we have selected the list to delete
        event.stopPropagation();
        listItem?.remove();
        dispatchGlobalChangeEvent();
    });
}

/**
 * Creates a shopping list item element.
 * @param {ShoppingListItem} item - The shopping list item data
 * @param {Number} idx - The item's index as it appears in the shopping list
 * @returns {HTMLDivElement} The created shopping list item element
 */
function createShoppingListItem(item, idx) {
    // Create the outer column container
    const colContainer = document.createElement('div');
    colContainer.className = 'col-sm-6 col-md-4';
    colContainer.dataset.idx = String(idx);

    // Create the shopping list item container
    const itemContainer = document.createElement('div');
    itemContainer.className = 'shopping-list-item d-flex align-items-center justify-content-between border p-2 mb-2';

    // Create the left section container
    const leftSection = document.createElement('div');
    leftSection.className = 'd-flex align-items-center col';

    // Create checkbox wrapper
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'form-check me-2';
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input';
    checkbox.type = 'checkbox';
    checkbox.name = 'checked';
    checkbox.checked = item.checked;
    checkbox.setAttribute('aria-label', 'bought');
    checkboxWrapper.appendChild(checkbox);

    // Create the drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle me-2';
    dragHandle.style.cursor = 'move';
    dragHandle.draggable = true;
    const gripIcon = document.createElement('i');
    gripIcon.className = 'bi bi-grip-vertical';
    dragHandle.appendChild(gripIcon);

    // Create quantity input
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.className = 'form-control form-control-sm';
    quantityInput.setAttribute('aria-label', 'quantity');
    quantityInput.style.width = '70px';
    quantityInput.value = String(item.quantity || 1);
    quantityInput.min = "1";
    quantityInput.name = 'quantity';

    // Create item name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control form-control-sm mx-2';
    nameInput.setAttribute('aria-label', 'item');
    nameInput.value = item.name || '';
    nameInput.placeholder = 'Item';
    nameInput.name = 'name';

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm';
    const trashIcon = document.createElement('i');
    trashIcon.className = 'bi bi-trash';
    deleteButton.appendChild(trashIcon);

    // Assemble all elements
    leftSection.appendChild(checkboxWrapper);
    leftSection.appendChild(dragHandle);
    leftSection.appendChild(quantityInput);
    leftSection.appendChild(nameInput);

    itemContainer.appendChild(leftSection);
    itemContainer.appendChild(deleteButton);

    colContainer.appendChild(itemContainer);

    // Initialise logic for the item
    initDraggableItem(dragHandle);
    initRemoveItemButton(deleteButton);

    return colContainer;
}

/**
 * Updates the UI to reflect the name of the currently active list.
 *
 * @param {string} name - The name to set as the active list's display name in the UI.
 */
function setNameOfActiveListInUI(name) {
    const listNameInputElement = document.getElementById(ids.LIST_NAME_INPUT);
    listNameInputElement.value = name;
    const listNameSpan = document.getElementById(ids.LIST_NAME_TEXT);
    listNameSpan.innerText = name;
}

/** @type {HTMLElement} */
let draggedItem = null;

/**
 * Initialise drag logic for a shopping list HTML item.
 *
 * @param {HTMLElement} item - the drag handle to initialise
 */
function initDraggableItem(item) {
    const listItem = item.closest(classes.SHOPPING_LIST_ITEM.dot);
    // When drag starts
    listItem.addEventListener('dragstart', (e) => {
        draggedItem = listItem;
        e.dataTransfer.effectAllowed = 'move';
        // Add a class to style the dragged item
        listItem.classList.add('dragging');
    });

    // When drag ends
    listItem.addEventListener('dragend', () => {
        draggedItem = null;
        listItem.classList.remove('dragging');
        listItem.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        }));
    });

    // When dragging over another item
    listItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        const rect = listItem.getBoundingClientRect();

        if (listItem !== draggedItem) {
            const isHorizontal = window.innerWidth >= parseFloat(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--bs-breakpoint-sm'));
            const position = isHorizontal ? (e.clientX - rect.left) : (e.clientY - rect.top);
            const threshold = isHorizontal ? rect.width / 2 : rect.height / 2;

            if (position < threshold) {
                listItem.parentNode.parentNode.insertBefore(draggedItem.parentNode, listItem.parentNode);
            } else {
                listItem.parentNode.parentNode.insertBefore(draggedItem.parentNode, listItem.parentNode.nextSibling);
            }
        }
    });
}

/**
 *
 * @param {HTMLElement} item - the button to initialise
 */
function initRemoveItemButton(item) {
    const listItem = item.closest(classes.SHOPPING_LIST_ITEM.dot);
    item.addEventListener('click', () => {
        // Remove the parent, since the list item is contained inside a div wrapper
        const parent = listItem.parentNode;
        if (parent) {
            parent.parentNode?.removeChild(parent);
        }
        dispatchGlobalChangeEvent();
    })
}

/**
 * Clears all child elements of the provided menu root element unless they have a
 * `data-keep` attribute.
 *
 * @param {HTMLElement} menuRoot - The root element of the menu whose children are to be processed.
 * @return {void} This function does not return a value.
 */
function clearList(menuRoot) {
    [...menuRoot.children].forEach(child => {
        if (!child.dataset.keep) {
            child.remove();
        }
    });
}

/**
 * Dispatches a custom 'change' event on the global shopping list root element
 * to notify listeners of changes in the shopping list UI.
 *
 * @return {void} Does not return any value.
 */
function dispatchGlobalChangeEvent() {
    document.getElementById(ids.SHOPPING_LIST_ROOT_ELEMENT_ID).dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true
    }));
}

/**
 * Shows or hides the shopping list UI.
 * @param show {boolean} Whether to show or hide the UI.
 */
function showListUI(show) {
    const shoppingListRootElement = document.getElementById(
        ids.SHOPPING_LIST_ROOT_ELEMENT_ID);
    shoppingListRootElement.style.display = show ? 'initial' : 'none';
}

export { createListItem, createShoppingListItem, clearList, showListUI, setNameOfActiveListInUI };
