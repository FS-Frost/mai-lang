const TYPE_INT = "int";
const TYPE_STRING = "string";

const LITERAL_SEMICOLON = ";";
const LITERAL_COMMA = ",";
const LITERAL_OPAREN = "(";
const LITERAL_CPAREN = ")";
const LITERAL_OCURLY = "{";
const LITERAL_CCURLY = "}";
const LITERAL_EQUALS = "=";
const LITERAL_DOUBLE_QUOTE = '"';

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
        return `${this.location.display()} ${this.value}`;
    }
}

class Lexer {
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

    nextToken(): [Token | null, string?] {
        this.skipSpaces();
        while (this.isEmpty()) {
            return [null];
        }

        const location = this.location();
        const char = this.source[this.cursor];
        if (this.isAlpha(char)) {
            const index = this.cursor;
            while (this.isNotEmpty() && this.isAlphaNumeric(this.source[this.cursor])) {
                this.advanceCursor();
            }

            const value = this.source.substring(index, this.cursor);
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

function parseTokens(tokens: Token[], lang: string): string {
    let s = "";
    while (tokens.length > 0) {
        const token = tokens[0];
        switch (token.name) {
            case TOKEN_TYPE:
                s += parseVariableDeclaration(tokens, lang);
                break;

            case TOKEN_NAME:
                s += parseFunctionCall(tokens, lang);
                break;

            default:
                const msg = `${token.location.display()}: expected ${TOKEN_TYPE} or ${TOKEN_NAME}, but got ${token.name}: ${token.value}`;
                throw new Error(msg);
        }

        s += "\n";
    }

    return s;
}

function assertNextTokenName(tokens: Token[], ...tokenNames: string[]): Token | never {
    const token = tokens.shift() ?? null;
    if (!token) {
        const msg = `expected ${tokenNames.join(", ")}, but got null`;
        throw new Error(msg);
    }

    if (!tokenNames.includes(token?.name ?? "")) {
        const msg = `${token.location.display()}: expected ${tokenNames.join(", ")}, but got ${token.name}: ${token.value}`;
        throw new Error(msg);
    }

    return token;
}

function assertString(expected: string, actual: string): void | never {
    if (expected !== actual) {
        const msg = `expected string ${expected}, but got ${actual}`;
        throw new Error(msg);
    }
}

function parseVariableDeclaration(tokens: Token[], lang: string): string {
    const tokenType = assertNextTokenName(tokens, TOKEN_TYPE);
    const tokenName = assertNextTokenName(tokens, TOKEN_NAME);
    const tokenEquals = assertNextTokenName(tokens, TOKEN_LITERAL);
    assertString(tokenEquals.value, LITERAL_EQUALS);
    let s = "";

    switch (tokenType.value) {
        case TYPE_STRING:
            {
                const tokenValue = assertNextTokenName(tokens, TOKEN_STRING);
                switch (lang) {
                    case "php":
                        s = `$${tokenName.value} = (${tokenType.value}) "${tokenValue.value}";`;
                        break;

                    default:
                        s = `const ${tokenName.value} = "${tokenValue.value}";`;
                        break;
                }
                break;
            }

        default:
            {
                const tokenValue = assertNextTokenName(tokens, TOKEN_INT);
                switch (lang) {
                    case "php":
                        s = `$${tokenName.value} = (${tokenType.value}) ${tokenValue.value};`;
                        break;

                    default:
                        s = `const ${tokenName.value} = ${tokenValue.value};`;
                        break;
                }
                break;
            }
    }

    const tokenSemicolon = assertNextTokenName(tokens, TOKEN_LITERAL);
    assertString(tokenSemicolon.value, LITERAL_SEMICOLON);
    return s;
}

function parseFunctionCall(tokens: Token[], lang: string): string {
    const tokenName = assertNextTokenName(tokens, TOKEN_NAME);
    const tokenOparen = assertNextTokenName(tokens, TOKEN_LITERAL);
    assertString(tokenOparen.value, LITERAL_OPAREN);
    const tokenArg = assertNextTokenName(tokens, TOKEN_NAME, TOKEN_INT, TOKEN_STRING);
    const tokenCparen = assertNextTokenName(tokens, TOKEN_LITERAL);
    assertString(tokenCparen.value, LITERAL_CPAREN);
    const tokenSemicolon = assertNextTokenName(tokens, TOKEN_LITERAL);
    assertString(tokenSemicolon.value, LITERAL_SEMICOLON);

    switch (tokenName.value) {
        case "print":
            switch (lang) {
                case "php":
                    return `printf("%s\\n", $${tokenArg.value});`;

                default:
                    return `console.log(${tokenArg.value});`;
            }

        default:
            throw new Error(`${tokenName.location.display()} undefined function: ${tokenName.value}`);
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

    const s = parseTokens(tokens, lang);
    return s;
}
