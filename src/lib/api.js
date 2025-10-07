// API functions for CRUD operations
// In a real app, these would make actual HTTP requests to your backend

let recipes = []
let nextId = 1

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const recipeApi = {
  // Get all recipes
  async getAllRecipes() {
    await delay(300)
    return recipes
  },

  // Get recipe by slug
  async getRecipeBySlug(slug) {
    await delay(300)
    return recipes.find(recipe => recipe.slug === slug) || null
  },

  // Create new recipe
  async createRecipe(recipeData) {
    await delay(500)
    const newRecipe = {
      id: nextId++,
      ...recipeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    recipes.push(newRecipe)
    return newRecipe
  },

  // Update existing recipe
  async updateRecipe(slug, recipeData) {
    await delay(500)
    const recipeIndex = recipes.findIndex(recipe => recipe.slug === slug)
    if (recipeIndex === -1) {
      throw new Error('Recipe not found')
    }

    const updatedRecipe = {
      ...recipes[recipeIndex],
      ...recipeData,
      updated_at: new Date().toISOString()
    }
    recipes[recipeIndex] = updatedRecipe
    return updatedRecipe
  },

  // Delete recipe
  async deleteRecipe(slug) {
    await delay(500)
    const recipeIndex = recipes.findIndex(recipe => recipe.slug === slug)
    if (recipeIndex === -1) {
      throw new Error('Recipe not found')
    }

    const deletedRecipe = recipes[recipeIndex]
    recipes = recipes.filter(recipe => recipe.slug !== slug)
    return deletedRecipe
  },

  // Search recipes
  async searchRecipes(query) {
    await delay(300)
    if (!query) return recipes

    const searchTerm = query.toLowerCase()
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm)
      )
    )
  }
}

// Initialize with sample data
import { sampleRecipes } from './mockData'
recipes = sampleRecipes.map((recipe, index) => ({
  ...recipe,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}))
nextId = Math.max(...recipes.map(r => r.id)) + 1