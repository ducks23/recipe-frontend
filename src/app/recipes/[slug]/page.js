'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { recipeApi } from '../../../lib/api'

export default function RecipeDetail() {
  const params = useParams()
  const router = useRouter()
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

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeApi.deleteRecipe(recipe.slug)
        router.push('/')
      } catch (error) {
        console.error('Error deleting recipe:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Recipe not found</h1>
          <Link href="/" className="text-primary hover:text-primary/80 underline">
            Back to recipes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:text-primary/80 underline">
            ← Back to recipes
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="h-64 bg-muted overflow-hidden">
            {recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{recipe.title}</h1>
                <p className="text-muted-foreground text-lg">{recipe.description}</p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/recipes/${recipe.slug}/edit`}
                  className="btn-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">{recipe.prep_time}m</div>
                <div className="text-muted-foreground">Prep Time</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">{recipe.cook_time}m</div>
                <div className="text-muted-foreground">Cook Time</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">{recipe.prep_time + recipe.cook_time}m</div>
                <div className="text-muted-foreground">Total Time</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium text-primary mr-3">{ingredient.quantity}</span>
                      <span className="text-foreground">{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mr-4">
                        {index + 1}
                      </span>
                      <span className="text-foreground pt-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}