<?php
/*
 * GitHub公開用のPHP版結果エンドポイント。
 *
 * GitHub PagesはPHPを実行できないため、Pagesだけで公開する場合は
 * index.html + style.css + script.js のJavaScript診断がそのまま動作します。
 *
 * PHP対応サーバーへ配置した場合は POST /result.php に
 * {"scores":{"sbi":10,"rakuten":8,...}} を送るとJSONを返します。
 */
header('Content-Type: application/json; charset=utf-8');

$brokers = [
  'sbi' => [
    'name' => 'SBI証券',
    'url' => 'https://www.sbisec.co.jp/',
    'note' => '三井住友カード・Vポイント、NISA、日本株を重視する人向け'
  ],
  'rakuten' => [
    'name' => '楽天証券',
    'url' => 'https://www.rakuten-sec.co.jp/',
    'note' => '楽天カード・楽天ポイント、楽天経済圏との連携を重視する人向け'
  ],
  'monex' => [
    'name' => 'マネックス証券',
    'url' => 'https://www.monex.co.jp/',
    'note' => 'dカード・dポイント、NISA、1株投資を重視する人向け'
  ],
  'au' => [
    'name' => '三菱UFJ eスマート証券',
    'url' => 'https://kabu.com/',
    'note' => '三菱UFJカード・au PAYカード・Pontaを重視する人向け'
  ],
  'matsui' => [
    'name' => '松井証券',
    'url' => 'https://www.matsui.co.jp/',
    'note' => 'JCB・J-POINT、投信残高ポイント、シンプルな操作性を重視する人向け'
  ]
];

$input = json_decode(file_get_contents('php://input'), true);
$scores = is_array($input['scores'] ?? null) ? $input['scores'] : [];

$result = [];
foreach ($brokers as $key => $broker) {
  $score = isset($scores[$key]) && is_numeric($scores[$key]) ? (int)$scores[$key] : 0;
  $result[] = [
    'key' => $key,
    'name' => $broker['name'],
    'score' => $score,
    'note' => $broker['note'],
    'url' => $broker['url']
  ];
}

usort($result, fn($a, $b) => $b['score'] <=> $a['score']);

echo json_encode([
  'success' => true,
  'generated_at' => date(DATE_ATOM),
  'ranking' => $result
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
