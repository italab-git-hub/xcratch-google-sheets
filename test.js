export default function(Scratch) {
  class SheetGAS {
    getInfo() {
      return {
        id: 'sheetgas',
        name: 'Google Sheets (GAS)',
        blocks: [
          {
            opcode: 'readCell',
            blockType: Scratch.BlockType.REPORTER,
            text: 'GAS [url] の [シートID] / [シート名] / [セル] を読む',
            arguments: {
              url: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://script.google.com/macros/s/AKfycbwI27iHVqmprJ-oEvLa2pLJZo7Hj5FJVh4jA2-VWu0LLQyzO4yRfFHJNS40JqY4Y1bc/exec' },
              sheetId: { type: Scratch.ArgumentType.STRING, defaultValue: '1BdTPdUJGUs4NzyQLVhi_FAPnpOC7oGXD7jVk_Trk5vY' },
              sheetName: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sheet1' },
              cell: { type: Scratch.ArgumentType.STRING, defaultValue: 'A1' }
            }
          },
          {
            opcode: 'writeCell',
            blockType: Scratch.BlockType.COMMAND,
            text: 'GAS [url] に [値] を [シートID] / [シート名] / [セル] に書く',
            arguments: {
              url: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://script.google.com/macros/s/AKfycbwI27iHVqmprJ-oEvLa2pLJZo7Hj5FJVh4jA2-VWu0LLQyzO4yRfFHJNS40JqY4Y1bc/exec' },
              sheetId: { type: Scratch.ArgumentType.STRING, defaultValue: 'スプレッドシートID' },
              sheetName: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sheet1' },
              cell: { type: Scratch.ArgumentType.STRING, defaultValue: 'A1' },
              value: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
            }
          }
        ]
      };
    }

    async readCell(args) {
      const url = `${args.url}?sheetId=${args.sheetId}&sheetName=${args.sheetName}&cell=${args.cell}`;
      const res = await fetch(url);
      return await res.text();
    }

    async writeCell(args) {
      const form = new FormData();
      form.append("sheetId", args.sheetId);
      form.append("sheetName", args.sheetName);
      form.append("cell", args.cell);
      form.append("value", args.value);

      await fetch(args.url, {
        method: "POST",
        body: form
      });
    }
  }

  return SheetGAS;
}

