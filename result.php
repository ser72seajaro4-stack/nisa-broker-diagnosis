<?php
header('Content-Type: application/json; charset=utf-8');
/* GitHub PagesではPHPは実行されません。PHP対応サーバー向けAPI例です。 */
$names=['sbi'=>'SBI証券','rakuten'=>'楽天証券','monex'=>'マネックス証券','au'=>'三菱UFJ eスマート証券','matsui'=>'松井証券'];
$input=json_decode(file_get_contents('php://input'),true);$scores=is_array($input['scores']??null)?$input['scores']:[];$out=[];
foreach($names as $k=>$v)$out[]=['key'=>$k,'name'=>$v,'score'=>(float)($scores[$k]??0)];
usort($out,fn($a,$b)=>$b['score']<=>$a['score']);echo json_encode(['success'=>true,'ranking'=>$out,'generated_at'=>date(DATE_ATOM)],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
?>
