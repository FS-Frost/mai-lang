export const sourceText: string = `
fn main() {
    int num1 = 1 + 2 * 3 / 4;
    print(num1);

    string text = "Hi!";
    print(text);

    fn customPrint(string arg, int n) {
        print(n, arg);
    }

    customPrint("called from func", num1);
}
`;
