function main() {
    const num1 = 1 + 2 * 3 / 4;
    console.log(num1);
    const text = "Hi!";
    console.log(text);
    function customPrint(arg, n) {
        console.log(n, arg);
    }
    customPrint("called from func", num1);
}
