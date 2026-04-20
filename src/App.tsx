
import './App.css'
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';

const year: number = new Date().getFullYear();

function App() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-100 dark:border-slate-800">
        © {year} Daniel Santacruz. Built with React & Tailwind v4.
      </footer>
    </main>
  );
}

export default App
