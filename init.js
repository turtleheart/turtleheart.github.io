// Will run at page load

$("document").ready(function() {
    let t = localStorage.getItem("theme");
    let btn = document.getElementById("btn_theme");
    let theme = document.getElementById("theme_link");
    if (t === null) {
        theme.href = "stylesheet_dark.css";

    } else if (t === "light") {
        theme.href = "stylesheet_light.css";
        btn.textContent = "Dark Mode";
    } else {
        theme.href = "stylesheet_dark.css";
        btn.textContent = "Light Mode";
    }
});