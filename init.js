// Will run at page load

import {initTheme, toggleTheme} from "./theme.js";

$("document").ready(function() {
    initTheme();

    /* Init the topbar */
    $("#btn_theme").on("click", function () {
        toggleTheme();
    });
});