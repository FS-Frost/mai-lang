<script lang="ts">
    import { Lexer, Parser, parse } from "$lib/lexer";
    import { sourceText } from "$lib/sourceText";
    import { onMount } from "svelte";

    let source: string = sourceText;
    let resultGO: string = "";
    let resultJS: string = "";
    let resultPHP: string = "";
    let errorMessage: string = "";

    function parseSource(): void {
        try {
            errorMessage = "";
            resultGO = "";
            resultJS = "";
            resultPHP = "";

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
            resultGO = parser.parseTokens([...tokens], "go");
            resultJS = parser.parseTokens([...tokens], "js");
            resultPHP = parser.parseTokens([...tokens], "php");
        } catch (error) {
            console.error(error);
            errorMessage = `${error}`;
        }
    }

    onMount(() => {
        source = source.replace("\n", "");
        parseSource();
    });
</script>

<svelte:head>
    <title>MAI Lang</title>
</svelte:head>

<h1>MAI Lang</h1>

<p class="has-text-danger">{errorMessage}&nbsp;</p>

<div class="langs">
    <div class="field">
        <label class="label" for="">MAI source code</label>
        <div class="control">
            <textarea
                class="textarea"
                bind:value={source}
                on:keyup={() => parseSource()}
            ></textarea>
        </div>
    </div>

    <div class="field">
        <label class="label" for="">Go</label>
        <div class="control">
            <textarea class="textarea" value={resultGO} readonly></textarea>
        </div>
    </div>

    <div class="field">
        <label class="label" for="">JS</label>
        <div class="control">
            <textarea class="textarea" value={resultJS} readonly></textarea>
        </div>
    </div>

    <div class="field">
        <label class="label" for="">PHP</label>
        <div class="control">
            <textarea class="textarea" value={resultPHP} readonly></textarea>
        </div>
    </div>
</div>

<style>
    .langs {
        display: flex;
        width: 100%;
    }

    p {
        width: 100%;
    }

    .field {
        width: 100%;
    }

    textarea {
        width: 100%;
        height: 100vh;
    }
</style>
