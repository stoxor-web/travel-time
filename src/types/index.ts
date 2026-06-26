export interface Trip {
  id: string
  userId: string
  title: string
  destination: string
  startDate: string
  endDate: string
  description: string
  budget: number
  currency: string
  coverImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface TripDay {
  id: string
  tripId: string
  dayNumber: number
  date: string
  activities: Activity[]
  notes: string
}

export interface Activity {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  category: string
  cost?: number
}

export interface Expense {
  id: string
  tripId: string
  description: string
  amount: number
  category: string
  date: string
  paidBy: string
}

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}
