/**
 * Clés Supabase : Project Settings → API Keys
 * - supabaseUrl : Project URL (https://xxx.supabase.co)
 * - supabaseAnonKey : clé **anon** legacy (eyJ...) OU **publishable** (sb_publishable_...)
 *   ⚠️ N'utilise JAMAIS la clé secret / service_role ici !
 */
Object.assign(window.STEPFISH_CONFIG || {}, {
    supabaseUrl: 'https://rrlczghwqmzmyfmxgqil.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybGN6Z2h3cW16bXlmbXhncWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDE4NDQsImV4cCI6MjA5NTMxNzg0NH0.q1iSexsDCrQ2kUXZQBdEPgOBzTvDRiDGP4eeA58pKiA'
});
