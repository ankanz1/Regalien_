interface SupabaseErrorLike {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
}

export const describeSupabaseError = (error: SupabaseErrorLike, moduleName: string): string => {
  if (error.code === '42P01' || error.code === '42703') {
    return `${moduleName} is unavailable because the Supabase schema is missing a required table or column.`;
  }
  if (error.code === '42501' || /row-level security|permission denied/i.test(error.message)) {
    return `${moduleName} is unavailable because Supabase denied access. Check the authenticated role and RLS policies.`;
  }
  if (/failed to fetch|network|fetch/i.test(error.message)) {
    return `${moduleName} could not connect to Supabase. Check the project URL, key, and network connection.`;
  }
  return `${moduleName} request failed: ${error.message}`;
};

export const isMissingSchemaError = (error: SupabaseErrorLike | null | undefined): boolean =>
  Boolean(error && (error.code === '42P01' || error.code === '42703'));
