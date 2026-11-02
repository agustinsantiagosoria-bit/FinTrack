export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  targetDate: string | null
  totalSaved: number
  createdAt: string
  contributions: SavingsContribution[]
}

export interface SavingsContribution {
  id: string
  goalId: string
  amount: number
  date: string
  description: string
  createdAt: string
}