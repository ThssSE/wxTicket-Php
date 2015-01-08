function ShowHintBox(message) {
    if (typeof(message) != "string") {
        message = "请稍候...";
    }
    var overlay = $("<div id='overlay'></div>");
    overlay.css("z-index", 99);
    overlay.css("background-color", "rgba(255, 255, 255, 0.75)");
    overlay.css("position", "fixed");
    overlay.css("left", 0);
    overlay.css("right", 0);
    overlay.css("top", 0);
    overlay.css("bottom", 0);
    $("body").append(overlay);
    var box = $("<div id='hintbox'></div>");
    box.css("height", "auto");
    box.css("width", "auto");
    box.css("min-height", "50px");
    box.css("min-width", "200px");
    box.css("background-color", "white");
    box.css("position", "absolute");
    //Border
    box.css("border-radius", "3px");
    box.css("box-shadow", "0 4px 23px 5px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0,0,0,0.15)");
    //Padding
    box.css("padding", "10px");
    box.html(message);
    $(overlay).append(box);
    box.css("left", ($(window).width() - box.width()) / 2);
    box.css("top", ($(window).height() - box.height()) / 2);
    box.css("line-height", box.height() + "px");
}

function HideHintBox(message, time, redirect) {
    if (typeof(message) != "string") {
        message = "操作成功";
    }
    if (typeof(time) != "number") {
        time = 5;
    }
    var type = "close";
    if (typeof(redirect) != "string") {
        message += "," + time + "秒后自动返回...";
    } else {
        message += "," + time + "秒后自动跳转...";
        type = "redirect";
    }
    $("#hintbox").html(message);
    if (type == "close") {
        setTimeout(function() {
                $("#overlay").remove();
            },
            time * 1000);
    } else {
        setTimeout(function() {
                $("#overlay").remove();
                window.location.href = redirect;
            },
            time * 1000);
    }
}
