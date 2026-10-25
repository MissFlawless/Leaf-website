import { defineConfig } from 'vite'
import path from 'path'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function leafBackendBridge() {
  return {
    name: 'leaf-backend-bridge',
    apply: 'serve',
    configureServer(server) {
      const backendDir = path.resolve(__dirname, '../backend')
      const virtualenvPython = path.join(backendDir, '.venv', 'Scripts', 'python.exe')
      const python = existsSync(virtualenvPython) ? virtualenvPython : 'python'
      const migration = spawnSync(python, ['-m', 'flask', 'db', 'upgrade'], {
        cwd: backendDir,
        env: { ...process.env, FLASK_APP: 'run.py', FLASK_DEBUG: '0' },
        encoding: 'utf8',
        windowsHide: true,
      })
      if (migration.error || migration.status !== 0) {
        console.error('[leaf] Database migration failed:', migration.error?.message || migration.stderr || migration.stdout)
      }
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api') && !req.url?.startsWith('/uploads')) return next()
        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          const result = spawnSync(python, [path.join(backendDir, 'bridge.py'), req.method, req.url, JSON.stringify(req.headers)], {
            cwd: backendDir,
            input: Buffer.concat(chunks),
            encoding: 'utf8',
            windowsHide: true,
            maxBuffer: 16 * 1024 * 1024,
          })
          if (result.error || result.status !== 0) {
            console.error('[leaf] API bridge failed:', result.error?.message || result.stderr || result.stdout)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: 'Local API could not process this request.' }))
          }
          try {
            const response = JSON.parse(result.stdout)
            res.statusCode = response.status
            for (const [name, value] of Object.entries(response.headers || {})) res.setHeader(name, value)
            res.end(Buffer.from(response.body, 'base64'))
          } catch (error) {
            console.error('[leaf] Invalid API bridge response:', error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Local API returned an invalid response.' }))
          }
        })
      })
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    leafBackendBridge(),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
