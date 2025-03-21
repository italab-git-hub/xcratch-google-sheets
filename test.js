const API_KEY = 'AIzaSyASHag5PJVfUFV4bEI8w66mN_ZhhFbAT_M'; // Google Cloud Consoleで取得したAPIキーをここに入力してください

export default class GoogleSheetsExtension {
  constructor() {
    this.sheetId = null; // スプレッドシートIDを保存
  }

  getInfo() {
    return {
      id: 'googleSheets',
      name: 'Google Sheets',
      blocks: [
        {
          opcode: 'setSpreadsheet',
          blockType: Scratch.BlockType.COMMAND,
          text: 'スプレッドシートURLを設定 [URL]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://docs.google.com/spreadsheets/d/your-sheet-id/edit'
            }
          }
        },
        {
          opcode: 'writeCell',
          blockType: Scratch.BlockType.COMMAND,
          text: '[ROW] 行 [COLUMN] 列に [VALUE] を書き込む',
          arguments: {
            ROW: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            COLUMN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
          }
        },
        {
          opcode: 'readCell',
          blockType: Scratch.BlockType.REPORTER,
          text: '[ROW] 行 [COLUMN] 列の値を取得',
          arguments: {
            ROW: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            COLUMN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
          }
        }
      ]
    };
  }

  // スプレッドシートURLからIDを抽出して保存
  setSpreadsheet(args) {
    const url = args.URL;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      this.sheetId = match[1];
      console.log(`スプレッドシートIDが設定されました：${this.sheetId}`);
    } else {
      console.error('無効なスプレッドシートURLです');
    }
  }

  // 指定したセルに値を書き込む
  async writeCell(args) {
    if (!this.sheetId) {
      console.error('スプレッドシートが設定されていません');
      return;
    }

    const row = args.ROW;
    const col = args.COLUMN;
    const value = args.VALUE;
    const range = `Sheet1!${this.colToLetter(col)}${row}`;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    const body = { values: [[value]] };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY 
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.error('セルへの書き込みに失敗しました', await response.text());
      } else {
        console.log('セルへの書き込みが成功しました');
      }
    } catch (error) {
      console.error('エラーが発生しました', error);
    }
  }

  // 指定したセルの値を取得
  async readCell(args) {
    if (!this.sheetId) {
      console.error('スプレッドシートが設定されていません');
      return '';
    }

    const row = args.ROW;
    const col = args.COLUMN;
    const range = `Sheet1!${this.colToLetter(col)}${row}`;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('セルの読み取りに失敗しました', await response.text());
        return '';
      }

      const data = await response.json();
      return data.values ? data.values[0][0] : '';
    } catch (error) {
      console.error('エラーが発生しました', error);
      return '';
    }
  }

  // 列番号をアルファベット表記に変換（例：1 -> A, 2 -> B）
  colToLetter(col) {
    let letter = '';
    while (col > 0) {
      let temp = (col - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      col = (col - temp - 1) / 26;
    }
    return letter;
  }
}
