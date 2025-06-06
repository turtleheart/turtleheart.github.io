import {getState, subscribe} from "./state.js";
import {addShoppingList, addShoppingListItem, listenForChanges, renderUI} from "./stateManager.js";
import {classes, ids} from "./names.js";
import {DEFAULT_SHOPPING_LIST, DEFAULT_SHOPPING_LIST_ITEM} from "./defaults.js";

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Initialise the Add list button.
     */
    function initAddListButton() {
        const btn = document.getElementById(ids.ADD_LIST_BTN);
        btn.onclick = () => {
            addShoppingList(DEFAULT_SHOPPING_LIST());
        }
    }

    /**
     * Initialise the Add item button.
     */
    function initAddItemButton() {
        const btn = document.getElementById(ids.ADD_ITEM_TO_LIST_BTN);
        btn.onclick = () => {
            addShoppingListItem(getState().activeList, DEFAULT_SHOPPING_LIST_ITEM())
        }
    }

    /**
     * Initialise the button to rename the active list.
     */
    function initRenameListButton() {
        const listNameContainer = document.getElementById(ids.LIST_NAME_CONTAINER);
        const nameText = listNameContainer.querySelector(classes.LIST_NAME_TEXT.dot);
        const nameInput = document.getElementById(ids.LIST_NAME_INPUT);
        const editButton = listNameContainer.querySelector(classes.LIST_NAME_EDIT_BTN.dot);

        editButton.addEventListener('click', () => {
            nameText.classList.add('d-none');
            nameInput.classList.remove('d-none');
            nameInput.focus();
            nameInput.select();
        });

        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim()) {
                // TODO: change the list's name via stateManager instead of directly?
                nameText.textContent = nameInput.value;
            }
            nameText.classList.remove('d-none');
            nameInput.classList.add('d-none');
        });

        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                nameInput.blur();
            }
        });

    }

    // Initialise buttons
    initAddListButton();
    initAddItemButton();
    initRenameListButton()

    // Render the UI from the stored state when the page loads
    renderUI(getState());

    // Make UI update when state is saved
    subscribe((state) => {
        renderUI(state);
    });

    // Update the state when we make changes
    listenForChanges(document.getElementById(ids.MAIN_CONTAINER_ID));
});
