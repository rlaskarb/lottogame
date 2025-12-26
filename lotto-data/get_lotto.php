<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// 1. 안전장치: 회차 번호(drwNo)가 왔는지 확인
if (!isset($_GET['drwNo'])) {
    echo json_encode(["returnValue" => "fail", "message" => "회차 번호가 없습니다."]);
    exit;
}

// 2. 보안 강화: 숫자만 받도록 강제 변환 (해킹 방지)
$round = intval($_GET['drwNo']); 

$url = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=" . $round;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// SSL 인증서 오류 무시 (오래된 서버 대응)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

$response = curl_exec($ch);

// 3. 통신 실패 시 예외 처리
if (curl_errno($ch)) {
    echo json_encode(["returnValue" => "fail", "message" => "동행복권 접속 실패"]);
} else {
    echo $response;
}

curl_close($ch);
?>