"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createEmptyRecipe,
  createEmptyIngredient,
  generateSlug,
} from "../lib/types";
import { recipeApi } from "../lib/api";
import { uploadImageToS3 } from "../lib/s3Upload";

export default function RecipeForm({
  recipe: initialRecipe,
  isEditing = false,
}) {
  const router = useRouter();
  const [recipe, setRecipe] = useState(initialRecipe || createEmptyRecipe());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    initialRecipe?.image_url || "",
  );
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setRecipe((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !isEditing ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, createEmptyIngredient()],
    }));
  };

  const removeIngredient = (index) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe((prev) => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToS3(file);
      setRecipe((prev) => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setRecipe((prev) => ({ ...prev, image_url: "" }));
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await recipeApi.updateRecipe(recipe.slug, recipe);
        router.push(`/recipes/${recipe.slug}`);
      } else {
        const newRecipe = await recipeApi.createRecipe(recipe);
        router.push(`/recipes/${newRecipe.slug}`);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 underline"
          >
            ← Back
          </button>
        </div>

        <div className="card p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={recipe.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={recipe.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="input-field"
                  placeholder="auto-generated from title"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={recipe.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  value={recipe.prep_time}
                  onChange={(e) =>
                    handleInputChange(
                      "prep_time",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cook Time (minutes)
                </label>
                <input
                  type="number"
                  value={recipe.cook_time}
                  onChange={(e) =>
                    handleInputChange(
                      "cook_time",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="input-field"
                  min="0"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipe Image
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer transition-colors ${
                        isUploading
                          ? "bg-muted cursor-not-allowed"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add Photo
                        </>
                      )}
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="inline-flex items-center px-3 py-2 border border-destructive text-sm font-medium rounded-md text-destructive bg-background hover:bg-destructive/10 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Recipe preview"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  <input
                    type="url"
                    value={recipe.image_url}
                    onChange={(e) => {
                      handleInputChange("image_url", e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Or enter image URL manually"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">Ingredients</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn-success"
                >
                  Add Ingredient
                </button>
              </div>

              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="w-1/4">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 2 cups"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantity",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Ingredient
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., flour"
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Instructions
                </h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="btn-success"
                >
                  Add Step
                </button>
              </div>

              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mt-2">
                      {index + 1}
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                      placeholder="Enter instruction step..."
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="btn-danger mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Recipe"
                    : "Create Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

