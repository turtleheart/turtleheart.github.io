// Will run at page load

import {initTheme, toggleTheme} from "./theme.js";
import {dictText} from "./dictonary/dict_text.js";
import {dictLinks} from "./dictonary/dict_links.js";

$("document").ready(function() {
    initTheme();

    /* Init the topbar */
    $("#btn_theme").on("click", function () {
        toggleTheme();
    });

    /* Init text elements */
    $("#dnd-title").html(dictText["EN(UK)"]["dnd-title"]);
    $("#dnd-desc").html(dictText["EN(UK)"]["dnd-desc"]);
    $("#dnd-campaign-title").html(dictText["EN(UK)"]["dnd-campaign-title"]);
    $("#dnd-campaign-desc").html(dictText["EN(UK)"]["dnd-campaign-desc"]);
    $("#dnd-campaign-create-link")
        .html(dictText["EN(UK)"]["dnd-campaign-create-link"])
        .attr("href", dictLinks["EN(UK)"]["dnd-create"]);
    $("#dnd-campaign-create-desc").html(dictText["EN(UK)"]["dnd-campaign-create-desc"]);
    $("#dnd-campaign-downtime-link")
        .html(dictText["EN(UK)"]["dnd-campaign-downtime-link"])
        .attr("href", dictLinks["EN(UK)"]["dnd-downtime"]);
    $("#dnd-campaign-downtime-desc").html(dictText["EN(UK)"]["dnd-campaign-downtime-desc"]);
    $("#dnd-campaign-dungeonExploration-link")
        .html(dictText["EN(UK)"]["dnd-campaign-dungeonExploration-link"])
        .attr("href", dictLinks["EN(UK)"]["dnd-dungeonExploration"]);
    $("#dnd-campaign-dungeonExploration-desc").html(dictText["EN(UK)"]["dnd-campaign-dungeonExploration-desc"]);
    $("#aros-title").html(dictText["EN(UK)"]["aros-title"]);
    $("#aros-desc").html(dictText["EN(UK)"]["aros-desc"]);
    $("#aros-sheet-link1")
        .html(dictText["EN(UK)"]["aros-sheet-link1"])
        .attr("href", dictLinks["EN(UK)"]["aros-sheet1"]);
    $("#aros-sheet-link2")
        .html(dictText["EN(UK)"]["aros-sheet-link2"])
        .attr("href", dictLinks["EN(UK)"]["aros-sheet2"]);
    $("#aros-sheet-desc").html(dictText["EN(UK)"]["aros-sheet-desc"]);
});