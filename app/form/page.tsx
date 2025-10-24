'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Coordenador,
  RATING_DESCRIPTIONS,
  CompetenciaKey,
  FormState,
  AvaliacaoBase,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingScale } from '@/components/RatingScale';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type RawCoordenador = {
  regional: string;
  cadastro: number;
  nome: string;
  admissao: string | null;
  cpf: string | null;
  cargo: string | null;
  local: string | null;
  escola: string | null;
  horas_mes: string | null;
  horas_semana: string | null;
  tempo_casa_meses: number | null;
  total_carga_horaria_acumulada: number | null;
  horas_faltas_injustificadas: number | null;
  perc_faltas_injustificadas: number | null;
};

const escapeILike = (s: string) => s.replace(/[%_]/g, (m) => `\\${m}`).replace(/\s+/g, ' ').trim();

export default function Page() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [unidades, setUnidades] = useState<string[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  const [selectedUnidade, setSelectedUnidade] = useState('');
  const [coordenadores, setCoordenadores] = useState<Coordenador[]>([]);
  const [loadingCoords, setLoadingCoords] = useState(false);

  const [selectedCoord, setSelectedCoord] = useState<Coordenador | null>(null);

  const [form, setForm] = useState<FormState>({
    base: undefined,
    competencias: {},
  });

  // ====== Carregar Unidades (ESCOLA) ======
  useEffect(() => {
    (async () => {
      try {
        setLoadingUnidades(true);
        const { data, error } = await supabase
          .from('dados_coordenadores')
          .select('escola')
          .neq('escola', null)
          .order('escola', { ascending: true });

        if (error) throw error;

        const uniq = Array.from(new Set((data || []).map((r: any) => (r.escola || '').trim()))).filter(Boolean);
        setUnidades(uniq);
      } catch (err: any) {
        console.error(err);
        toast({
          title: 'Erro ao carregar unidades',
          description: err.message || 'Falha ao consultar dados_coordenadores.',
          variant: 'destructive',
        });
      } finally {
        setLoadingUnidades(false);
      }
    })();
  }, [toast]);

  // ====== Buscar coordenadores por unidade ======
  const fetchCoordenadores = async (unidade: string) => {
    setLoadingCoords(true);
    setSelectedCoord(null);
    try {
      const baseSelect =
        'regional, cadastro, nome, admissao, cpf, cargo, local, escola, horas_mes, horas_semana, tempo_casa_meses, total_carga_horaria_acumulada, horas_faltas_injustificadas, perc_faltas_injustificadas';

      // match exato
      let { data, error } = await supabase
        .from('dados_coordenadores')
        .select(baseSelect)
        .eq('escola', unidade)
        .order('nome', { ascending: true });

      if (error) throw error;

      // fallback: ILIKE
      if (!data || data.length === 0) {
        const pattern = `%${escapeILike(unidade)}%`;
        const { data: data2, error: error2 } = await supabase
          .from('dados_coordenadores')
          .select(baseSelect)
          .ilike('escola', pattern)
          .order('nome', { ascending: true });
        if (error2) throw error2;
        data = data2 ?? [];
      }

      const rows = (Array.isArray(data) ? data : []) as unknown as RawCoordenador[];

      const mapped: Coordenador[] = rows.map((r) => ({
        regional: r.regional ?? '',
        cadastro: String(r.cadastro ?? ''),
        nome: r.nome ?? '',
        admissao: r.admissao,
        cpf: r.cpf,
        cargo: r.cargo,
        local: r.local,
        escola: r.escola,
        horas_mes: r.horas_mes != null ? String(r.horas_mes) : null,
        horas_semana: r.horas_semana != null ? String(r.horas_semana) : null,
        tempo_casa_meses: r.tempo_casa_meses != null ? String(r.tempo_casa_meses) : null,
        total_carga_horaria_acumulada:
          r.total_carga_horaria_acumulada != null ? String(r.total_carga_horaria_acumulada) : null,
        horas_faltas_injustificadas:
          r.horas_faltas_injustificadas != null ? String(r.horas_faltas_injustificadas) : null,
        perc_faltas_injustificadas:
          r.perc_faltas_injustificadas != null ? String(r.perc_faltas_injustificadas) : null,
      }));

      setCoordenadores(mapped);
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao carregar coordenadores',
        description: err.message || 'Falha ao consultar dados_coordenadores.',
        variant: 'destructive',
      });
      setCoordenadores([]);
    } finally {
      setLoadingCoords(false);
    }
  };

  const handleUnidadeChange = (unidade: string) => {
    setSelectedUnidade(unidade);
    if (unidade) fetchCoordenadores(unidade);
  };

  const handleCoordChange = (cadastro: string) => {
    const c = coordenadores.find((p) => p.cadastro === cadastro) || null;
    setSelectedCoord(c);

    if (c) {
      const base: AvaliacaoBase = {
        unidade: selectedUnidade,
        regional: c.regional,
        cadastro: c.cadastro,
        nome: c.nome,
        admissao: c.admissao,
        cpf: c.cpf,
        cargo: c.cargo,
        local: c.local,
        escola: c.escola,
        horas_mes: c.horas_mes,
        horas_semana: c.horas_semana,
        tempo_casa_meses: c.tempo_casa_meses,
        total_carga_horaria_acumulada: c.total_carga_horaria_acumulada,
        horas_faltas_injustificadas: c.horas_faltas_injustificadas,
        perc_faltas_injustificadas: c.perc_faltas_injustificadas,
      };
      setForm({ base, competencias: {} });
    } else {
      setForm({ base: undefined, competencias: {} });
    }
  };

  // lista de chaves para iterar
  const competenciaKeys = useMemo<CompetenciaKey[]>(
    () => [
      'integridade_responsabilidade_publica',
      'promocao_cultura_organizacional',
      'gestao_administrativa_organizacional',
      'gestao_pessoas_relacionamento_intersetorial',
      'comunicacao_relacionamento_institucional',
      'tomada_decisao_analise_dados',
      'gestao_compras_orcamento',
      'gestao_infraestrutura_servicos',
      'controle_assiduidade_carga_horaria',
      'articulacao_pedagogica_resultados',
    ],
    []
  );

  const allAnswered = useMemo(() => {
    return competenciaKeys.every((k) => !!form.competencias?.[k]?.avaliacao);
  }, [form.competencias, competenciaKeys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoord || !form.base) {
      toast({
        title: 'Selecione um coordenador',
        description: 'É necessário escolher um coordenador antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    if (!allAnswered) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, atribua uma nota (1 a 4) em todas as competências.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        base: form.base,
        competencias: form.competencias,
      };

      const res = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Falha ao enviar avaliação.');
      }

      toast({
        title: 'Avaliação registrada',
        description: 'Os dados foram salvos e enviados para a planilha.',
      });

      // reset
      setSelectedUnidade('');
      setCoordenadores([]);
      setSelectedCoord(null);
      setForm({ base: undefined, competencias: {} });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao enviar',
        description: err.message || 'Falha ao registrar avaliação.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rede APOGEU</h1>
            <p className="text-sm text-gray-600">APG GOV — Avaliação de Coordenadores</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Etapa 1 — Seleção</CardTitle>
              <CardDescription>Escolha a unidade (escola) e o coordenador a ser avaliado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UNIDADE */}
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Select value={selectedUnidade} onValueChange={handleUnidadeChange}>
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder={loadingUnidades ? 'Carregando unidades...' : 'Escolha uma unidade'} />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                    {!loadingUnidades && unidades.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">Nenhuma unidade encontrada.</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* COORDENADOR */}
              <div className="space-y-2">
                <Label htmlFor="coord">Coordenador *</Label>
                <Select
                  value={selectedCoord?.cadastro || ''}
                  onValueChange={handleCoordChange}
                  disabled={!selectedUnidade || loadingCoords}
                >
                  <SelectTrigger id="coord">
                    <SelectValue placeholder={loadingCoords ? 'Carregando...' : 'Escolha um coordenador'} />
                  </SelectTrigger>
                  <SelectContent>
                    {coordenadores.map((c) => (
                      <SelectItem key={c.cadastro} value={c.cadastro}>
                        {c.nome} — {c.cargo ?? 'Sem cargo'} ({c.cadastro})
                      </SelectItem>
                    ))}
                    {!loadingCoords && coordenadores.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">Nenhum coordenador para esta unidade.</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* DADOS DO COORDENADOR */}
              {selectedCoord && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Regional</Label>
                    <Input value={selectedCoord.regional} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Cadastro</Label>
                    <Input value={selectedCoord.cadastro} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Admissão</Label>
                    <Input value={selectedCoord.admissao ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input value={selectedCoord.cpf ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input value={selectedCoord.cargo ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Local</Label>
                    <Input value={selectedCoord.local ?? ''} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Escola</Label>
                    <Input value={selectedCoord.escola ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas Mês</Label>
                    <Input value={selectedCoord.horas_mes ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas Semana</Label>
                    <Input value={selectedCoord.horas_semana ?? ''} readOnly />
                  </div>

                  {/* Infos adicionais */}
                  <div className="space-y-2">
                    <Label>Tempo de Casa (meses)</Label>
                    <Input value={selectedCoord.tempo_casa_meses ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Carga Horária Acumulada</Label>
                    <Input value={selectedCoord.total_carga_horaria_acumulada ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas de Faltas Injustificadas</Label>
                    <Input value={selectedCoord.horas_faltas_injustificadas ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>% Faltas Injustificadas</Label>
                    <Input value={selectedCoord.perc_faltas_injustificadas ?? ''} readOnly />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ETAPA 2 — AVALIAÇÃO POR COMPETÊNCIA */}
          {selectedCoord && (
            <Card>
              <CardHeader>
                <CardTitle>Etapa 2 — Avaliação por Competências</CardTitle>
                <CardDescription>
                  Atribua uma nota (1 a 4) em cada competência e descreva ações de desenvolvimento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {(
                  Object.entries(RATING_DESCRIPTIONS) as [CompetenciaKey, (typeof RATING_DESCRIPTIONS)[CompetenciaKey]][]
                ).map(([key, block]) => (
                  <div key={key} className="space-y-4 border rounded-lg p-4 bg-white">
                    <RatingScale
                      title={block.title}
                      question={block.question}
                      options={block.options}
                      value={form.competencias[key]?.avaliacao ?? null}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          competencias: {
                            ...prev.competencias,
                            [key]: { ...(prev.competencias[key] || {}), avaliacao: value as 1 | 2 | 3 | 4 },
                          },
                        }))
                      }
                      name={key}
                    />
                    <div className="space-y-2">
                      <Label>{block.development_actions.label}</Label>
                      <Textarea
                        placeholder="Descreva ações práticas, prazos e responsáveis..."
                        value={form.competencias[key]?.acoes_desenvolvimento ?? ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            competencias: {
                              ...prev.competencias,
                              [key]: { ...(prev.competencias[key] || {}), acoes_desenvolvimento: e.target.value },
                            },
                          }))
                        }
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* SUBMIT */}
          {selectedCoord && (
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={submitting || !allAnswered}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Avaliação'
                )}
              </Button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
