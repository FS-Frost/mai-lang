<?php
function main() {
    $num1 = 1 + 2 * 3 / 4;
    printf($num1);
    $text = "Hi!";
    printf($text);
    function customPrint(string $arg, int $n) {
        printf($n, $arg);
    }
    customPrint("called from func", $num1);
}
