/**
 * Club categories and their display colors.
 * Used for filters and badges on Clubs page and in Navbar.
 */

export const clubCategories = [
  { name: "Sports", color: "red" },
  { name: "VPA", color: "purple" },
  { name: "Volunteering and Public Service", color: "green" },
  { name: "Culture/Religion", color: "orange" },
  { name: "Finance", color: "gold" },
  { name: "Food/Crafts", color: "brown" },
  { name: "Games and Fantasy", color: "darkblue" },
  { name: "Literature and Media", color: "teal" },
  { name: "Politics and Public Speaking", color: "lightcoral" },
  { name: "Visual and Performing Arts Club", color: "magenta" },
  { name: "Health and Environmental", color: "forestgreen" },
  { name: "STEM", color: "#861212" },
];

/** Map category name -> color (for backward compatibility with existing code) */
export function getCategoryColorMap() {
  return Object.fromEntries(clubCategories.map((c) => [c.name, c.color]));
}

export default clubCategories;
