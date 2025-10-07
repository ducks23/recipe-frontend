// Mock data for development
export const sampleRecipes = [
  {
    id: 1,
    title: "Classic Spaghetti Bolognese",
    slug: "classic-spaghetti-bolognese",
    description: "A hearty Italian pasta dish with a rich meat sauce.",
    prep_time: 20,
    cook_time: 60,
    image_url: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400",
    instructions: [
      "Heat oil in a pan.",
      "Add onions, garlic, and carrots.",
      "Brown the beef.",
      "Add tomato paste, herbs, and simmer.",
      "Serve with pasta."
    ],
    ingredients: [
      {"quantity": "2 tbsp", "name": "olive oil"},
      {"quantity": "1", "name": "onion"},
      {"quantity": "2 cloves", "name": "garlic"},
      {"quantity": "1", "name": "carrot"},
      {"quantity": "500g", "name": "ground beef"},
      {"quantity": "2 tbsp", "name": "tomato paste"},
      {"quantity": "400g", "name": "spaghetti"}
    ]
  },
  {
    id: 2,
    title: "Chicken Caesar Salad",
    slug: "chicken-caesar-salad",
    description: "Fresh romaine lettuce with grilled chicken and creamy Caesar dressing.",
    prep_time: 15,
    cook_time: 10,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    instructions: [
      "Grill the chicken breast.",
      "Chop romaine lettuce.",
      "Make Caesar dressing.",
      "Toss everything together.",
      "Top with parmesan and croutons."
    ],
    ingredients: [
      {"quantity": "2", "name": "chicken breasts"},
      {"quantity": "1 head", "name": "romaine lettuce"},
      {"quantity": "1/2 cup", "name": "parmesan cheese"},
      {"quantity": "1 cup", "name": "croutons"},
      {"quantity": "1/4 cup", "name": "Caesar dressing"}
    ]
  }
]