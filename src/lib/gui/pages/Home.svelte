<script lang="ts">
    import { Lexer, Parser, parse } from "$lib/lexer";
    import { sourceText } from "$lib/sourceText";
    import { onMount } from "svelte";
    import Editor from "../Editor.svelte";

    let editor: Editor;
    let editorGO: Editor;
    let editorJS: Editor;
    let editorPHP: Editor;
    let source: string = sourceText;
    let errorMessage: string = "";

    function parseGO(): void {
        const filePath = "source.mai";
        const lexer = new Lexer(filePath, source);
        const [tokens, error] = lexer.tokenize();
        if (error) {
            console.error(error);
            lexer.logLineError();
            throw new Error(error);
        }

        console.log({ tokens });
        const parser = new Parser(lexer);
        const result = parser.parseTokens([...tokens], "go");
        editorGO.setValue(result);
    }

    function parseJS(): void {
        const filePath = "source.mai";
        const lexer = new Lexer(filePath, source);
        const [tokens, error] = lexer.tokenize();
        if (error) {
            console.error(error);
            lexer.logLineError();
            throw new Error(error);
        }

        const parser = new Parser(lexer);
        const result = parser.parseTokens([...tokens], "js");
        editorJS.setValue(result);
    }

    function parsePHP(): void {
        const filePath = "source.mai";
        const lexer = new Lexer(filePath, source);
        const [tokens, error] = lexer.tokenize();
        if (error) {
            console.error(error);
            lexer.logLineError();
            throw new Error(error);
        }

        const parser = new Parser(lexer);
        const result = parser.parseTokens([...tokens], "php");
        editorPHP.setValue(result);
    }

    function parseSource(): void {
        try {
            errorMessage = "";
            editorPHP.setValue("");
            editorGO.setValue("");
            editorJS.setValue("");
            parseGO();
            parseJS();
            parsePHP();
        } catch (error) {
            console.error(error);
            errorMessage = `${error}`;
            editorGO.setValue("// " + errorMessage);
            editorJS.setValue("// " + errorMessage);
            editorPHP.setValue("<?php\n// " + errorMessage);
        }
    }

    function updateCode(code: string): void {
        source = code;
        parseSource();
    }

    onMount(async () => {
        let editorInitError = await editor.init();
        if (editorInitError.length > 0) {
            const title = `ERROR: ${editorInitError}`;
            errorMessage = `${title}. Try reloading the page.`;
            console.log("show log", title);
            return;
        }

        editorInitError = await editorGO.init();
        if (editorInitError.length > 0) {
            const title = `ERROR: ${editorInitError}`;
            errorMessage = `${title}. Try reloading the page.`;
            console.log("show log", title);
            return;
        }

        editorInitError = await editorJS.init();
        if (editorInitError.length > 0) {
            const title = `ERROR: ${editorInitError}`;
            errorMessage = `${title}. Try reloading the page.`;
            console.log("show log", title);
            return;
        }

        editorInitError = await editorPHP.init();
        if (editorInitError.length > 0) {
            const title = `ERROR: ${editorInitError}`;
            errorMessage = `${title}. Try reloading the page.`;
            console.log("show log", title);
            return;
        }

        source = source.replace("\n", "");
        parseSource();
        editor.setValue(source);
    });
</script>

<svelte:head>
    <title>MAI Lang</title>
</svelte:head>

<h1>MAI Lang</h1>

<p class="has-text-danger">{errorMessage}&nbsp;</p>

<Editor
    bind:this={editor}
    lang="rust"
    minimapEnabled
    on:change={(e) => updateCode(e.detail)}
/>

<div class="langs">
    <div class="lang">
        <label class="label" for="">Go</label>
        <Editor bind:this={editorGO} lang="go" readonly />
    </div>

    <div class="lang">
        <label class="label" for="">JavaScript</label>
        <Editor bind:this={editorJS} lang="javascript" readonly />
    </div>

    <div class="lang">
        <label class="label" for="">PHP</label>
        <Editor bind:this={editorPHP} lang="php" readonly />
    </div>
</div>

<style>
    label {
        width: 100%;
        text-align: center;
    }

    p {
        width: 100%;
    }

    .langs {
        display: flex;
        width: 100%;
    }

    .lang {
        width: 100%;
        justify-content: space-evenly;
    }
</style>
