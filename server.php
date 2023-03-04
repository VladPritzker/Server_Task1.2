<?php
$_POST = json_decode(file_get_contents("php://input"), true );// что бы все что мы приходит от 
//пользователя мы декодируем в json формат
// file_get_contents это функция 
// что бы на php коде получить данные и снимим рабоать 
echo var_dump($_POST);