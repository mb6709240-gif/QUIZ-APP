import { getTheme, setTheme } from '../utils/storage';

export default function ThemeToggle() {
  const currentTheme = getTheme();
  const toggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('theme-change'));
  };
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {currentTheme === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F'}
    </button>
  );
}
