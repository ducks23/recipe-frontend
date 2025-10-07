'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import RecipeForm from '../../../../components/RecipeForm'
import { recipeApi } from '../../../../lib/api'

export default function EditRecipe() {
  const params = useParams()
  const { slug } = params
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      if (slug) {
        try {
          const data = await recipeApi.getRecipeBySlug(slug)
          setRecipe(data)
        } catch (error) {
          console.error('Error fetching recipe:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchRecipe()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        </div>
      </div>
    )
  }

  return <RecipeForm recipe={recipe} isEditing={true} />
}