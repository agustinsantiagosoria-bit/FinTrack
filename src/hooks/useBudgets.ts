
import { useEffect, useState } from 'react'
import type { Budget } from '../types/budgets'

const STORAGE_KEY = 'fintrack_budgets'

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const savedBudgets = localStorage.getItem(STORAGE_KEY)

      return savedBudgets
        ? JSON.parse(savedBudgets) as Budget[]
        : []
    } catch {
      return []
    }
  })

  // Guardar los presupuestos automáticamente
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(budgets)
    )
  }, [budgets])

  // Crear un presupuesto
  function addBudget(budget: Budget) {
    setBudgets((currentBudgets) => [
      budget,
      ...currentBudgets,
    ])
  }

  // Actualizar un presupuesto
  function updateBudget(updatedBudget: Budget) {
    setBudgets((currentBudgets) =>
      currentBudgets.map((budget) =>
        budget.id === updatedBudget.id
          ? updatedBudget
          : budget
      )
    )
  }

  // Eliminar un presupuesto
  function deleteBudget(id: string) {
    setBudgets((currentBudgets) =>
      currentBudgets.filter(
        (budget) => budget.id !== id
      )
    )
  }

  return {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
