/*
Set or Get ViewBox
Param: DOM, int, int, int, int
*/

function ViewBox(Dom, x, y, w, h){
    var viewbox = $(Dom).prop("viewBox");
    var val = viewbox.baseVal;
    if (typeof(x) == "undefined"){
        return val;
    }
    else{
        viewbox.baseVal.x = x;
        viewbox.baseVal.y = y;
        viewbox.baseVal.width = w;
        viewbox.baseVal.height = h;
        $(Dom).prop("viewBox", viewbox);
        if (Args.thumb)
            ModifyViewRect(x, y, w, h);
    }
}

function InitViewBox(Dom){
    var svg = $(Dom)[0];
    if ($(svg).attr("part") == "false")
        InitViewBox(svg);
    ViewBox(svg, 0, 0, parseInt($(svg).width()), parseInt($(svg).height()));
}

/*
Move SVG
Param: DOM, int, int, Bool
*/

function Move(Dom, deltaX, deltaY, scale){
    var viewbox = ViewBox(Dom);
    
    var X = viewbox.x + deltaX;
    var Y = viewbox.y + deltaY;
    var maxW = $(Dom).attr("maxw");
    var maxH = $(Dom).attr("maxh");
    
    if (X < 0)
        X = 0;
    if (Y < 0)
        Y = 0;
    if (X + viewbox.width > maxW)
        X = maxW - viewbox.width;
    if (Y + viewbox.height > maxH)
        Y = maxH - viewbox.height;
    ViewBox(Dom, X, Y, viewbox.width, viewbox.height);
}

/*
Zoom SVG
Param: DOM, double, int, int
*/
function Zoom(Dom, rate, centerX, centerY){
    var viewbox = ViewBox(Dom);
    var viewW = $(Dom).width();
    var viewH = $(Dom).height();
    var width = viewbox.width + viewW * rate;
    var height = viewbox.height + viewH * rate;
    
    centerX = viewbox.x + viewbox.width / 2;
    centerY = viewbox.y + viewbox.height / 2;
    
    var aspect = width / height;
    
    if (width * Args.zoom.minscale > viewW){
        width = viewW / Args.zoom.minscale;
        height = width / aspect;
    }
    if (height * Args.zoom.minscale > viewH){
        height = viewH / Args.zoom.minscale;
        width = height * aspect;
    }
    if (width * Args.zoom.maxscale < viewW){
        width = viewW / Args.zoom.maxscale;
        height = width / aspect;
    }
    if (height * Args.zoom.maxscale < viewH){
        height = viewH / Args.zoom.maxscale;
        width = height * aspect;
    }
    if (centerX == undefined || centerY == undefined){
        ViewBox(Dom, viewbox.x, viewbox.y, width, height);
    }
    else{
        ViewBox(Dom, centerX - width / 2, centerY - height / 2, width, height);
    }
    Move(Dom, 0, 0);
}

function AddMoveListener(Dom){
    $(Dom).on("mousedown", MousedownHandler);
    $(Dom).on("mousemove", MousemoveHandler);
    $(Dom).on("mouseup", MouseupHandler);
    $(Dom).on("mouseleave", MouseleaveHandler);
    
    $(Dom).on("touchstart", TouchstartHandler);
    $(Dom).on("touchmove", TouchmoveHandler);
    $(Dom).on("touchend", TouchendHandler);
}

function DeleteMoveListener(Dom){
    $(Dom).off();
}

/*
Mouse Handler
*/
function MousedownHandler(e){
    e.preventDefault();
    if (e.button == 2)
        return ;
    HideInfoBox();
    if (Args.mode == "select"){
        var result = CoorCorrect(e);
        StartSelect(e.target, result.x, result.y);
        return ;
    }
    StartMove(e.clientX, e.clientY);
}

function MousemoveHandler(e){
    e.preventDefault();
    if (Args.mode == "select"){
        var result = CoorCorrect(e);
        ProcessSelect(e.target, result.x, result.y);
        return ;
    }
    ProcessMove(e.clientX, e.clientY, e.currentTarget);
}

function MouseupHandler(e){
    e.preventDefault();
    if (e.button == 2) //Right click
    {
        SetSeatInfo(e);
        return ;
    }
    HideInfoBox();
    if (Args.mode == "select"){
        var result = CoorCorrect(e);
        EndSelect(e.target, result.x, result.y);
        return ;
    }
    EndMove(e);
}

function MouseleaveHandler(e){
    e.preventDefault();
    if (Args.mode == "select"){
        EndSelect(e.target, e.offsetX, e.offsetY);
        return ;
    }
    EndMove();
}

