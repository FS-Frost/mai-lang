import { expect, test } from "bun:test";
import { parse } from "../src/lib/lexer";

test("compile to js", async () => {
    const content = await Bun.file("test/source.mai").text();
    const result = parse(content, "js");
    // console.log(result);
    const expectedText = await Bun.file("test/expected.js").text();
    expect(result).toEqual(expectedText);
});

test("compile to php", async () => {
    const content = await Bun.file("test/source.mai").text();
    const result = parse(content, "php");
    // console.log(result);
    const expectedText = await Bun.file("test/expected.php").text();
    expect(result).toEqual(expectedText);
});

test("compile to go", async () => {
    const content = await Bun.file("test/source.mai").text();
    const result = parse(content, "go");
    // console.log(result);
    const expectedText = await Bun.file("test/expected.go").text();
    expect(result).toEqual(expectedText);
});
