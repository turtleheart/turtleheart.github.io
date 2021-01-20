function themeswap(){
    let theme = document.getElementById("theme_link");
    if (theme.getAttribute("href") == "stylesheet_light.css") {
        theme.href = "stylesheet_dark.css";
    } else {
        theme.href = "stylesheet_light.css";
    }
    let btn = document.getElementById("btn_theme");
    console.log(btn.textContent);
    if (btn.textContent == "Dark Mode"){
        btn.textContent = "Light Mode";
    } else {
        btn.textContent = "Dark Mode";
    }
}
