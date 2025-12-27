import {DEFAULT_SETTINGS} from "./defaults.js";

/** @type {string} */
const SETTINGS_KEY = 'shopping-list-settings';
/** @type {Function[]} */
const listeners = [];
/** @type {Settings} */
let Settings = loadSettings();

/**
 * Load application settings from local storage.
 * @return {Settings} The settings loaded from local storage, or default settings if none were found.
 */
function loadSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || DEFAULT_SETTINGS();
    } catch (error) {
        console.error('Failed to parse stored settings:', error);
        return DEFAULT_SETTINGS();
    }
}

/**
 * Save the application settings to local storage.
 * @param settings {Settings} The settings to save.
 */
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
    listeners.forEach(listener => listener(settings));
}

/**
 * Get the current settings.
 * @return {Settings} The settings.
 */
function getSettings() {
    return Settings;
}

/**
 * Update the current settings.
 * @param newSettings The new settings.
 */
function updateSettings(newSettings) {
    Settings = newSettings;
    saveSettings(newSettings);
}

/**
 * Subscribe to setting updates.
 * @param listener {Function} The function to call when settings are updated.
 */
function subscribe(listener) {
    listeners.push(listener);
}

export {getSettings, subscribe, updateSettings};