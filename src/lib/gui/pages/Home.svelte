<script lang="ts">
    import { parse } from "$lib/lexer";
    import { onMount } from "svelte";

    let source: string = `
int num1 = 2;
print(num1);

string text = "Hi!";
print(text);
    `;

    let resultPHP: string = "";
    let resultJS: string = "";
    let errorMessage: string = "";

    function parseSource(): void {
        try {
            errorMessage = "";
            resultJS = "";
            resultPHP = "";

            resultPHP = parse(source, "php");
            resultJS = parse(source, "js");
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

{#if errorMessage.length > 0}
    <p class="has-text-danger">{errorMessage}</p>
{/if}

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

<style>
    p {
        width: 100%;
    }

    .field {
        width: 100%;
    }

    textarea {
        width: 100%;
        min-height: 25rem;
    }
</style>