/*
Touch Handler
*/
function TouchstartHandler(e){
    var touches = e.originalEvent.targetTouches;
    if (touches.length == 1){
        StartMove(touches[0].clientX, touches[0].clientY);
    }
    e.preventDefault();
}

function TouchmoveHandler(e){
    var touches = e.originalEvent.targetTouches;
    if (touches.length == 1){
        ProcessMove(touches[0].clientX, touches[0].clientY, e.currentTarget);
    }
    e.preventDefault();
}

function TouchendHandler(e){
    EndMove(e);
    e.preventDefault();
}

/*
Move Event
*/
function StartMove(x, y){
    if (Args.move.start)
        return ;
    //alert(x + " " + y);
    Args.move.x = x;
    Args.move.y = y;
    Args.move.start = true;
    Args.move.moved = false;
}

function ProcessMove(x, y, Dom){
    if (!Args.move.start)
        return false;
    var deltaX = x - Args.move.x;
    var deltaY = y - Args.move.y;
    
    if (Math.abs(deltaX) + Math.abs(deltaY) < 10)
        return false;
    Move(Dom, -deltaX, -deltaY, true);
    Args.move.x = x;
    Args.move.y = y;
    Args.move.moved = true;
}

function EndMove(e){
    if (!Args.move.start)
        return ;
    Args.move.start = false;
    if (typeof(e) == "undefined")
        return ;
    if (!Args.move.moved && e.target.tagName != "svg"){
        Args.clickHandler(e.target.id);
    }
}

/*
Select Event
*/

function StartSelect(Dom, x, y){
    if (Args.select.start)
        return ;
    //alert(x + " " + y);
    Args.select.x = x;
    Args.select.y = y;
    Args.select.start = true;
    Args.select.moved = false;
    
    var svgns = "http://www.w3.org/2000/svg";
    var rect = document.createElementNS(svgns, "rect");
    
    SetSVGAttr(rect, "stroke", "#888888");
    SetSVGAttr(rect, "stroke-width", 1);
    SetSVGAttr(rect, "stroke-dasharray", "1,1");
    SetSVGAttr(rect, "fill", "none");
    SetSVGAttr(rect, "id", "select_rect");
    if (Dom.tagName != "svg")
        Dom = $(Dom).parent()[0];
    $(Dom).append(rect);
}

function ProcessSelect(Dom, x, y){
    if (!Args.select.start)
        return false;
    var deltaX = x - Args.move.x;
    var deltaY = y - Args.move.y;

    if (Math.abs(deltaX) + Math.abs(deltaY) > 5)
        Args.select.moved = true;
    
    var rect = $("#select_rect")[0];

    SetSVGAttr(rect, "x", Math.min(x, Args.select.x));
    SetSVGAttr(rect, "y", Math.min(y, Args.select.y));
    SetSVGAttr(rect, "width", Math.abs(x - Args.select.x));
    SetSVGAttr(rect, "height", Math.abs (y - Args.select.y));
}

function EndSelect(Dom, x, y){
    if (!Args.select.start)
        return false;
    Args.select.start = false;
    if (!Args.select.moved && Dom.tagName != "svg"){
        Args.clickHandler(Dom.id);
        return false;
    }
    
    while (Dom.tagName != "svg" && Dom.tagName != "div"){
        Dom = $(Dom).parent()[0];
    }
    $("#select_rect").remove();
    if (Args.select.moved){
        var X = Math.min(x, Args.select.x);
        var Y = Math.min(y, Args.select.y);
        var W = Math.abs(x - Args.select.x);
        var H = Math.abs(y - Args.select.y);
        var elements = $(Dom).children();
        for (var i = 0; i < elements.length; ++i){
            var ex = parseInt($(elements[i]).attr("x"));
            var ey = parseInt($(elements[i]).attr("y"));
            var ew = parseInt($(elements[i]).attr("width"));
            var eh = parseInt($(elements[i]).attr("height"));
            if (IsInterSect(X, Y, W, H, ex, ey, ew, eh))
                Args.selectHandler(elements[i].id);
        }
    }
}

function IsInterSect(X, Y, W, H, x, y, w, h){
    var threshold = w * h / 2;
    
    var left = Math.max(X, x);
    var top = Math.max(Y, y);
    var right = Math.min(X + W, x + w);
    var bottom = Math.min(Y + H, y + h);
    
    if (right < left)
        return false;
    if (bottom < top)
        return false;
    
    if ((right -left) * (bottom - top) >= threshold)
        return true;
    return false;
    /*
    if (x >= X && x < X + W && y >= Y && y < Y + H)
        return true;
    return false;
    */
}

