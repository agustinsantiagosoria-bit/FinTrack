
import { useEffect, useState } from 'react'
import type { Transaction } from '../types/transaction'
import { supabase } from '../lib/supabase'

interface TransactionRow {
  id: string
  user_id: string
  type: 'income' | 'expense'
  description: string
  category: string
  amount: number
  date: string
  created_at: string
}

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    category: row.category,
    amount: Number(row.amount),
    date: row.date,
    createdAt: row.created_at,
  }
}

function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date)
  )
}

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener los movimientos del usuario
  useEffect(() => {
    let mounted = true

async function loadTransactions() {
  setLoading(true)
  setError(null)
  setTransactions([])

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('Error al cargar movimientos:', error.message)
        setError('No se pudieron cargar los movimientos.')
        setLoading(false)
        return
      }

      setTransactions((data ?? []).map((row) =>
        mapTransaction(row as TransactionRow)
      ))
      setLoading(false)
    }

    loadTransactions()

    return () => {
      mounted = false
    }
  }, [userId])

  // Agregar un movimiento
  async function addTransaction(transaction: Transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        id: transaction.id,
        user_id: userId,
        type: transaction.type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        created_at: transaction.createdAt,
      })
      .select()
      .single()

    if (error) {
      console.error('Error al agregar movimiento:', error.message)
      throw error
    }
setTransactions((current) =>
  sortTransactions([
    ...current,
    mapTransaction(data as TransactionRow),
  ])
)
  }

  // Editar un movimiento
  async function updateTransaction(updatedTransaction: Transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        type: updatedTransaction.type,
        description: updatedTransaction.description,
        category: updatedTransaction.category,
        amount: updatedTransaction.amount,
        date: updatedTransaction.date,
      })
      .eq('id', updatedTransaction.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error al editar movimiento:', error.message)
      throw error
    }

setTransactions((current) =>
  sortTransactions(
    current.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? mapTransaction(data as TransactionRow)
        : transaction
    )
  )
)
  }

  // Eliminar un movimiento
  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar movimiento:', error.message)
      throw error
    }

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    )
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
