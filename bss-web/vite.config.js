import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  // `assetsInclude: ['**/*.JPG', '**/*.JPEG']` used to sit here, from when the
  // landing page imported camera exports directly. Nothing does any more, and
  // leaving it in made Vite claim those extensions before imagetools could
  // transform them — six headshots shipped as their untouched originals, one of
  // them 6.9 MB.
  plugins: [
    react(),
    commonjs(),
    // imagetools' own default only matches lowercase extensions. Camera and
    // phone exports are frequently .JPG or .JPEG, and six of the headshots in
    // the archive are, so the filter is case-insensitive here or those people
    // silently stop having a photograph.
    imagetools({
      include: /^[^?]+\.(heic|heif|avif|jpeg|jpg|png|tiff|webp|gif)(\?.*)?$/i,
    }),
  ],
})
