/*
 * Swaps between light and dark themes
 */

import {dictTheme} from "./dictonary/dict_eng.js";

/*
 * Toggles the theme between dark/light
 */
export function toggleTheme(){

    const oldTheme = getTheme();
    /* If dark theme */
    if(oldTheme.localeCompare("dark") === 0) {
        setTheme("light");
    }
    // Also covers the case if something was wrong with localStorage, or first visit
    else {
        setTheme("dark");
    }
}

/*
 * Returns the code of the current theme
 */
export function getTheme(){
    return localStorage.getItem("theme");
}

/*
 * Sets the theme using the passed code
 */
export function setTheme(newTheme){
    /* Components which to change depending on theme */
    const theme = document.getElementById("theme_link");
    const btn = document.getElementById("btn_theme");

    theme.href = dictTheme[newTheme]["stylesheet"];
    btn.textContent = dictTheme[newTheme]["btn"];

    localStorage.setItem("theme", newTheme); // Update localstorage

    return 1;
}
 /*
  * Init/update function for theme
  */
export function initTheme(){
    let theme = getTheme();
    if(theme === null){
        setTheme("dark");
    }
    else{
        setTheme(theme);
    }
}