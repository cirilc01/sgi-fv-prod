import { supabase } from './supabase';
import { Organization } from './types';

type PostgrestErrorLike = {
  message?: string;
  code?: string;
};

const configuredSchema = import.meta.env.VITE_SUPABASE_ORG_SCHEMA?.trim();
const configuredTable = import.meta.env.VITE_SUPABASE_ORG_TABLE?.trim() || 'banco';

const candidateSchemas = Array.from(new Set([configuredSchema, 'public'].filter(Boolean))) as string[];
const candidateNameColumns = ['nome', 'name', 'razao_social'];

const toOrganization = (row: Record<string, unknown>): Organization | null => {
  const idValue = row.id;

  if (idValue === null || idValue === undefined) {
    return null;
  }

  const organizationName = candidateNameColumns
    .map((column) => row[column])
    .find((value) => typeof value === 'string' && value.trim().length > 0) as string | undefined;

  return {
    id: String(idValue),
    name: organizationName ?? `Organização ${idValue}`,
  };
};

const isSchemaCacheError = (error: PostgrestErrorLike | null | undefined) =>
  error?.code === 'PGRST205' || error?.message?.includes('schema cache');

export const loadOrganizations = async () => {
  let lastError: PostgrestErrorLike | null = null;

  for (const schema of candidateSchemas) {
    const { data, error } = await supabase
      .schema(schema)
      .from(configuredTable)
      .select('*')
      .limit(300);

    if (error) {
      lastError = error;
      continue;
    }

    const organizations = (data ?? [])
      .map((row) => toOrganization(row as Record<string, unknown>))
      .filter((value): value is Organization => Boolean(value))
      .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));

    return { organizations, resolvedSchema: schema, error: null as PostgrestErrorLike | null };
  }

  return { organizations: [], resolvedSchema: null, error: lastError };
};

export const createOrganization = async (organizationName: string) => {
  const normalizedName = organizationName.trim();

  if (!normalizedName) {
    return { organization: null, resolvedSchema: null, error: { message: 'Nome da organização é obrigatório.' } };
  }

  let lastError: PostgrestErrorLike | null = null;

  for (const schema of candidateSchemas) {
    for (const nameColumn of candidateNameColumns) {
      const payload: Record<string, unknown> = { [nameColumn]: normalizedName };

      const { data, error } = await supabase
        .schema(schema)
        .from(configuredTable)
        .insert([payload])
        .select('*')
        .single();

      if (error) {
        lastError = error;
        continue;
      }

      const organization = toOrganization((data ?? {}) as Record<string, unknown>);

      if (!organization) {
        return {
          organization: null,
          resolvedSchema: schema,
          error: { message: 'Registro criado, mas sem campo id.' },
        };
      }

      return { organization, resolvedSchema: schema, error: null as PostgrestErrorLike | null };
    }
  }

  return { organization: null, resolvedSchema: null, error: lastError };
};

export const buildOrganizationErrorMessage = (error: PostgrestErrorLike | null | undefined) => {
  if (!error) {
    return 'Não foi possível processar organizações.';
  }

  if (isSchemaCacheError(error)) {
    return `Não foi encontrada a tabela ${configuredTable} no schema esperado. Configure VITE_SUPABASE_ORG_SCHEMA com o schema correto no Vercel.`;
  }

  return error.message ?? 'Erro inesperado ao processar organizações.';
};
