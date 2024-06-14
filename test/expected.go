package main

func main() {
    var num1 int = 2
    println(num1)
    var text string = "Hi!"
    println(text)
    customPrint := func(arg string, n int) {
        println(n, arg)
    }
    customPrint("called from func", num1)
}
