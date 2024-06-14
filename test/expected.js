function main() {
    const num1 = 2;
    console.log(num1);
    const text = "Hi!";
    console.log(text);
    function customPrint(arg, n) {
        console.log(n, arg);
    }
    customPrint("called from func", num1);
}
