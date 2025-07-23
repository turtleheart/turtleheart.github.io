import {getState, subscribe} from "./state.js";
import {addShoppingList, addShoppingListItem, renameActiveList, renderUI} from "./stateManager.js";
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
                renameActiveList(nameInput.value);
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

    function initExportListModal() {
        initShowQRCodeButton(document.getElementById(ids.EXPORT_LIST_SHOW_QR_CODE_BTN));
        initDownloadJSONButton(document.getElementById(ids.EXPORT_LIST_DOWNLOAD_JSON_BTN));
        initCopyToClipboardButton(document.getElementById(ids.EXPORT_LIST_MODAL_CLIPBOARD_BTN));
    }

    /**
     * Displays the export list status message to the user.
     *
     * @param {string} message - The message to be displayed.
     * @param {string} [type='success'] - The type of the message (e.g., 'success', 'error', 'warning').
     * @return {void} - The function returns nothing.
     */
    function showExportListStatus(message, type = 'success') {
        const statusMessageElement = document.getElementById(ids.EXPORT_LIST_STATUS_MESSAGE);
        statusMessageElement.className = `alert alert-${type}`;
        statusMessageElement.textContent = message;
        statusMessageElement.classList.remove('d-none');

        // Remove the status message after a timeout
        setTimeout(() => {
            statusMessageElement.classList.add('d-none');
        }, 3000);
    }

    /**
     * Initialises the behaviour for the QR Code button. When the button is clicked, this method generates
     * a placeholder QR code display and shows a modal containing the QR code. The QR code modal is hidden
     * when the associated modal is closed.
     *
     * @param {HTMLElement} showQRCodeButton - The button element that triggers the QR Code functionality when clicked.
     * @return {void} This method does not return a value.
     */
    function initShowQRCodeButton(showQRCodeButton) {
        showQRCodeButton.addEventListener('click', () => {
            const state = getState();
            const jsonString = JSON.stringify(state);
            // TODO: Placeholder, for now:
            document.getElementById(ids.EXPORT_LIST_QR_CODE_CONTAINER).innerHTML = `
            <div class="bg-light border rounded p-3" style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <i class="bi bi-qr-code" style="font-size: 100px;"></i>
                <small class="mt-2">QR Code</small>
            </div>
        `;

            const qrCodeModal = document.getElementById(ids.EXPORT_LIST_QR_CODE_SECTION);
            qrCodeModal.classList.remove('d-none');

            // Re-hide the qr-code when the modal is closed
            document.getElementById(ids.EXPORT_LIST_MODAL).addEventListener('hidden.bs.modal', () => {
                qrCodeModal.classList.add('d-none');
            })
        });
    }

    /**
     * Initialises the download JSON button to allow users to export the current application state
     * as a JSON file when the button is clicked.
     *
     * @param {HTMLElement} downloadJSONButton The button element that triggers the JSON file download process.
     * @return {void} This function does not return a value.
     */
    function initDownloadJSONButton(downloadJSONButton) {
        downloadJSONButton.addEventListener('click', () => {
            const state = getState();
            const jsonString = JSON.stringify(state);
            const blob = new Blob([jsonString], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${state.shoppingLists[state.activeList].name.toLowerCase()
                .replaceAll(" ", "_")}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    function initCopyToClipboardButton(copyToClipboardButton) {
        copyToClipboardButton.addEventListener('click', () => {
            const state = getState();
            const jsonString = JSON.stringify(state);
            navigator.clipboard.writeText(jsonString).then(r =>
                showExportListStatus('Copied to clipboard', 'success')
            );
        })
    }

    // Initialise buttons
    initAddListButton();
    initAddItemButton();
    initRenameListButton();
    initExportListModal();

    // Render the UI from the stored state when the page loads
    renderUI(getState());

    // Make UI update when state is saved
    subscribe((state) => {
        renderUI(state);
    });
});
