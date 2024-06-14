const TYPE_INT = "int";
const TYPE_STRING = "string";
const TYPE_FUNCTION = 'fn';

const LITERAL_SEMICOLON = ";";
const LITERAL_COMMA = ",";
const LITERAL_OPAREN = "(";
const LITERAL_CPAREN = ")";
const LITERAL_OCURLY = "{";
const LITERAL_CCURLY = "}";
const LITERAL_EQUALS = "=";
const LITERAL_DOUBLE_QUOTE = '"';
const LITERAL_BACK_SLASH = '/';

const TOKEN_COMMENT = "TOKEN_COMMENT";
const TOKEN_TYPE = "TOKEN_TYPE";
const TOKEN_NAME = "TOKEN_NAME";
const TOKEN_INT = "TOKEN_INT";
const TOKEN_STRING = "TOKEN_STRING";
const TOKEN_LITERAL = "TOKEN_LITERAL";

class Location {
    filePath: string;
    row: number;
    column: number;

    constructor(filePath: string, row: number, col: number) {
        this.filePath = filePath;
        this.row = row;
        this.column = col;
    }

    display(): string {
        return `[${this.filePath}:${this.row}:${this.column + 1}]`;
    }
}

class Token {
    location: Location;
    name: string;
    type: string;
    value: string;

    constructor(location: Location, name: string, value: string) {
        this.location = location;
        this.name = name;
        this.type = "";
        this.value = value;
    }

    display(): string {
        return `[${this.name.padEnd(TOKEN_LITERAL.length, " ")}]${this.location.display()} ${this.value}`;
    }
}

export class Lexer {
    filePath: string;
    source: string;
    cursor: number;
    column: number;
    row: number;
    lines: string[];

    constructor(filePath: string, source: string) {
        this.filePath = filePath;
        this.source = source;
        this.lines = source.split("\n");
        this.cursor = 0;
        this.column = 0;
        this.row = 1;
    }

    isType(text: string): boolean {
        const types = [TYPE_INT, TYPE_STRING];
        return types.includes(text);
    }

    isAlpha(text: string): boolean {
        const regexp = /^[a-zA-Z]$/;
        return regexp.test(text);
    }

    isAlphaNumeric(text: string): boolean {
        const regexp = /^[a-zA-Z0-9]$/;
        return regexp.test(text);
    }

    isDigit(text: string): boolean {
        const regexp = /^[0-9]$/;
        return regexp.test(text);
    }

    isSpace(text: string): boolean {
        return text === " " || text === "\n" || text === "\t" || text === "\r";
    }

    advanceCursor(): void {
        if (this.isNotEmpty()) {
            const char = this.source[this.cursor];
            this.cursor++;
            this.column++;

            if (char === "\n") {
                this.column = 0;
                this.row++;
            }
        }
    }

