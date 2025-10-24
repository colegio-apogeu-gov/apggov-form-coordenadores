// app/api/avaliacao-coordenadores/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RATING_DESCRIPTIONS } from '@/types';
import { sendToGoogleSheets } from '@/lib/sheets-client';

// Espera receber: { base: AvaliacaoBase, competencias: Record<CompetenciaKey, { avaliacao: 1|2|3|4, acoes_desenvolvimento?: string }> }
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const base = body?.base;
    const competencias = body?.competencias;

    if (!base || !competencias) {
      return new NextResponse('Payload inválido.', { status: 400 });
    }

    // Monta linhas para Supabase (uma por competência)
    const rows = Object.entries(competencias).map(([key, resp]: any) => {
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
        // campos de contexto úteis para análises futuras (opcional)
        contexto_unidade: base.unidade ?? null,
        contexto_regional: base.regional ?? null,
        contexto_cadastro: base.cadastro ?? null,
        contexto_nome: base.nome ?? null,
        contexto_escola: base.escola ?? null,
      };
    });

    // Insere no Supabase — tabela competencias_avaliacao
    const { error: insertError } = await supabase.from('competencias_avaliacao').insert(rows);
    if (insertError) {
      console.error(insertError);
      return new NextResponse(`Erro ao inserir no Supabase: ${insertError.message}`, { status: 500 });
    }

    // Enviar para Google Sheets (form-apggov-coordenadores / aba 'Respostas')
    // Estrutura: uma linha por competência (repete identificação)
    const sheetRows = rows.map((r) => ({
      planilha: 'form-apggov-coordenadores',
      aba: 'Respostas',
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

    try {
      // Observação: assumindo que o helper aceita { spreadsheet, sheet, rows } OU um objeto por linha.
      // Caso seu helper aceite apenas um objeto, você pode enviar individualmente em um loop.
      await sendToGoogleSheets({
        spreadsheet: 'form-apggov-coordenadores',
        sheet: 'Respostas',
        rows: sheetRows,
      });
    } catch (sheetsErr: any) {
      console.error('Erro ao enviar para Google Sheets:', sheetsErr);
      // Não falha a requisição por erro de Sheets (mas loga).
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || 'Erro interno.', { status: 500 });
  }
}
