$(document).ready(function(){
    AddMoveListener($("#svg_seat"));
    Args.remain = Array();
    Args.color = Object();
    Args.color.valid = "#88ff88";
    Args.color.invalid = "#bbbbbb";
    Args.color.selected = "#ff8888";
    Args.selected = "";
    
    Args.clickHandler = ClickHandler;
    
    Update("请选择座位后点击确定");
});

function ClickHandler(seatname){
    if (Args.remain[seatname] > 0){
        if (seatname == Args.selected){
            Unselect();
        }
        else{
            Unselect();
            Select(seatname);
        }
    }
}

function Draw(){
    var seats = $(".seat");
    for (var i = 0; i < seats.length; ++i){
        if (Args.remain[seats[i].id] > 0){
            SetSVGAttr(seats[i], "fill", Args.color.valid);
        }
        else{
            SetSVGAttr(seats[i], "fill", Args.color.invalid);
        }
    }
}

function Select(seatname){
    Args.selected = seatname;
    $("#" + Args.selected).css("fill", Args.color.selected);
    $("#selected_seat").text(seatname);
}

function Unselect(){
    $("#" + Args.selected).css("fill", "");
    $("#selected_seat").text("");
    Args.selected = "";
}

function Message(msg){
    $("#message").text(msg);
}

function Update(successMsg){
    Message("正在更新座位信息...");
    $.ajax({
        type: 'POST',
        async: false,
        url: "./mask.php",
        data: {"method":"seatInfo", "activityid":$("#activityid").text()},
        success: function(data){
            var result = JSON.parse(data);
            if (result["state"] == "true"){
                Message(successMsg);
                for (var i in result["message"]){
                    var name = result["message"][i]["location"];
                    var remain = result["message"][i]["resitual_capability"];
                    Args.remain[name] = parseInt(remain);
                }
                Unselect();
                Draw();
                Zoom($('#svg_seat')[0], 1000);
            }
            else{
                Message(result["message"]);
            }
        },
        error: function(data){
            Message("Error");
        }
    });
}

function Confirm(){
    if (Args.selected == ""){
        alert("请选择一个座位");
        return ;
    }
    $("#message").text("正在处理选座请求...");
    $.ajax({
        type: 'POST',
        async: false,
        url: "./mask.php",
        data: {"method":"takeSeat", "ticketid":$("#ticketid").text(), "seatid":Args.selected},
        success: function(data){
            var result = JSON.parse(data);
                if (result["state"] == "true"){
                    Message("选座成功");
                    $("#bconfirm").remove();
                    $("#breselect").remove();
                    location.replace("./Ticket.php?id=" + $("#ticketid").text() + "&openid=" + $("#openid").text());
                }
                else{
                    Update(result["message"]);
                }
        },
        error: function(data){
            Message("Error");
        }
    });
}
