export const sourceText: string = `
fn main() {
    int num1 = 2;
    print(num1);

    string text = "Hi!";
    print(text);

    fn customPrint(string arg, int n) {
        print(n, arg);
    }

    customPrint("called from func", num1);
}
`;