/*
viewbox : Object() x y width height
*/

function UpdateThumb(SourceDom, ThumbDom, viewbox){
    var tmp = $(SourceDom).parent().html();
    $(ThumbDom).html(tmp);
    var thumb = $(ThumbDom).children();
    thumb.width("100%");
    thumb.height("100%");
    ViewBox(thumb[0], 0, 0, thumb.attr("maxw"), thumb.attr("maxh"));
    
    /*
    $("#test").empty();
    $("#test").append(tmp);*/
}

function InputTemplate(label, type, id){
    return "<div class='form-group'>" +
           "<label class='col-sm-2 control-label'>" + label +"</label>" +
           "<div class='col-sm-10'>" +
           "<input type='" + type +"' class='form-control' id='" + id + "'/>" +
           "</div>" +
           "</div>";
}

function ShowInfoBox(Dom, left, top){
    if ($(Dom).attr("class") != "seat")
        return ;
    left += 2;
    top += 2;
    Args.infoitem = Dom;
    $(Args.infoitem).css("opacity", "0.5");
    
    var info = $("<form id='infobox' class='form-horizontal'>" +
                 InputTemplate("名称", "text", "seat_name") +
                 InputTemplate("容量", "number", "seat_capacity") +
                 "<input type='button' value='确定' id='seat_confirm'/>" + 
                 "</form>");
                 
    var name = info.find("#seat_name");
    name.attr("maxlength", "10");
    name.attr("value", Dom.id);
    
    var capacity = info.find("#seat_capacity");
    if ($(Dom).attr("cap") != undefined)
        capacity.attr("value", $(Dom).attr("cap"));
    else
        capacity.attr("value", "1");
    capacity.attr("min", "1");

    info.css("position", "absolute");
    info.css("left", left);
    info.css("top", top);
    info.css("z-index", 999);
    
    info.css("background-color", "white");
    
    info.find("#seat_confirm").click(function(e){
        $(Dom)[0].id = name[0].value;
        $(Dom).attr("cap", capacity[0].value);
        HideInfoBox();
        Args.infoChangedHandler($(Dom)[0].id);
    });
    
    $("body").append(info);
}

function HideInfoBox(){
    $("#infobox").remove();
    if (typeof(Args.infoitem) == "object"){
        $(Args.infoitem).css("opacity", "1");
        Args.infoitem = 0;
    }
}

function SetSeatInfo(e){
    var Dom = e.target;
    
    Args.infobox = Dom;
    HideInfoBox();
    ShowInfoBox(Dom, e.pageX, e.pageY);
}

function CountSeatsNumber(Dom){
    var seats = $(Dom).find(".seat");
    var result = 0;
    for (var i = 0; i < seats.length; ++i){
        if ($(seats[i]).attr("cap") != undefined)
            result += parseInt($(seats[i]).attr("cap"));
        else
            result++;
    }
    return result;
}

function GetSeatsInfo(Dom){
    var seats = $(Dom).find(".seat");
    var result = Array();
    for (var i = 0; i < seats.length; ++i){
        result[i] = Object();
        result[i].location = $(seats[i])[0].id;
        if ($(seats[i]).attr("cap") != undefined)
            result[i].capability = parseInt($(seats[i]).attr("cap"));
        else
            result[i].capability = 1;
    }
    return result;
}

function CoorCorrect(e){
    var Dom = e.target;
    while (Dom.tagName != "svg" && Dom.tagName != "div"){
        Dom = $(Dom).parent()[0];
    }
    var width = $(Dom).width();
    var height = $(Dom).height();
    var maxW = parseInt($(Dom).attr("maxw"));
    var maxH = parseInt($(Dom).attr("maxh"));
    var scale = Math.min(width / maxW, height / maxH);
    
    var w = maxW * scale;
    var h = maxH * scale;
    var x = e.offsetX;
    var y = e.offsetY;
    
    var result = Object();
    result.x = (x - (width - w) / 2) / scale;
    result.y = (y - (height - h) / 2) / scale;
    return result;
}

$(document).ready(function(){
    //Init
    Args = Object();
    Args.move = Object();
    Args.move.start = false;
    Args.move.moved = false;
    Args.move.x = 0;
    Args.move.y = 0;
    Args.zoom = Object();
    Args.zoom.minscale = 1;
    Args.zoom.maxscale = 1;
    Args.thumb = false;
    Args.mode = "drag";
    
    Args.select = Object();
    Args.select.start = false;
    Args.select.moved = false;
    Args.select.x = 0;
    Args.select.y = 0;
    
    
    Args.timeout = 0;
});
