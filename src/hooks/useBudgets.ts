
import { useEffect, useState } from 'react'
import type { Budget } from '../types/budgets'
import { supabase } from '../lib/supabase'

interface BudgetRow {
  id: string
  user_id: string
  category: string
  month: string
  amount_limit: number
  created_at: string
}

function mapBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    category: row.category,
    month: row.month,
    limit: Number(row.amount_limit),
    createdAt: row.created_at,
  }
}

export function useBudgets(userId: string) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar presupuestos del usuario
  useEffect(() => {
    let mounted = true

    async function loadBudgets() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('month', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('Error al cargar presupuestos:', error.message)
        setError('No se pudieron cargar los presupuestos.')
        setLoading(false)
        return
      }

      setBudgets((data ?? []).map((row) =>
        mapBudget(row as BudgetRow)
      ))

      setLoading(false)
    }

    loadBudgets()

    return () => {
      mounted = false
    }
  }, [userId])

  // Crear un presupuesto
  async function addBudget(budget: Budget) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        id: budget.id,
        user_id: userId,
        category: budget.category,
        month: budget.month,
        amount_limit: budget.limit,
        created_at: budget.createdAt,
      })
      .select()
      .single()

    if (error) {
      console.error('Error al crear presupuesto:', error.message)
      throw error
    }

    setBudgets((current) => [
      mapBudget(data as BudgetRow),
      ...current,
    ])
  }

  // Actualizar un presupuesto
  async function updateBudget(updatedBudget: Budget) {
    const { data, error } = await supabase
      .from('budgets')
      .update({
        category: updatedBudget.category,
        month: updatedBudget.month,
        amount_limit: updatedBudget.limit,
      })
      .eq('id', updatedBudget.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar presupuesto:', error.message)
      throw error
    }

    setBudgets((current) =>
      current.map((budget) =>
        budget.id === updatedBudget.id
          ? mapBudget(data as BudgetRow)
          : budget
      )
    )
  }

  // Eliminar un presupuesto
  async function deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar presupuesto:', error.message)
      throw error
    }

    setBudgets((current) =>
      current.filter((budget) => budget.id !== id)
    )
  }

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
