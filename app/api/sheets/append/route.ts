// /app/api/sheets/append/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RATING_DESCRIPTIONS } from '@/types';

// === Google Sheets (Service Account) ===
async function getSheets() {
  const { google } = await import('googleapis');

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Credenciais do Service Account ausentes (GOOGLE_SHEETS_CLIENT_EMAIL/PRIVATE_KEY).');
  }

  // Se a PRIVATE_KEY vier com aspas e \n, normaliza:
  privateKey = privateKey
    .replace(/^"|"$/g, '')        // remove aspas no começo/fim se houver
    .replace(/\\n/g, '\n');       // converte \n em quebras reais

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

const SHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';
const SHEET_NAME = 'Respostas';

// ===== Helpers =====
function buildDbRows(competencias: any) {
  return Object.entries(competencias).map(([key, resp]: any) => {
    const block = (RATING_DESCRIPTIONS as any)[key];
    return {
      competencia: block?.title ?? key,
      descricao: block?.question ?? null,
      nivel_1: block?.options?.[0]?.description ?? null,
      nivel_2: block?.options?.[1]?.description ?? null,
      nivel_3: block?.options?.[2]?.description ?? null,
      nivel_4: block?.options?.[3]?.description ?? null,
      avaliacao: resp?.avaliacao ?? null,
      acoes_desenvolvimento: resp?.acoes_desenvolvimento ?? null,
    };
  });
}

function buildSheetRows(base: any, dbRows: any[]) {
  return dbRows.map((r) => ({
    data_envio: new Date().toISOString(),
    unidade: base.unidade ?? '',
    regional: base.regional ?? '',
    cadastro: base.cadastro ?? '',
    nome: base.nome ?? '',
    admissao: base.admissao ?? '',
    cpf: base.cpf ?? '',
    cargo: base.cargo ?? '',
    local: base.local ?? '',
    escola: base.escola ?? '',
    horas_mes: base.horas_mes ?? '',
    horas_semana: base.horas_semana ?? '',
    tempo_casa_meses: base.tempo_casa_meses ?? '',
    total_carga_horaria_acumulada: base.total_carga_horaria_acumulada ?? '',
    horas_faltas_injustificadas: base.horas_faltas_injustificadas ?? '',
    perc_faltas_injustificadas: base.perc_faltas_injustificadas ?? '',
    competencia: r.competencia,
    pergunta: r.descricao,
    nivel_1: r.nivel_1,
    nivel_2: r.nivel_2,
    nivel_3: r.nivel_3,
    nivel_4: r.nivel_4,
    avaliacao: r.avaliacao,
    acoes_desenvolvimento: r.acoes_desenvolvimento ?? '',
  }));
}

// Ordene exatamente como está a aba "Respostas"
const SHEET_HEADER = [
  'data_envio','unidade','regional','cadastro','nome','admissao','cpf','cargo','local','escola',
  'horas_mes','horas_semana','tempo_casa_meses','total_carga_horaria_acumulada',
  'horas_faltas_injustificadas','perc_faltas_injustificadas',
  'competencia','pergunta','nivel_1','nivel_2','nivel_3','nivel_4','avaliacao','acoes_desenvolvimento'
];

async function appendRowsToGoogleSheets(spreadsheetId: string, sheetName: string, rows: Record<string, any>[]) {
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID ausente.');

  const sheets = await getSheets();
  const values = rows.map((r) => SHEET_HEADER.map((h) => (r[h] ?? '')));

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

// ===== Handler =====
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Aceita dois formatos:
    // (A) { base, competencias }  ← vindo do seu page.tsx
    // (B) { spreadsheetId, sheetName, rows } ← envio batch opcional
    if (body?.base && body?.competencias) {
      const { base, competencias } = body;

      // 1) Insere no Supabase (apenas colunas existentes)
      const dbRows = buildDbRows(competencias);
      const { error } = await supabase.from('competencias_avaliacao').insert(dbRows);
      if (error) {
        console.error('[Supabase] insert error', error);
        return new NextResponse(`Erro ao inserir no Supabase: ${error.message}`, { status: 500 });
      }

      // 2) Envia ao Sheets (1 linha por competência)
      const sheetRows = buildSheetRows(base, dbRows);
      try {
        await appendRowsToGoogleSheets(SHEET_ID, SHEET_NAME, sheetRows);
      } catch (e: any) {
        console.error('[Sheets] append error', e);
        // não bloqueia o fluxo (mas avisa)
        return NextResponse.json({ ok: true, inserted: dbRows.length, sheet_error: e?.message || String(e) });
      }

      return NextResponse.json({ ok: true, inserted: dbRows.length, appended: sheetRows.length });
    }

    if (body?.spreadsheetId && body?.sheetName && Array.isArray(body?.rows)) {
      await appendRowsToGoogleSheets(body.spreadsheetId, body.sheetName, body.rows);
      return NextResponse.json({ ok: true, appended: body.rows.length });
    }

    return new NextResponse('Payload inválido. Envie { base, competencias } ou { spreadsheetId, sheetName, rows }.', { status: 400 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || 'Erro interno.', { status: 500 });
  }
}
