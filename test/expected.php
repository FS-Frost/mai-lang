<?php
function main() {
    $num1 = (int) 2;
    printf($num1);
    $text = (string) "Hi!";
    printf($text);
    function customPrint(string $arg, int $n) {
        printf($n, $arg);
    }
    customPrint("called from func", $num1);
}
