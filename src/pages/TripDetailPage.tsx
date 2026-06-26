import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../config/firebase'
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Trip, Expense } from '../types'
import { ArrowLeft, Plus, Trash2, Edit2, DollarSign, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const TripDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'Logement',
    paidBy: ''
  })

  useEffect(() => {
    if (id) {
      fetchTrip()
      fetchExpenses()
    }
  }, [id])

  const fetchTrip = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'trips', id!))
      if (docSnap.exists()) {
        setTrip({
          ...docSnap.data(),
          id: docSnap.id,
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        } as Trip)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const q = query(
        collection(db, 'expenses'),
        where('tripId', '==', id)
      )
      const snapshot = await getDocs(q)
      setExpenses(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Expense)))
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await addDoc(collection(db, 'expenses'), {
        tripId: id,
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      })
      setExpenseForm({ description: '', amount: '', category: 'Logement', paidBy: '' })
      setShowExpenseForm(false)
      fetchExpenses()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const deleteExpense = async (expenseId: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId))
      fetchExpenses()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Voyage non trouvé</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Retourner au dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remainingBudget = trip.budget - totalSpent
  const days = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
              <p className="text-gray-600">{trip.destination}</p>
            </div>
            <button
              onClick={() => navigate(`/trips/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Modifier
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Trip Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Durée</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{days} jours</p>
            <p className="text-sm text-gray-600">
              {format(new Date(trip.startDate), 'd MMM', { locale: fr })} - {format(new Date(trip.endDate), 'd MMM yyyy', { locale: fr })}
            </p>
          </div>

          {/* Budget Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Budget</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {trip.budget.toFixed(2)} {trip.currency}
            </p>
            <p className="text-sm text-gray-600">Total alloué</p>
          </div>

          {/* Spending Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Dépensé</span>
            </div>
            <p className={`text-2xl font-bold mb-1 ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalSpent.toFixed(2)} {trip.currency}
            </p>
            <p className={`text-sm ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {remainingBudget < 0 ? 'Dépassement' : 'Restant'}: {remainingBudget.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">À propos du voyage</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{trip.description}</p>
          </div>
        )}

        {/* Expenses Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Dépenses</h2>
            <button
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter une dépense
            </button>
          </div>

          {/* Expense Form */}
          {showExpenseForm && (
            <form onSubmit={handleAddExpense} className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Montant"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Logement</option>
                  <option>Transport</option>
                  <option>Nourriture</option>
                  <option>Activités</option>
                  <option>Autres</option>
                </select>
                <input
                  type="text"
                  placeholder="Payé par"
                  value={expenseForm.paidBy}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Expenses List */}
          {expenses.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucune dépense enregistrée</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                        {expense.category[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <div className="flex gap-3 text-sm text-gray-600">
                          <span>{expense.category}</span>
                          {expense.paidBy && <span>Payé par {expense.paidBy}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">
                      {expense.amount.toFixed(2)} {trip.currency}
                    </p>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
