
import { useEffect, useState } from 'react'
import type { Category, CategoryType } from '../types/category'

const STORAGE_KEY = 'fintrack_categories'

const initialCategories: Category[] = [
  ...['Trabajo', 'Ventas', 'Inversiones', 'Otros ingresos'].map((name) => ({
    id: crypto.randomUUID(),
    name,
    type: 'income' as CategoryType,
    createdAt: new Date().toISOString(),
  })),
  ...[
    'Alimentación',
    'Transporte',
    'Servicios',
    'Salud',
    'Entretenimiento',
    'Compras',
    'Otros gastos',
  ].map((name) => ({
    id: crypto.randomUUID(),
    name,
    type: 'expense' as CategoryType,
    createdAt: new Date().toISOString(),
  })),
]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) as Category[] : initialCategories
    } catch {
      return initialCategories
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  function addCategory(name: string, type: CategoryType) {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      createdAt: new Date().toISOString(),
    }

    setCategories((current) => [...current, newCategory])
  }

  function deleteCategory(id: string) {
    setCategories((current) =>
      current.filter((category) => category.id !== id)
    )
  }

  return {
    categories,
    addCategory,
    deleteCategory,
  }
}
