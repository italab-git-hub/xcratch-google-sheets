export default function (Scratch) {
    class SheetAPI {
        getInfo() {
            return {
                id: 'sheetapi',
                name: 'Google Sheet API',
                blocks: [
                    {
                        opcode: 'readCell',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'シート [id] の [range] を読む（APIキー: [key]）',
                        arguments: {
                            id: { type: Scratch.ArgumentType.STRING, defaultValue: '1w-o_6vGlj8YJc1Fm4QNeSRiL112UgQx3DOkNH4VlbuE' },
                            range: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sheet1!A15' },
                            key: { type: Scratch.ArgumentType.STRING, defaultValue: 'AIzaSyASHag5PJVfUFV4bEI8w66mN_ZhhFbAT_M' }
                        }
                    },
                    {
                        opcode: 'writeCell',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'シート [id] の [range] に [value] と書く（APIキー: [key]）',
                        arguments: {
                            id: { type: Scratch.ArgumentType.STRING, defaultValue: '1w-o_6vGlj8YJc1Fm4QNeSRiL112UgQx3DOkNH4VlbuE' },
                            range: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sheet1!A15' },
                            value: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' },
                            key: { type: Scratch.ArgumentType.STRING, defaultValue: 'AIzaSyASHag5PJVfUFV4bEI8w66mN_ZhhFbAT_M' }
                        }
                    }
                ]
            };
        }

        async readCell(args) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${args.id}/values/${args.range}?key=${args.key}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                return (data.values && data.values[0][0]) || '';
            } catch (e) {
                console.error(e);
                return '読み込みエラー';
            }
        }

        async writeCell(args) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${args.id}/values/${args.range}?valueInputOption=RAW&key=${args.key}`;
            const body = {
                range: args.range,
                majorDimension: 'ROWS',
                values: [[args.value]]
            };
            try {
                await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    return SheetAPI;
}
