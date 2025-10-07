// Recipe data structure definitions

export const createEmptyRecipe = () => ({
  title: '',
  slug: '',
  description: '',
  prep_time: 0,
  cook_time: 0,
  image_url: '',
  instructions: [],
  ingredients: []
})

export const createEmptyIngredient = () => ({
  quantity: '',
  name: ''
})

// Helper function to generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}