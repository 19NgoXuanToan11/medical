const fs = require("fs");
const path = require("path");

const filePath = "src/pages/parent/health-profile/StudentHealthProfile.jsx";

// Read the file
let content = fs.readFileSync(filePath, "utf8");

// Apply all the dark mode updates
const updates = [
  // Update all rounded-lg p-6 without background
  [
    'className="rounded-lg p-6"',
    'className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6"',
  ],

  // Update all text-neutral-700 without dark mode
  ['text-neutral-700">', 'text-neutral-700 dark:text-neutral-300">'],
  ["text-neutral-700 ", "text-neutral-700 dark:text-neutral-300 "],

  // Update font-medium text-neutral-700
  [
    "font-medium text-neutral-700",
    "font-medium text-neutral-700 dark:text-neutral-300",
  ],

  // Update text-neutral-800 headings
  ["text-neutral-800 mb-4", "text-neutral-800 dark:text-neutral-200 mb-4"],
  ["text-neutral-800 mb-3", "text-neutral-800 dark:text-neutral-200 mb-3"],

  // Update bg-primary-100 icons
  [
    "bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600",
    "bg-primary-100 dark:bg-primary-900/30 rounded-full w-10 h-10 mr-3 text-primary-600 dark:text-primary-400",
  ],

  // Update text-neutral-600 descriptions
  ["text-neutral-600 mb-3", "text-neutral-600 dark:text-neutral-400 mb-3"],
  [
    "text-sm text-neutral-600",
    "text-sm text-neutral-600 dark:text-neutral-400",
  ],
];

// Apply each update
updates.forEach(([searchText, replaceText]) => {
  content = content.split(searchText).join(replaceText);
});

// Write back to file
fs.writeFileSync(filePath, content, "utf8");

console.log("Dark mode updates applied successfully!");
