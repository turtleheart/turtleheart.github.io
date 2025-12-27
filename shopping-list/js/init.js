import {getState, subscribe} from "./state.js";
import {getSettings, subscribe as subscribeSettings} from "./settings.js";
import {addShoppingList, addShoppingListItem, renameActiveList, renderUI} from "./stateManager.js";
import {classes, ids} from "./names.js";
import {DEFAULT_SHOPPING_LIST, DEFAULT_SHOPPING_LIST_ITEM} from "./defaults.js";
import {applySettings, setTheme} from "./settingsManager.js";

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
     * @param {string} [type='success'] - The type of the message (e.g., 'success', 'danger', 'warning').
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
            const jsonString = JSON.stringify(state.shoppingLists[state.activeList]);

            // If we include qrcode_UTF8.js, ensure UTF-8 encoding is used:
            if (window.qrcode?.stringToBytesFuncs?.["UTF-8"]) {
                qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
            }

            const qr = qrcode(0, "M"); // Maybe should be L?
            qr.addData(jsonString, "Byte");
            qr.make();

            document.getElementById(ids.EXPORT_LIST_QR_CODE_CONTAINER).innerHTML = `
            <div class="bg-light border rounded p-3" style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                ${qr.createSvgTag({cellSize: 4, margin: 2, scalable: true})}
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
            const jsonString = JSON.stringify(state.shoppingLists[state.activeList]);
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

    /**
     * Initialises the "Copy to Clipboard" button click functionality. When the button is clicked,
     * it retrieves the current state of the active shopping list, converts it to a JSON string,
     * and copies it to the clipboard. Displays a success status upon completion.
     *
     * @param {HTMLElement} copyToClipboardButton - The HTML button element to be initialised for copying to clipboard functionality.
     * @return {void} This function does not return a value.
     */
    function initCopyToClipboardButton(copyToClipboardButton) {
        copyToClipboardButton.addEventListener('click', () => {
            const state = getState();
            const jsonString = JSON.stringify(state.shoppingLists[state.activeList]);
            navigator.clipboard.writeText(jsonString).then(r =>
                showExportListStatus('Copied to clipboard', 'success')
            );
        })
    }

    function initImportListModal() {
        initReadQRCodeButton(document.getElementById(ids.IMPORT_LIST_READ_QR_CODE_BTN));
        initUploadJSONButton(document.getElementById(ids.IMPORT_LIST_UPLOAD_JSON_BTN));
        initReadFromClipboardButton(document.getElementById(ids.IMPORT_LIST_READ_CLIPBOARD_BTN));
    }

    /**
     * Displays the import list status message to the user.
     *
     * @param {string} message - The message to be displayed.
     * @param {string} [type='success'] - The type of the message (e.g., 'success', 'danger', 'warning').
     * @return {void} - The function returns nothing.
     */
    function showImportListStatus(message, type = 'success') {
        const statusMessageElement = document.getElementById(ids.IMPORT_LIST_STATUS_MESSAGE);
        statusMessageElement.className = `alert alert-${type}`;
        statusMessageElement.textContent = message;
        statusMessageElement.classList.remove('d-none');

        // Remove the status message after a timeout
        setTimeout(() => {
            statusMessageElement.classList.add('d-none');
        }, 3000);
    }

    /**
     * Validates a JSON as a shopping list.
     * The validation is relatively loose.
     *
     * @param json
     * @return {ShoppingList}
     */
    function validateJsonAsList(json) {
        if (!json
            || typeof json !== 'object'
            || !json.name
            || !json.items
            || !Array.isArray(json.items)){
            throw new Error('Invalid JSON data');
        }
        return json;
    }

    /**
     * Scans a QR code from the video feed of the provided video element.
     *
     * @param {HTMLVideoElement} videoElement - The video HTML element used to display the camera feed for QR code scanning.
     * @return {Promise<string>} - A promise that resolves with the decoded text from the scanned QR code.
     */
    async function scanQrCode(videoElement) {
        const codeReader = new ZXingBrowser.BrowserQRCodeReader();

        const devices = await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();

        if (devices.length === 0) {
            throw new Error('No camera devices found');
        }

        const deviceId = devices[0].deviceId;
        const result = await codeReader.decodeOnceFromVideoDevice(deviceId, videoElement);

        return result.getText();
    }

    /**
     * Initialises the Read QR Code button and sets up an event listener to handle QR code scanning.
     * When the button is clicked, it displays a modal for scanning a QR code, parses the QR code result,
     * and updates the application state by adding a new shopping list.
     *
     * @param {HTMLElement} readQRCodeButton The button element that triggers the QR code scanning process when clicked.
     * @return {void} Does not return a value.
     */
    function initReadQRCodeButton(readQRCodeButton) {
        const qrCodeModal = document.getElementById(ids.IMPORT_LIST_QR_CODE_SECTION);
        const qrVideo = document.getElementById(ids.IMPORT_LIST_QR_CODE_VIDEO);
        readQRCodeButton.addEventListener('click', () => {
            qrCodeModal.classList.remove('d-none');
            scanQrCode(qrVideo).then(result => {
                try {
                    const parsedList = JSON.parse(result);
                    const validList = validateJsonAsList(parsedList);
                    addShoppingList(validList);

                    showImportListStatus('Successfully imported list', 'success');
                } finally {
                    qrCodeModal.classList.add('d-none');
                }
            }).catch(error => {
                console.error("QR code scanning failed:", error);
                showImportListStatus('Failed to scan QR code', 'danger');
                qrCodeModal.classList.add('d-none');
            });
        });

        // Clean-up when hiding the modal
        document.getElementById(ids.IMPORT_LIST_MODAL).addEventListener('hidden.bs.modal', () => {
            qrCodeModal.classList.add('d-none');
            // Clean-up QR reader
            const videoElement = document.getElementById(ids.IMPORT_LIST_QR_CODE_VIDEO);
            if (videoElement.srcObject) {
                const stream = videoElement.srcObject;
                stream?.getTracks()?.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        });
    }

    function initUploadJSONButton(uploadJSONButton) {
        const fileInput = document.getElementById(ids.IMPORT_LIST_UPLOAD_JSON_FILE_INPUT);
        uploadJSONButton.addEventListener('click', () => {
            fileInput.value = '';
            fileInput.click();
        });

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) {
                return;
            }

            try {
                const text = await file.text();
                const data = JSON.parse(text);
                const validList = validateJsonAsList(data);
                addShoppingList(validList);
            } catch (error) {
                console.error("Failed to parse uploaded JSON:", error);
                showImportListStatus('Failed to parse uploaded JSON', 'danger');
            }
        })
    }

    /**
     * Initialises the functionality of a button to read and import a shopping list from the clipboard.
     *
     * @param {HTMLElement} readFromClipboardButton - The button element that triggers the clipboard reading process.
     * @return {void} This function does not return a value.
     */
    function initReadFromClipboardButton(readFromClipboardButton) {
        readFromClipboardButton.addEventListener('click', () => {
            navigator.clipboard.readText().then(clipboardText => {
                const parsedList = JSON.parse(clipboardText);
                const validList = validateJsonAsList(parsedList);
                addShoppingList(validList);

                showImportListStatus('Successfully imported list', 'success');
            }).catch(error => {
                console.error("Clipboard parsing failed:", error);
                showImportListStatus('Failed to parse list from clipboard', 'danger');
            });
        });
    }

    // Initialise buttons
    initAddListButton();
    initAddItemButton();
    initRenameListButton();
    initExportListModal();
    initImportListModal();

    // Render the UI from the stored state when the page loads
    renderUI(getState());

    // Bind settings cards to their theme
    document.querySelectorAll(classes.SETTINGS_THEME_CARD.dot).forEach(card => {
        card.addEventListener('click', event => {
            const theme = card.querySelector(classes.SETTINGS_THEME_CARD_RADIO.dot).value;
            setTheme(theme);
        });
    });

    // Restore stored settings
    applySettings(getSettings());

    // Make UI update when state is saved
    subscribe((state) => {
        renderUI(state);
    });

    // Make the application update when settings are saved
    subscribeSettings((settings) => {
        applySettings(settings);
    });
});
