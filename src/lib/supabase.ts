import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from('connection_test')
    .select('*')

  if (error && error.code !== '42P01') {
    console.error('Error de conexión:', error.message)
    return false
  }

  console.log('Conexión con Supabase establecida')
  return true
}