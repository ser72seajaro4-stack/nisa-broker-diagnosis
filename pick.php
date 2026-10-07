<?php
// 推薦確率（合計100%）に基づいてサーバー側で1社を抽選して返す
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in) || count($in) < 1 || count($in) > 50) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid input']);
    exit;
}

$weights = [];
foreach ($in as $key => $v) {
    if (!preg_match('/^[a-z0-9_]{1,20}$/', (string)$key) || !is_numeric($v) || $v < 0) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid value']);
        exit;
    }
    $weights[$key] = (float)$v;
}

$total = array_sum($weights);
if ($total <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid total']);
    exit;
}

$r = random_int(0, 999999999) / 1000000000 * $total;
$picked = array_key_first($weights);
foreach ($weights as $key => $w) {
    $r -= $w;
    if ($r <= 0) { $picked = $key; break; }
}
echo json_encode(['picked' => $picked]);
