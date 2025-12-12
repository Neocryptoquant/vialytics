import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Static assets from `public/` (serve these before the catch-all index route)
    "/logo.svg": Bun.file("./public/logo.svg"),
    "/mascot.svg": Bun.file("./public/mascot.svg"),
    "/via-mascot.jpg": Bun.file("./public/via-mascot.jpg"),
    "/vialytics-logo.jpg": Bun.file("./public/vialytics-logo.jpg"),
    "/logo-vialytics.jpg": Bun.file("./public/logo-vialytics.jpg"),

    // Serve index.html for all unmatched routes
    "/*": index,

    // API endpoint to get env vars
    "/api/config": {
      async GET(req) {
        return Response.json({
          groqApiKey: process.env.VITE_GROQ_API_KEY || ""
        });
      }
    },

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`🔑 Groq API Key: ${process.env.VITE_GROQ_API_KEY ? "✅ Loaded" : "❌ Missing"}`);
