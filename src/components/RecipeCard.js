import Link from 'next/link'

export default function RecipeCard({ recipe }) {
  return (
    <div className="card">
      <div className="h-48 bg-muted overflow-hidden">
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{recipe.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span>Prep: {recipe.prep_time}m</span>
          <span>Cook: {recipe.cook_time}m</span>
          <span>Total: {recipe.prep_time + recipe.cook_time}m</span>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/recipes/${recipe.slug}`}
            className="btn-primary flex-1 text-center"
          >
            View Recipe
          </Link>
          <Link
            href={`/recipes/${recipe.slug}/edit`}
            className="btn-secondary"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}