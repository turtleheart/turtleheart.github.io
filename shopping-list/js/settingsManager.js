import {getSettings, updateSettings} from "./settings.js";
import {classes} from "./names.js";

/**
 * Update the application and UI to the passed settings.
 * @param {Settings} settings The settings to apply
 */
function applySettings(settings){
    applyTheme(settings.theme);
}

/**
 * Applies the passed theme to the application.
 * @param {Theme} theme
 */
function applyTheme(theme){
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.querySelector(classes.SETTINGS_THEME_CARD.dot + '[data-bs-theme="' + theme + '"] '
        + classes.SETTINGS_THEME_CARD_RADIO.dot).checked = true;
}

/**
 * Set the current theme of the application.
 * @param theme the theme to set to
 */
function setTheme(theme){
    const settings = getSettings();
    settings.theme = theme;
    updateSettings(settings);
}

export { applySettings, setTheme }