    isEmpty(): boolean {
        return this.cursor >= this.source.length;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    isEndOfLine(): boolean {
        return this.source[this.cursor] === "\n";
    }

    skipSpaces(): void {
        while (this.isNotEmpty() && this.isSpace(this.source[this.cursor])) {
            this.advanceCursor();
        }
    }

    location() {
        return new Location(this.filePath, this.row, this.column);
    }

    display(): string {
        const line = this.lines[this.row - 1];
        let text = line + "\n";
        for (let i = 0; i < this.column; i++) {
            text += "_";
        }

        text += "^";
        return text;
    }

    logLine(): void {
        console.log(this.display());
    }

    logLineError(): void {
        console.error(this.display());
    }

    tokenizeFunction(): [Token | null, string?] {
        // NAME
        let [token, error] = this.nextToken();
        if (error) {
            return [null, error];
        }

        if (token == null) {
            return [null, `expecting ${TOKEN_NAME}, but got null`];
        }

        if (token.name !== TOKEN_NAME) {
            return [null, `expecting ${TOKEN_NAME}, but got ${token.name}`];
        }

        const name = token.value;

        // OPAREN
        [token, error] = this.nextToken();
        if (error) {
            return [null, error];
        }

        if (token == null) {
            return [null, `expecting ${LITERAL_OPAREN}, but got null`];
        }

        if (token.value !== LITERAL_OPAREN) {
            return [null, `expecting ${LITERAL_OPAREN}, but got ${token.value}`];
        }

        // CPAREN
        [token, error] = this.nextToken();
        if (error) {
            return [null, error];
        }

        if (token == null) {
            return [null, `expecting ${LITERAL_CPAREN}, but got null`];
        }

        if (token.value !== LITERAL_CPAREN) {
            return [null, `expecting ${LITERAL_CPAREN}, but got ${token.value}`];
        }

        // OCURLY
        [token, error] = this.nextToken();
        if (error) {
            return [null, error];
        }

        if (token == null) {
            return [null, `expecting ${LITERAL_OCURLY}, but got null`];
        }

        if (token.value !== LITERAL_OCURLY) {
            return [null, `expecting ${LITERAL_OCURLY}, but got ${token.value}`];
        }

        const tokens: Token[] = [];
        let ccurlyFound: boolean = false;
        while (this.isNotEmpty()) {
            [token, error] = this.nextToken();
            if (error) {
                return [null, error];
            }

            if (token == null) {
                return [null, `expecting token, but got null`];
            }

            if (token.name === TOKEN_LITERAL && token.value === LITERAL_CCURLY) {
                ccurlyFound = true;
                break;
            }

            tokens.push(token);
        }

        if (!ccurlyFound) {
            return [null, `expecting ${LITERAL_CCURLY}, but got null`];
        }

        return [null, ""];
    }

    nextToken(): [Token | null, string?] {
        this.skipSpaces();
        while (this.isEmpty()) {
            return [null];
        }

        const location = this.location();
        const char = this.source[this.cursor];

        if (char == LITERAL_BACK_SLASH) {
            if (this.isEmpty()) {
                throw new Error("bad comment");
            }

            this.advanceCursor();
            const next = this.source[this.cursor];
            if (next !== LITERAL_BACK_SLASH) {
                throw new Error("bad comment 2");
            }

            this.advanceCursor();
            this.skipSpaces();

            if (location.row != this.row) {
                const name = TOKEN_COMMENT;
                return [new Token(location, name, "")];
            }

            let value = "";
            while (this.isNotEmpty() && this.source[this.cursor] !== "\n") {
                value += this.source[this.cursor];
                this.advanceCursor();
            }

            const name = TOKEN_COMMENT;
            return [new Token(location, name, value)];
        }

        if (this.isAlpha(char)) {
            const index = this.cursor;
            while (this.isNotEmpty() && this.isAlphaNumeric(this.source[this.cursor])) {
                this.advanceCursor();
            }

            const value = this.source.substring(index, this.cursor);
            if (value === TYPE_FUNCTION) {
                return [new Token(location, TYPE_FUNCTION, value)];
            }

            const name = this.isType(value) ? TOKEN_TYPE : TOKEN_NAME;
            return [new Token(location, name, value)];
        }

        if (this.isDigit(char)) {
            const index = this.cursor;
            while (this.isNotEmpty() && this.isDigit(this.source[this.cursor])) {
                this.advanceCursor();
            }

            const value = this.source.substring(index, this.cursor);
            return [new Token(location, TOKEN_INT, value)];
        }

        if (char === LITERAL_DOUBLE_QUOTE) {
            const index = this.cursor + 1;
            while (this.isNotEmpty()) {
                this.advanceCursor();
                const next = this.source[this.cursor];
                if (next === LITERAL_DOUBLE_QUOTE) {
                    this.advanceCursor();
                    break;
                }
            }

            const value = this.source.substring(index, this.cursor - 1);
            return [new Token(location, TOKEN_STRING, value)];
        }

        const literals: string[] = [
            LITERAL_EQUALS,
            LITERAL_OCURLY,
            LITERAL_CCURLY,
            LITERAL_OPAREN,
            LITERAL_CPAREN,
            LITERAL_SEMICOLON,
            LITERAL_COMMA,
        ];

        if (literals.includes(char)) {
            if (this.isNotEmpty()) {
                this.advanceCursor();
            }

            return [new Token(location, TOKEN_LITERAL, char)];
        }

        const error = `${location.display()}: invalid token at ${char}`;
        return [null, error];
    }

    tokenize(): [Token[], string?] {
        const tokens: Token[] = [];
        while (true) {
            const [token, error] = this.nextToken();
            if (error) {
                throw new Error(error);
            }

            if (!token) {
                break;
            }

            tokens.push(token);
        }

        return [tokens];
    }
}

type FuncArg = {
    type: string;
    name: string;
};

export class Parser {
    lexer: Lexer;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
    }

