class GoogleSheetsExtension {
  constructor (runtime) {
    this.runtime = runtime;
    this.API_KEY = 'AIzaSyASHag5PJVfUFV4bEI8w66mN_ZhhFbAT_M'; // Google Cloud Consoleで取得したAPIキーを入力
    this.sheetId = null;
  }

  getInfo () {
    return {
      id: 'googleSheets',
      name: 'Google Sheets',
      blocks: [
        {
          opcode: 'setSpreadsheet',
          blockType: 'command',
          text: 'スプレッドシートURLを設定 [URL]',
          arguments: {
            URL: {
              type: 'string',
              defaultValue: 'https://docs.google.com/spreadsheets/d/your-sheet-id/edit'
            }
          }
        },
        {
          opcode: 'writeCell',
          blockType: 'command',
          text: '[ROW] 行 [COLUMN] 列に [VALUE] を書き込む',
          arguments: {
            ROW: { type: 'number', defaultValue: 1 },
            COLUMN: { type: 'number', defaultValue: 1 },
            VALUE: { type: 'string', defaultValue: 'Hello' }
          }
        },
        {
          opcode: 'readCell',
          blockType: 'reporter',
          text: '[ROW] 行 [COLUMN] 列の値を取得',
          arguments: {
            ROW: { type: 'number', defaultValue: 1 },
            COLUMN: { type: 'number', defaultValue: 1 }
          }
        }
      ]
    };
  }

  setSpreadsheet (args) {
    const url = args.URL;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      this.sheetId = match[1];
      return `スプレッドシートIDが設定されました：${this.sheetId}`;
    } else {
      return '無効なスプレッドシートURLです';
    }
  }

  async writeCell (args) {
    if (!this.sheetId) {
      return 'スプレッドシートが設定されていません';
    }

    const row = args.ROW;
    const col = args.COLUMN;
    const value = args.VALUE;
    const range = `Sheet1!${this.colToLetter(col)}${row}`;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${this.API_KEY}`;
    const body = { values: [[value]] };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        return 'セルへの書き込みに失敗しました';
      } else {
        return 'セルへの書き込みが成功しました';
      }
    } catch (error) {
      return 'エラーが発生しました';
    }
  }

  async readCell (args) {
    if (!this.sheetId) {
      return 'スプレッドシートが設定されていません';
    }

    const row = args.ROW;
    const col = args.COLUMN;
    const range = `Sheet1!${this.colToLetter(col)}${row}`;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?key=${this.API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return 'セルの読み取りに失敗しました';
      }

      const data = await response.json();
      return data.values ? data.values[0][0] : '';
    } catch (error) {
      return 'エラーが発生しました';
    }
  }

  colToLetter (col) {
    let letter = '';
    while (col > 0) {
      let temp = (col - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      col = (col - temp - 1) / 26;
    }
    return letter;
  }
}

module.exports = GoogleSheetsExtension;
