<?php
function main() {
    $num1 = (int) 2;
    printf("%s\n", $num1);
    $text = (string) "Hi!";
    printf("%s\n", $text);
    function customPrint() {
        printf("called from func");
    }
}
