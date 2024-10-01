import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import configuration from './configs/index.js';
import swaggerUi from 'swagger-ui-express';
import documentation from './doc/swaggerDocumentation.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();
app.use(express.json());
app.use(fileUpload());

// Load configuration
const db = configuration.CONNECTION;
const port = configuration.PORT || 3000; // Default to port 3000 if not provided

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173", // Adjust this URL to match your frontend's deployed URL on Render
    "https://your-frontend-url.netlify.app" // Example: Allow your frontend hosted on Netlify
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(documentation));

// Use the router for all routes
app.use('/api/v1', router);

// Fallback route for unhandled routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});

// Connect to MongoDB
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
