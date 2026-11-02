
import { useEffect, useState } from 'react'
import type { Category, CategoryType } from '../types/category'
import { supabase } from '../lib/supabase'

interface CategoryRow {
  id: string
  user_id: string
  name: string
  type: CategoryType
  created_at: string
}

const initialCategories: {
  name: string
  type: CategoryType
}[] = [
  { name: 'Trabajo', type: 'income' },
  { name: 'Ventas', type: 'income' },
  { name: 'Inversiones', type: 'income' },
  { name: 'Otros ingresos', type: 'income' },
  { name: 'Alimentación', type: 'expense' },
  { name: 'Transporte', type: 'expense' },
  { name: 'Servicios', type: 'expense' },
  { name: 'Salud', type: 'expense' },
  { name: 'Entretenimiento', type: 'expense' },
  { name: 'Compras', type: 'expense' },
  { name: 'Otros gastos', type: 'expense' },
]

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    createdAt: row.created_at,
  }
}

export function useCategories(userId: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar las categorías del usuario
  useEffect(() => {
    let mounted = true

    async function loadCategories() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (!mounted) return

      if (error) {
        console.error('Error al cargar categorías:', error.message)
        setError('No se pudieron cargar las categorías.')
        setLoading(false)
        return
      }

      // Crear las categorías predeterminadas si el usuario todavía no tiene
      if (!data || data.length === 0) {
        const defaults = initialCategories.map((category) => ({
          id: crypto.randomUUID(),
          user_id: userId,
          name: category.name,
          type: category.type,
        }))

        const { error: insertError } = await supabase
          .from('categories')
          .upsert(defaults, {
            onConflict: 'user_id,name,type',
            ignoreDuplicates: true,
          })

        if (!mounted) return

        if (insertError) {
          console.error(
            'Error al crear categorías predeterminadas:',
            insertError.message
          )
          setError('No se pudieron crear las categorías iniciales.')
          setLoading(false)
          return
        }
      }

      // Obtener las categorías definitivas
      const { data: finalData, error: finalError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (!mounted) return

      if (finalError) {
        console.error('Error al recuperar categorías:', finalError.message)
        setError('No se pudieron recuperar las categorías.')
        setLoading(false)
        return
      }

      setCategories((finalData ?? []).map((row) =>
        mapCategory(row as CategoryRow)
      ))
      setLoading(false)
    }

    loadCategories()

    return () => {
      mounted = false
    }
  }, [userId])

  // Agregar una categoría
  async function addCategory(name: string, type: CategoryType) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        name: name.trim(),
        type,
      })
      .select()
      .single()

    if (error) {
      console.error('Error al agregar categoría:', error.message)
      throw error
    }

    setCategories((current) => [
      ...current,
      mapCategory(data as CategoryRow),
    ])
  }

  // Eliminar una categoría
  async function deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar categoría:', error.message)
      throw error
    }

    setCategories((current) =>
      current.filter((category) => category.id !== id)
    )
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
  }
}
