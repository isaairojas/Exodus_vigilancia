import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Rutas relativas: el mismo build sirve en `vite preview` y en GitHub Pages (/Exodus_vigilancia/)
export default defineConfig({ base: './', plugins: [react()] });
