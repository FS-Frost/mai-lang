<script lang="ts">
    import loader from "@monaco-editor/loader";
    import type { Monaco } from "@monaco-editor/loader";
    import type { editor } from "monaco-editor";
    import { createEventDispatcher } from "svelte";

    export let lang: string;
    export let value: string = "";
    export let minimapEnabled: boolean = false;
    export let readonly: boolean = false;

    const dispatch = createEventDispatcher<{
        change: string;
    }>();

    let divEditor: HTMLElement;
    let monaco: Monaco | null;
    let editor: editor.IStandaloneCodeEditor;

    function getCurrentValue(): string {
        if (editor == null) {
            console.warn("sql editor not ready, can't get value");
            return "";
        }

        const currentValue = editor.getValue({
            lineEnding: "\n",
            preserveBOM: false,
        });

        return currentValue;
    }

    export function setValue(value: string): void {
        if (editor == null) {
            console.warn("sql editor not ready, can't set value", { value });
            return;
        }

        editor.setValue(value);
    }

    export async function init(): Promise<string> {
        if (divEditor == null) {
            return "editor element not found";
        }

        monaco = await loader.init();
        if (monaco == null) {
            return "failed to initialize SQL editor";
        }

        editor = monaco.editor.create(divEditor, {
            value: value,
            language: lang,
            theme: "vs-dark",
            readOnly: readonly,
            wordWrap: "on",
            minimap: {
                enabled: minimapEnabled,
            },
        });

        editor.onDidChangeModelContent(() => {
            value = getCurrentValue();
            dispatch("change", value);
        });

        return "";
    }
</script>

<div bind:this={divEditor} class="custom-editor" />

<style>
    .custom-editor {
        width: 100%;
        min-height: 300px;
        margin-bottom: 0.5rem;
        outline: 1px solid #b7b7b7;
    }
</style>
