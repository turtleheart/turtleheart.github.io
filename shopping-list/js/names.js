/** @type {Record<string, string>} */
const ids = {
    ADD_ITEM_TO_LIST_BTN: "add-item-btn",
    ADD_LIST_BTN: "add-lists-btn",
    EXPORT_LIST_BTN: "list-export-btn",
    EXPORT_LIST_MODAL: "modal-export-list",
    EXPORT_LIST_MODAL_CLIPBOARD_BTN: "modal-export-list-btn-clipboard",
    EXPORT_LIST_DOWNLOAD_JSON_BTN: "modal-export-list-btn-json",
    EXPORT_LIST_QR_CODE_SECTION: "modal-export-list-qr-code",
    EXPORT_LIST_QR_CODE_CONTAINER: "modal-export-list-qr-code-container",
    EXPORT_LIST_SHOW_QR_CODE_BTN: "modal-export-list-btn-qr",
    EXPORT_LIST_STATUS_MESSAGE: "modal-export-list-status",
    LIST_NAME_CONTAINER: "list-name",
    LIST_NAME_INPUT: "list-name-input",
    LIST_NAME_TEXT: "list-name-text",
    MAIN_CONTAINER_ID: "main-content",
    SHOPPING_LIST_MENU_GROUP_ID: "shopping-lists-menu-group",
    SHOPPING_LIST_ID: "shopping-list",
    SHOPPING_LIST_ROOT_ELEMENT_ID: "listsContent",
}

/** @type {Record<string, CSSClass>} */
const classes = {
    LIST_NAME_TEXT: {
        raw: "list-name-text",
        dot: ".list-name-text",
    },
    LIST_NAME_EDIT_BTN: {
        raw: "list-name-edit-btn",
        dot: ".list-name-edit-btn",
    },
    SELECTION_LIST_ITEM: {
        raw: "selection-list-item",
        dot: ".selection-list-item"
    },
    SELECTION_LIST_ITEM_DELETE_BTN: {
        raw: "selection-list-item-delete",
        dot: ".selection-list-item-delete"
    },
    SELECTION_LIST_ITEM_NAME: {
        raw: "selection-list-item-name",
        dot: ".selection-list-item-name"
    },
    SHOPPING_LIST_ITEM: {
        raw: "shopping-list-item",
        dot: ".shopping-list-item",
    },
    SHOPPING_LIST_ITEM_CHECKED: {
        raw: "shopping-list-item-checked",
        dot: ".shopping-list-item-checked"
    },
    SHOPPING_LIST_ITEM_NAME: {
        raw: "shopping-list-item-name",
        dot: ".shopping-list-item-name"
    },
    SHOPPING_LIST_ITEM_QUANTITY: {
        raw: "shopping-list-item-quantity",
        dot: ".shopping-list-item-quantity"
    }
}

export { ids, classes };
