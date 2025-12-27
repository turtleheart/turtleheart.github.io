import {classes, ids} from "./names.js";
import {
    moveShoppingListItemInActiveList,
    removeShoppingList,
    removeShoppingListItemFromActiveList, setActiveItemAtIndex, setActiveList
} from "./stateManager.js";

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

/**
 * Initialises a select list item by attaching a click event listener.
 * When the item is clicked, it sets the item as active based on its index.
 *
 * @param {HTMLElement} item - The list item element to be initialised.
 * @return {void}
 */
function initSelectListItem(item) {
    const idx = Number(item.dataset.idx);
    // If we click the item, set it as active
    item.addEventListener('click', () => {
        setActiveList(Number(idx));
    });
}

/**
 * Initialises the remove list button with a click event listener to remove a shopping list item.
 *
 * @param {HTMLElement} deleteButton - The button element used to remove the corresponding shopping list item.
 * @return {void} This function does not return a value.
 */
function initRemoveListButton(deleteButton) {
    const listItem = deleteButton.closest(classes.SELECTION_LIST_ITEM.dot);
    const idx = listItem.dataset.idx;
    deleteButton.addEventListener('click', (event) => {
        removeShoppingList(Number(idx));
        event.stopPropagation();
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
    // Create the shopping list item container
    const itemContainer = document.createElement('div');
    itemContainer.className = classes.SHOPPING_LIST_ITEM.raw +
        ' col-sm-6 col-md-4 d-flex align-items-center justify-content-between border p-2 mb-2';
    itemContainer.dataset.idx = String(idx);

    // Create the left section container
    const leftSection = document.createElement('div');
    leftSection.className = 'd-flex align-items-center col';

    // Create checkbox wrapper
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = classes.SHOPPING_LIST_ITEM_CHECKED.raw + ' form-check me-2';
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
    quantityInput.className = classes.SHOPPING_LIST_ITEM_QUANTITY.raw + ' form-control form-control-sm';
    quantityInput.setAttribute('aria-label', 'quantity');
    quantityInput.style.width = '70px';
    quantityInput.value = String(item.quantity || 1);
    quantityInput.min = "1";
    quantityInput.name = 'quantity';

    // Create item name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = classes.SHOPPING_LIST_ITEM_NAME.raw + ' form-control form-control-sm mx-2';
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

    // Initialise logic for the item
    initDraggableItem(dragHandle);
    initRemoveItemButton(deleteButton);
    initShoppingListItem(itemContainer);

    return itemContainer;
}

/**
 * Initialises a shopping list item, sets up an event listener for its changes,
 * and updates the active item at the specified index.
 *
 * @param {HTMLElement} item The DOM element representing the shopping list item to initialise.
 * @return {void}
 */
function initShoppingListItem(item) {
    const idx = Number(item.dataset.idx);
    item.addEventListener('change', () => {
        /** @type {ShoppingListItem} */
        const thisItem = {
            name: item.querySelector(classes.SHOPPING_LIST_ITEM_NAME.dot).value,
            quantity: item.querySelector(classes.SHOPPING_LIST_ITEM_QUANTITY.dot).value,
            checked: item.querySelector(classes.SHOPPING_LIST_ITEM_CHECKED.dot + " input").checked
        };
        setActiveItemAtIndex(idx, thisItem);
    });
}

/** @type {HTMLElement} */
let draggedItem = null;
/** @type {number} */
let draggedIdx = -1;
/** @type {number} */
let targetIdx = -1;
/** @type {ChildNode} */
let originalNextSibling = null;


/**
 * Initialise drag logic for a shopping list HTML item.
 *
 * @param {HTMLElement} item - the drag handle to initialise
 */
function initDraggableItem(item) {
    const listItem = item.closest(classes.SHOPPING_LIST_ITEM.dot);

    // Touch event variables for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let dragElement = null;


    // When drag starts (desktop)
    listItem.addEventListener('dragstart', (e) => {
        draggedItem = listItem;
        draggedIdx = Number(listItem.dataset.idx);
        originalNextSibling = listItem.nextSibling;
        e.dataTransfer.effectAllowed = 'move';
        // Add a class to style the dragged item
        listItem.classList.add('dragging');
    });

    // When drag ends (desktop)
    listItem.addEventListener('dragend', () => {
        // Only update the data model if the item was actually moved to a new position
        const currentNextSibling = draggedItem.nextSibling;
        const currentPrevSibling = draggedItem.previousSibling;
        const didPositionChange = (
            originalNextSibling !== currentNextSibling ||
            (originalNextSibling === null && currentPrevSibling !== null)
        );

        if (didPositionChange && targetIdx !== -1 && targetIdx !== draggedIdx) {
            moveShoppingListItemInActiveList(Number(draggedIdx), Number(targetIdx));
        }

        draggedItem = null;
        draggedIdx = -1;
        targetIdx = -1;
        originalNextSibling = null;
        listItem.classList.remove('dragging');
    });

    // When dragging over another item (desktop)
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
                listItem.parentNode.insertBefore(draggedItem, listItem);
            } else {
                listItem.parentNode.insertBefore(draggedItem, listItem.nextSibling);
            }
            targetIdx = Number(listItem.dataset.idx);
        }
    });

    // When drag starts (mobile)
    item.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isDragging = false; // Ensure false at the start of a touch

        e.preventDefault();
    }, {passive: false});

    // When dragging over another item (mobile)
    item.addEventListener('touchmove', (e) => {
        if (!isDragging) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);

            // Start dragging if moved enough
            if (deltaX > 10 || deltaY > 10) {
                isDragging = true;
                draggedItem = listItem;
                draggedIdx = Number(listItem.dataset.idx);
                originalNextSibling = listItem.nextSibling;
                listItem.classList.add('dragging');

                // Create a visual drag element
                dragElement = listItem.cloneNode(true);
                dragElement.style.position = 'fixed';
                dragElement.style.zIndex = '1000';
                dragElement.style.pointerEvents = 'none';
                dragElement.style.opacity = '0.8';
                dragElement.style.transform = 'rotate(5deg)';
                document.body.appendChild(dragElement);
            }
        }

        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];

            // Move the drag element
            if (dragElement) {
                dragElement.style.left = (touch.clientX - 50) + 'px';
                dragElement.style.top = (touch.clientY - 50) + 'px';
            }

            // Find the element below the touch point
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetItem = elementBelow?.closest(classes.SHOPPING_LIST_ITEM.dot);

            // Swap logic - find bounding rectangle, and swap if far enough
            if (targetItem && targetItem !== draggedItem) {
                const rect = targetItem.getBoundingClientRect();
                const isHorizontal = window.innerWidth >= parseFloat(
                    getComputedStyle(document.documentElement).getPropertyValue('--bs-breakpoint-sm'));
                const position = isHorizontal ? (touch.clientX - rect.left) : (touch.clientY - rect.top);
                const threshold = isHorizontal ? rect.width / 2 : rect.height / 2;

                if (position < threshold) {
                    targetItem.parentNode.insertBefore(draggedItem, targetItem);
                } else {
                    targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
                }
                targetIdx = Number(targetItem.dataset.idx);
            }
        }
    }, {passive: false});

    // When drag ends (mobile)
    item.addEventListener('touchend', (e) => {
        if (isDragging) {
            e.preventDefault();

            // Clean up the visual drag element
            if (dragElement) {
                document.body.removeChild(dragElement);
                dragElement = null;
            }

            // Same logic as dragend for desktop
            const currentNextSibling = draggedItem.nextSibling;
            const currentPrevSibling = draggedItem.previousSibling;
            const didPositionChange = (
                originalNextSibling !== currentNextSibling ||
                (originalNextSibling === null && currentPrevSibling !== null)
            );

            if (didPositionChange && targetIdx !== -1 && targetIdx !== draggedIdx) {
                moveShoppingListItemInActiveList(Number(draggedIdx), Number(targetIdx));
            }

            // Reset state
            draggedItem = null;
            draggedIdx = -1;
            targetIdx = -1;
            originalNextSibling = null;
            listItem.classList.remove('dragging');
            isDragging = false;
        }
    })
}

/**
 * Initialises the remove item button for a shopping list item.
 *
 * @param {HTMLElement} item - The button element representing the remove action for a shopping list item.
 * @return {void} This method does not return a value.
 */
function initRemoveItemButton(item) {
    const listItem = item.closest(classes.SHOPPING_LIST_ITEM.dot);
    const itemIdx = listItem.dataset.idx;
    item.addEventListener('click', () => {
        removeShoppingListItemFromActiveList(Number(itemIdx));
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

export { createListItem, createShoppingListItem, clearList, showListUI };
