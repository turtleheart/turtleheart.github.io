import {DEFAULT_STATE} from "./defaults.js";

/** @type {string} */
const STATE_KEY = 'shopping-list-state';
/** @type {Function[]} */
const listeners = [];
/** @type {State} */
let State = loadState();

/**
 * Load the state of the application from local storage.
 * @returns {State} The state loaded from local storage, or a default state if
 *                      no state was found.
 */
function loadState() {
    try {
        return JSON.parse(localStorage.getItem(STATE_KEY)) || DEFAULT_STATE();
    } catch (error) {
        console.error('Failed to parse stored state:', error);
        return DEFAULT_STATE();
    }
}

/**
 * Save the state of the application to local storage.
 * @param state {State} The state to save.
 */
function saveState(state) {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
    listeners.forEach(listener => listener(state));
}

/**
 * Get the current state of the application.
 * @returns {State} The current state.
 */
function getState() {
    return State;
}

/**
 * Update the state of the application.
 * @param newState {State} The new state.
 */
function updateState(newState) {
    State = newState;
    saveState(newState);
}

/**
 * Subscribe to state updates.
 * @param listener {Function} The function to call when the state is updated.
 */
function subscribe(listener) {
    listeners.push(listener);
}

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

export { debouncedUpdateState, getState, subscribe };
