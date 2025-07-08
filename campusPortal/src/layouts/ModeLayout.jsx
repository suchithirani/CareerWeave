import ThemeListener from "../components/ThemeListener";

// src/layouts/ModeLayout.jsx

export default function ModeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeListener />
      {children}
    </div>
  );
}