    parseTokens(tokens: Token[], lang: string): string {
        let s = "";
        switch (lang) {
            case "go":
                s += `package main\n\n`;
                break;

            case "php":
                s += `<?php\n`;

            default:
                break;
        }

        while (tokens.length > 0) {
            const token = tokens[0];
            switch (token.name) {
                case TOKEN_TYPE:
                    s += this.parseVariableDeclaration(tokens, lang);
                    break;

                case TOKEN_NAME:
                    s += this.parseFunctionCall(tokens, lang);
                    break;

                case TYPE_FUNCTION:
                    s += this.parseFunction(tokens, lang, 1);
                    break;

                default:
                    const msg = `${token.location.display()}: expected ${TOKEN_TYPE} or ${TOKEN_NAME}, but got ${token.name}: ${token.value}`;
                    throw new Error(msg);
            }

            s += "\n";
        }

        return s;
    }

    assertNextTokenName(tokens: Token[], ...expectedTokenNames: string[]): Token | never {
        const token = tokens.shift() ?? null;
        if (!token) {
            const msg = `expected ${expectedTokenNames.join(", ")}, but got null`;
            throw new Error(msg);
        }

        if (!expectedTokenNames.includes(token?.name ?? "")) {
            const msg = `${token.location.display()}: expected ${expectedTokenNames.join(", ")}, but got ${token.name}: ${token.value}`;
            throw new Error(msg);
        }

        return token;
    }

    assertNextTokenLiteral(tokens: Token[], literal: string): Token | never {
        const token = tokens.shift() ?? null;
        if (!token) {
            const msg = `expected ${literal}, but got null`;
            throw new Error(msg);
        }

        if (token.value !== literal) {
            const msg = `${token.location.display()}: expected ${literal}, but got ${token.value}`;
            throw new Error(msg);
        }

        return token;
    }

    assertString(actual: string, expected: string): void | never {
        if (expected !== actual) {
            const msg = `expected string ${expected}, but got ${actual}`;
            throw new Error(msg);
        }
    }

    assertFuncArg(tokens: Token[]): FuncArg {
        const tokenType = this.assertNextTokenName(tokens, TOKEN_TYPE);
        const tokenName = this.assertNextTokenName(tokens, TOKEN_NAME);

        return {
            type: tokenType.value,
            name: tokenName.value,
        };
    }

    parseVariableDeclaration(tokens: Token[], lang: string): string {
        const tokenType = this.assertNextTokenName(tokens, TOKEN_TYPE);
        const tokenName = this.assertNextTokenName(tokens, TOKEN_NAME);
        const tokenEquals = this.assertNextTokenName(tokens, TOKEN_LITERAL);
        this.assertString(tokenEquals.value, LITERAL_EQUALS);
        const tokenValue = this.assertNextTokenName(tokens, TOKEN_INT, TOKEN_STRING);
        if (tokenType.value === TYPE_STRING) {
            tokenValue.value = `"${tokenValue.value}"`;
        }

        let s = "";
                    switch (lang) {
                        case "go":
                            s = `var ${tokenName.value} ${tokenType.value} = ${tokenValue.value}`;
                            break;

                        case "php":
                            s = `$${tokenName.value} = (${tokenType.value}) ${tokenValue.value};`;
                            break;

                        default:
                            s = `const ${tokenName.value} = ${tokenValue.value};`;
                            break;
        }

        const tokenSemicolon = this.assertNextTokenName(tokens, TOKEN_LITERAL);
        this.assertString(tokenSemicolon.value, LITERAL_SEMICOLON);
        return s;
    }

    formatVar(text: string, lang: string): string {
        switch (lang) {
            case "php":
                return "$" + text;

            default:
                return text;
        }
    }

    parseFunctionCall(tokens: Token[], lang: string): string {
        // name
        const tokenName = this.assertNextTokenName(tokens, TOKEN_NAME);

        // (
        const tokenOparen = this.assertNextTokenName(tokens, TOKEN_LITERAL);
        this.assertString(tokenOparen.value, LITERAL_OPAREN);

        // args
        let sArgs = "";
        while (true) {
            let tokenArg = this.assertNextTokenName(tokens, TOKEN_NAME, TOKEN_INT, TOKEN_STRING, TOKEN_LITERAL);
            if (tokenArg.name === TOKEN_STRING) {
                tokenArg.value = `"${tokenArg.value}"`;
            }
            else if (tokenArg.name === TOKEN_NAME) {
                tokenArg.value = this.formatVar(tokenArg.value, lang);
            }

            if (tokenArg.name === TOKEN_LITERAL && tokenArg.value === LITERAL_COMMA) {
                continue;
            }

            const isArg = [TOKEN_INT, TOKEN_STRING, TOKEN_NAME].includes(tokenArg.name);
            if (isArg) {
                if (sArgs.length > 0) {
                    sArgs += ", ";
                }

                sArgs += tokenArg.value;
                continue;
            }

            if (tokenArg.name === TOKEN_LITERAL && tokenArg.value === LITERAL_CPAREN) {
                break;
            }
        }

        // ;
        const tokenSemicolon = this.assertNextTokenName(tokens, TOKEN_LITERAL);
        this.assertString(tokenSemicolon.value, LITERAL_SEMICOLON);

        switch (tokenName.value) {
            case "print":
                switch (lang) {
                    case "go":
                        return `println(${sArgs})`;


                    case "php":
                        return `printf(${sArgs});`;

                    default:
                        return `console.log(${sArgs});`;
                }

            default:
                switch (lang) {
                    case "go":
                        return `${tokenName.value}(${sArgs})`;


                    case "php":
                        return `${tokenName.value}(${sArgs});`;

                    default:
                        return `${tokenName.value}(${sArgs});`;
                }
        }
    }

