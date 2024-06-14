package main

func main() {
    var num1 int = 2
    println(num1)
    var text string = "Hi!"
    println(text)
    customPrint := func() {
        println("called from func")
    }
    customPrint()
}
