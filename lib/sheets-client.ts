// lib/sheets-client.ts
export type SheetsAppendPayload = {
  spreadsheetId: string;      // ex.: process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  sheetName: string;          // 'Respostas'
  rows: Record<string, any>[]; // 1 linha por competência
};

export async function sendToGoogleSheets(payload: SheetsAppendPayload): Promise<void> {
  const res = await fetch('/api/sheets/append', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sheets append failed: ${res.status} ${text}`);
  }
}
