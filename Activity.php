<?php
/**
  * View activity page
  * Author: Xu Yi
  * Last modified: 2014.11.25
  * method: GET
  * param: id activity's id in database
  */
?>

<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml">  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<meta name="viewport" content="width=device-width"/>
<link rel="stylesheet" type="text/css" href="./css/ActivityInfo.css">
<link rel="stylesheet" type="text/css" href="./css/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" type="text/css" href="./css/jquery.flipcountdown.css" />
<link rel="stylesheet" href="./css/v1.3.css" />
<link rel="stylesheet" href="./css/v1.3.min.css" />

<script type="text/javascript" src = "./js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src = "./js/ActivityInfo.js"></script>
<script type="text/javascript" src = "./js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src = "./js/jquery.mobile-1.4.5.min.js"></script>
<script type="text/javascript" src = "./js/jquery.flipcountdown.js"></script>
<title>活动详情</title>
</head>
<body>

    <?php
        require_once "./php/dataAPI.php";
        $dataapi = new dataAPI();
        $result = $dataapi->getActivityInfo($_GET['id']);
        $remain = 0;
        if ($result['state'] == 'true'){
            $activity = $result['message']['name'];
            $startTime = $result['message']['start_time'];
            $endTime = $result['message']['end_time'];
            $remain = $result['message']['ticket_available_number'];
            $location = $result['message']['stage'];
            $ticketStartTime = $result['message']['ticket_start_time'];
            $ticketEndTime = $result['message']['ticket_end_time'];
            $ticketPerStudent = $result['message']['ticket_per_student'];
        }
    ?>
	<div data-role="page" data-theme="a" id="pageone">
		<div data-role="header" id = "ImgTop">
	    	<h1><?php echo $activity;?></h1>
	  	</div>

	<div data-role="content" id = "TicketInfo">
	    <ul data-role="listview" data-inset="true">
	    	<li id = "Rob-Start">离抢票开始还有</li>
	    	<li id = "Rob-End">离抢票结束还有</li>
	    	<li id = "Act-Start">离活动开始还有</li>
	    	<li id = "Act-End">离活动结束还有</li>
	    	<li id = "END">活动已经结束</li>
	    	<li>
	    		<div id = "Time-Left">					
				</div>
	    	</li>
	       <li data-icon="false" >
	       		<a>
	       			<img src="./img/RobTime.png">
	       			<span>抢票开始时间：</span>
	       			<p id = "RobStartTime" ><?php echo $ticketStartTime;?></p>

	       		</a>
	       	</li>
	       	<li data-icon="false">
	       		<a>
	       			<img src="./img/RobTime.png">
	       			<span>抢票结束时间：</span>
	       			<p id = "RobEndTime"><?php echo $ticketEndTime;?></p>
	       		</a>
	       	</li>
	       	<li data-icon="false">
	       		<a>
	       			<img src="./img/Ticket.png">
	       			<p id = "TicketLeftNumber">
	       				<span>当前余票: </span>
	       				<span id = "TicketLeft"><?php echo $remain;?></span> 张
	       			</p>
	       		</a>
	       	</li>

            <li data-icon="false">
	       		<a>
	       			<img src="./img/Ticket.png">
	       			<p id = "Ticket_PerStudent">
	       				<span>每人可选: </span>
	       				<span id = "TicketPerStudent"><?php echo $ticketPerStudent;?></span> 张
	       			</p>
	       		</a>
	       	</li>

	        <li data-icon="false">
	        	<a>
	        		<img src="./img/Place.png">
	        		<p id = "ActivityPlace">
	        			<span>活动地点：</span><?php echo $location;?>
	        		</p>
	        	</a>
	        </li>
	        <li data-icon="false">
	        	<a>
	        		<img src="./img/ActivityTime.png">
	        		<span>活动开始时间：</span>
	        		<p id = "ActivityStartTime"><?php echo $startTime;?></p>
	        	</a>
	        </li>
	        <li data-icon="false">
	        	<a>
	        		<img src="./img/ActivityTime.png">
	        		<span>活动结束时间：</span>
	        		<p id = "ActivityEndTime"><?php echo $endTime;?></p>
	        	</a>
	        </li>
	         <li data-role="collapsible">
	            <h1>活动简述</h1>
	            <textarea readonly="readonly" id = "ActDescription">&nbsp;&nbsp;&nbsp;&nbsp;
	            </textarea>
	        </li>	        
	         <li data-role="collapsible">
	            <h1>活动预览</h1>
	            <p>暂无图片</p>
	        </li>
	    </ul>
 
	 </div>

  <div data-role="footer" data-position="fixed" id="Footer">
	  <h1>共青团清华大学委员会 &copy 2014</h1>
  </div>
</div> 

</body>
</html>
