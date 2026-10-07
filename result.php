<?php
header('Content-Type: application/json; charset=utf-8');
/* GitHub PagesではPHPは実行されません。PHP対応サーバー向けAPI例です。 */
$names=['sbi'=>'SBI証券','rakuten'=>'楽天証券','monex'=>'マネックス証券','mufg'=>'三菱UFJ eスマート証券','matsui'=>'松井証券','connect'=>'大和コネクト証券','paypay'=>'PayPay証券','moomoo'=>'moomoo証券','okasan'=>'岡三オンライン','gmo'=>'GMOクリック証券','dmm'=>'DMM株','nomura'=>'野村證券','daiwa'=>'大和証券','smbc'=>'SMBC日興証券','iwai'=>'岩井コスモ証券'];
$input=json_decode(file_get_contents('php://input'),true);$scores=is_array($input['scores']??null)?$input['scores']:[];$out=[];
foreach($names as $k=>$v)$out[]=['key'=>$k,'name'=>$v,'score'=>(float)($scores[$k]??0)];
usort($out,fn($a,$b)=>$b['score']<=>$a['score']);echo json_encode(['success'=>true,'ranking'=>$out,'generated_at'=>date(DATE_ATOM)],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
?>
