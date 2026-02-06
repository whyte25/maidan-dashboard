export const PRODUCT_COLORS = [
  { value: "red", label: "Red", hex: "#EF4444" },
  { value: "blue", label: "Blue", hex: "#3B82F6" },
  { value: "pink", label: "Pink", hex: "#EC4899" },
  { value: "green", label: "Green", hex: "#22C55E" },
  { value: "yellow", label: "Yellow", hex: "#EAB308" },
  { value: "violet", label: "Violet", hex: "#8B5CF6" },
  { value: "black", label: "Black", hex: "#000000" },
  { value: "white", label: "White", hex: "#FFFFFF" },
] as const;

export const PRODUCT_CATEGORIES = [
  "Clothing",
  "Shirts",
  "T-shirts",
  "Jeans",
  "Leather",
  "Accessories",
  "Tailored",
  "Suits",
  "Blazers",
  "Trousers",
  "Waistcoats",
  "Apparel",
  "Shoes",
  "Backpacks and bags",
  "Bracelets",
  "Face masks",
] as const;

export const PRODUCT_TAGS = [
  "Technology",
  "Health and Wellness",
  "Travel",
  "Finance",
  "Education",
  "Food and Beverage",
  "Fashion",
  "Home and Garden",
  "Sports",
] as const;

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const PRODUCT_GENDERS = [
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
  { value: "kids", label: "Kids" },
] as const;
