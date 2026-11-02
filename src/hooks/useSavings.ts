
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type {
  SavingsGoal,
  SavingsContribution,
} from '../types/savings'

interface SavingsGoalRow {
  id: string
  user_id: string
  name: string
  target_amount: number
  target_date: string | null
  created_at: string
}

interface SavingsContributionRow {
  id: string
  user_id: string
  goal_id: string
  amount: number
  date: string
  description: string
  created_at: string
}

function mapContribution(
  row: SavingsContributionRow
): SavingsContribution {
  return {
    id: row.id,
    goalId: row.goal_id,
    amount: Number(row.amount),
    date: row.date,
    description: row.description ?? '',
    createdAt: row.created_at,
  }
}

export function useSavings(userId: string) {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadSavings() {
      setLoading(true)
      setError(null)
      setGoals([])

      const [goalsResult, contributionsResult] = await Promise.all([
        supabase
          .from('savings_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),

        supabase
          .from('savings_contributions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false }),
      ])

      if (!mounted) return

      if (goalsResult.error || contributionsResult.error) {
        console.error(
          'Error al cargar ahorros:',
          goalsResult.error?.message ?? contributionsResult.error?.message
        )
        setError('No se pudieron cargar los ahorros.')
        setLoading(false)
        return
      }

      const contributions = (
        contributionsResult.data ?? []
      ).map((row) =>
        mapContribution(row as SavingsContributionRow)
      )

      const loadedGoals = (
        goalsResult.data ?? []
      ).map((row) => {
        const goalRow = row as SavingsGoalRow

        const goalContributions = contributions.filter(
          (contribution) => contribution.goalId === goalRow.id
        )

        return {
          id: goalRow.id,
          name: goalRow.name,
          targetAmount: Number(goalRow.target_amount),
          targetDate: goalRow.target_date,
          totalSaved: goalContributions.reduce(
            (total, contribution) => total + contribution.amount,
            0
          ),
          createdAt: goalRow.created_at,
          contributions: goalContributions,
        }
      })

      setGoals(loadedGoals)
      setLoading(false)
    }

    loadSavings()

    return () => {
      mounted = false
    }
  }, [userId])

  async function addGoal(
    name: string,
    targetAmount: number,
    targetDate: string | null
  ) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        name: name.trim(),
        target_amount: targetAmount,
        target_date: targetDate || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error al crear meta:', error.message)
      throw error
    }

    const newGoal: SavingsGoal = {
      id: data.id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      targetDate: data.target_date,
      totalSaved: 0,
      createdAt: data.created_at,
      contributions: [],
    }

    setGoals((current) => [newGoal, ...current])
  }

  async function addContribution(
    goalId: string,
    amount: number,
    date: string,
    description: string
  ) {
    const { data, error } = await supabase
      .from('savings_contributions')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        goal_id: goalId,
        amount,
        date,
        description: description.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error al registrar aporte:', error.message)
      throw error
    }

    const newContribution = mapContribution(
      data as SavingsContributionRow
    )

    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              totalSaved: goal.totalSaved + newContribution.amount,
              contributions: [
                newContribution,
                ...goal.contributions,
              ].sort((a, b) => b.date.localeCompare(a.date)),
            }
          : goal
      )
    )
  }

  async function deleteContribution(
    goalId: string,
    contributionId: string
  ) {
    const { error } = await supabase
      .from('savings_contributions')
      .delete()
      .eq('id', contributionId)
      .eq('goal_id', goalId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar aporte:', error.message)
      throw error
    }

    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== goalId) return goal

        const contributions = goal.contributions.filter(
          (item) => item.id !== contributionId
        )

        return {
          ...goal,
          contributions,
          totalSaved: contributions.reduce(
            (total, item) => total + item.amount,
            0
          ),
        }
      })
    )
  }

  async function deleteGoal(goalId: string) {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error al eliminar meta:', error.message)
      throw error
    }

    setGoals((current) =>
      current.filter((goal) => goal.id !== goalId)
    )
  }

  return {
    goals,
    loading,
    error,
    addGoal,
    addContribution,
    deleteContribution,
    deleteGoal,
  }
}
