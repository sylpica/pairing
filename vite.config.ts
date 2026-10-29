import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトサブパスでも壊れないよう相対 base を使う
export default defineConfig({ base: './', plugins: [react()] })
