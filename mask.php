<?php
require_once "./php/dataAPI.php";

$method = $_POST['method'];
if ($method == 'unbind'){
    $openId = $_POST['openid'];
    $studentId = $_POST['studentid'];
    $dataapi = new dataAPI();
    $unbindResult = $dataapi->unbind($openId, $studentId);
    echo json_encode($unbindResult);
}

else if($method == 'refundTicket'){
    $openId = $_POST['openid'];
    $ticketId = $_POST['ticketid'];
    $dataapi = new dataAPI();
    $refundTicketResult = $dataapi->refundTicket($openId, $ticketId);
    echo json_encode($refundTicketResult);
}

else if($method == 'takeSeat'){
    $ticketId = $_POST['ticketid'];
    $seatId = $_POST['seatid'];
    $dataapi = new dataAPI();
    $takeSeatResult = $dataapi->takeSeat($ticketId, $seatId);
    echo json_encode($takeSeatResult);
}
?>
