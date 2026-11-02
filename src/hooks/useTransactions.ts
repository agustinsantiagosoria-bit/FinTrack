
import { useEffect, useState } from 'react'
import type { Transaction } from '../types/transaction'

const STORAGE_KEY = 'fintrack_transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY)

      return savedTransactions
        ? JSON.parse(savedTransactions) as Transaction[]
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    )
  }, [transactions])

  // Agregar un movimiento
  function addTransaction(transaction: Transaction) {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions,
    ])
  }

  // Editar un movimiento
  function updateTransaction(updatedTransaction: Transaction) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    )
  }

  // Eliminar un movimiento
  function deleteTransaction(id: string) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    )
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
