function themeswap(){
    let theme = document.getElementById("theme_link");
    if (theme.getAttribute("href") === "stylesheet_light.css") {
        theme.href = "stylesheet_dark.css";
    } else {
        theme.href = "stylesheet_light.css";
    }
    let btn = document.getElementById("btn_theme");
    if (btn.textContent === "Dark Mode"){
        btn.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        btn.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
}