    generateIndent(layer: number): string {
        let s = "";
        const size = layer * 4;
        for (let i = 1; i <= size; i++) {
            s += " ";
        };

        return s;
    }

    parseFunction(tokens: Token[], lang: string, layer: number): string {
        const previousIndent = this.generateIndent(layer - 1);
        const indent = this.generateIndent(layer);
        let token = this.assertNextTokenName(tokens, TYPE_FUNCTION);
        token = this.assertNextTokenName(tokens, TOKEN_NAME);
        const name = token.value;
        this.assertNextTokenLiteral(tokens, LITERAL_OPAREN);

        const funcArgs: FuncArg[] = [];
        while (true) {
            token = tokens[0];
            if (token.name === TOKEN_TYPE) {
                const arg = this.assertFuncArg(tokens);
                funcArgs.push(arg);
            }

            if (tokens.length === 0) {
                break;
            }

            token = tokens[0];
            if (token.name === TOKEN_LITERAL && token.value === LITERAL_COMMA) {
                tokens.shift();
                continue;
            }

            if (token.name === TOKEN_LITERAL && token.value === LITERAL_CPAREN) {
                break;
            }

            if (token.type !== TOKEN_TYPE) {
                break;
            }
        }

        this.assertNextTokenLiteral(tokens, LITERAL_CPAREN);
        this.assertNextTokenLiteral(tokens, LITERAL_OCURLY);

        let s = "";
        switch (lang) {
            case "go":
                {
                    if (name === "main") {
                        s += `func ${previousIndent}${name}() {\n`;
                        break;
                    }

                    let sArgs = "";
                    for (let i = 0; i < funcArgs.length; i++) {
                        if (i > 0) {
                            sArgs += ", ";
                        }

                        const arg = funcArgs[i];
                        sArgs += `${arg.name} ${arg.type}`;
                    }

                    s += `${previousIndent}${name} := func(${sArgs}) {\n`;
                    break;
                }

            case "php":
                {
                    let sArgs = "";
                    for (let i = 0; i < funcArgs.length; i++) {
                        if (i > 0) {
                            sArgs += ", ";
                        }

                        const arg = funcArgs[i];
                        sArgs += `${arg.type} $${arg.name}`;
                    }

                    s += `${previousIndent}function ${name}(${sArgs}) {\n`;
                    break;
                }

            case "js":
                {
                    let sArgs = "";
                    for (let i = 0; i < funcArgs.length; i++) {
                        if (i > 0) {
                            sArgs += ", ";
                        }

                        const arg = funcArgs[i];
                        sArgs += arg.name;
                    }

                    s += `${previousIndent}function ${name}(${sArgs}) {\n`;
                    break;
                }
        }

        while (tokens.length > 0) {
            const fnToken = tokens[0];

            if (fnToken.value === LITERAL_CCURLY) {
                break;
            }

            switch (fnToken.name) {
                case TOKEN_TYPE:
                    s += indent + this.parseVariableDeclaration(tokens, lang) + "\n";
                    break;

                case TOKEN_NAME:
                    s += indent + this.parseFunctionCall(tokens, lang) + "\n";
                    break;

                case TYPE_FUNCTION:
                    s += this.parseFunction(tokens, lang, layer + 1) + "\n";
                    break;

                default:
                    break;
            }
        }

        this.assertNextTokenLiteral(tokens, LITERAL_CCURLY);
        s += `${previousIndent}}`;
        return s;
    }
}

export function parse(source: string, lang: string): string {
    const filePath = "source.mai";
    const lexer = new Lexer(filePath, source);
    const [tokens, error] = lexer.tokenize();
    if (error) {
        console.error(error);
        lexer.logLineError();
        throw new Error(error);
    }

    const parser = new Parser(lexer);
    const s = parser.parseTokens(tokens, lang);
    return s;
}
