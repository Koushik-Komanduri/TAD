import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})


// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'
// import reactRefresh from '@vitejs/plugin-react-refresh';

// export default defineConfig({
//   plugins: [react(), reactRefresh()],
//   server: {
//     // Custom middleware to set cache control headers
//     middlewares: [
//       (req, res, next) => {
//         res.setHeader('Cache-Control', 'public, max-age=3600'); // Example: Cache for 1 hour
//         next();
//       },
//     ],
//   },
// });