/**
 * Serviço de persistência de projetos com Supabase + localStorage fallback.
 *
 * Para ativar o Supabase, execute a seguinte SQL no painel do Supabase:
 *
 * CREATE TABLE IF NOT EXISTS projetos (
 *   id           TEXT PRIMARY KEY,
 *   user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   name         TEXT NOT NULL,
 *   usuario      TEXT,
 *   data_criacao TIMESTAMPTZ DEFAULT now(),
 *   Q            NUMERIC,
 *   status       TEXT,
 *   input_data   JSONB,
 *   result_data  JSONB,
 *   reservoir_data JSONB
 * );
 *
 * ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Usuário vê só seus projetos" ON projetos
 *   FOR ALL USING (auth.uid() = user_id);
 */

import { supabase } from '@/integrations/supabase/client';

export interface SavedProject {
  id: string;
  name: string;
  usuario: string;
  data_criacao: string;
  Q: number;
  status?: string;
  inputData?: unknown;
  resultData?: unknown;
  reservoirData?: unknown;
}

const LOCAL_KEY = 'savedProjects';

// ── Supabase helpers ───────────────────────────────────────────────────────────

async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

async function saveToSupabase(project: SavedProject): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('[Projects] saveToSupabase: usuário não autenticado');
      return false;
    }
    console.log('[Projects] saveToSupabase: salvando projeto', project.id, 'para user_id:', userId);

    const { error } = await supabase.from('projetos').upsert({
      id: project.id,
      user_id: userId,
      name: project.name,
      usuario: project.usuario,
      data_criacao: project.data_criacao,
      q: project.Q,
      status: project.status,
      input_data: project.inputData ?? null,
      result_data: project.resultData ?? null,
      reservoir_data: project.reservoirData ?? null,
    });

    if (error) {
      console.warn('[Projects] Supabase save error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Projects] Supabase save exception:', e);
    return false;
  }
}

async function loadFromSupabase(): Promise<SavedProject[] | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('[Projects] loadFromSupabase: usuário não autenticado');
      return null;
    }
    console.log('[Projects] loadFromSupabase: buscando projetos para user_id:', userId);

    const { data, error } = await supabase
      .from('projetos')
      .select('id, name, usuario, data_criacao, q, status, input_data, result_data, reservoir_data')
      .eq('user_id', userId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.warn('[Projects] Supabase load error:', error.message);
      return null;
    }

    console.log('[Projects] Supabase retornou', (data ?? []).length, 'projeto(s)');
    return (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      usuario: r.usuario,
      data_criacao: r.data_criacao,
      Q: r.q,
      status: r.status,
      inputData: r.input_data,
      resultData: r.result_data,
      reservoirData: r.reservoir_data,
    }));
  } catch (e) {
    console.warn('[Projects] Supabase load exception:', e);
    return null;
  }
}

async function deleteFromSupabase(id: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.warn('[Projects] Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Projects] Supabase delete exception:', e);
    return false;
  }
}

// ── localStorage helpers ───────────────────────────────────────────────────────

function loadFromLocal(): SavedProject[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToLocal(projects: SavedProject[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(projects));
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function saveProject(project: SavedProject): Promise<{ cloudSaved: boolean }> {
  // Sempre salva no localStorage como fallback imediato
  const local = loadFromLocal();
  const idx = local.findIndex(p => p.id === project.id);
  if (idx >= 0) local[idx] = project;
  else local.unshift(project);
  saveToLocal(local);

  // Aguarda resultado do Supabase para informar o chamador
  const cloudSaved = await saveToSupabase(project);
  if (cloudSaved) {
    console.log('[Projects] Salvo no Supabase:', project.id);
  } else {
    console.warn('[Projects] Projeto salvo apenas localmente (Supabase indisponível ou usuário não autenticado)');
  }
  return { cloudSaved };
}

export async function loadProjects(): Promise<{ projects: SavedProject[]; fromCloud: boolean }> {
  const remote = await loadFromSupabase();
  if (remote !== null) {
    saveToLocal(remote);
    return { projects: remote, fromCloud: true };
  }
  return { projects: loadFromLocal(), fromCloud: false };
}

export async function deleteProject(id: string): Promise<void> {
  // Remove do localStorage
  const local = loadFromLocal().filter(p => p.id !== id);
  saveToLocal(local);

  // Remove do Supabase
  deleteFromSupabase(id);
}

export function loadProjectById(id: string): SavedProject | null {
  return loadFromLocal().find(p => p.id === id) ?? null;
}

export async function loadProjectByIdAsync(id: string): Promise<SavedProject | null> {
  try {
    const userId = await getCurrentUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('projetos')
        .select('id, name, usuario, data_criacao, q, status, input_data, result_data, reservoir_data')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        const project: SavedProject = {
          id: data.id,
          name: data.name,
          usuario: data.usuario,
          data_criacao: data.data_criacao,
          Q: data.q,
          status: data.status,
          inputData: data.input_data,
          resultData: data.result_data,
          reservoirData: data.reservoir_data,
        };
        return project;
      }
    }
  } catch (e) {
    console.warn('[Projects] loadProjectByIdAsync Supabase error:', e);
  }
  return loadFromLocal().find(p => p.id === id) ?? null;
}
