const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const GeminiService = require('./geminiService');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure multer for multiple files
const uploadMultiple = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'contextImage0', maxCount: 1 },
  { name: 'contextImage1', maxCount: 1 },
  { name: 'contextImage2', maxCount: 1 },
  { name: 'contextImage3', maxCount: 1 },
  { name: 'contextImage4', maxCount: 1 }
]);

app.use(cors());
app.use(express.json());
app.use('/demos', express.static('demos'));

const gemini = new GeminiService(process.env.GEMINI_API_KEY);

app.post('/api/demos/create', uploadMultiple, async (req, res) => {
  try {
    const { clickwrapId, cluster } = req.body;
    const mainImagePath = req.files.image[0].path;
    
    // Collect context images
    const contextImagePaths = [];
    Object.keys(req.files).forEach(key => {
      if (key.startsWith('contextImage')) {
        contextImagePaths.push(req.files[key][0].path);
      }
    });

    console.log('Creating demo with:', { clickwrapId, cluster, contextImages: contextImagePaths.length });

    const html = await gemini.generateHTMLFromScreenshot(mainImagePath, clickwrapId, cluster, contextImagePaths);

    const demoId = uuidv4();
    const demoDir = path.join(__dirname, 'demos', demoId);
    
    await fs.mkdir(demoDir, { recursive: true });
    
    await fs.writeFile(path.join(demoDir, 'index.html'), html);
    
    // Clean up uploaded images
    await fs.unlink(mainImagePath);
    for (const contextPath of contextImagePaths) {
      await fs.unlink(contextPath);
    }

    const demoUrl = `${process.env.BASE_URL}/demos/${demoId}`;
    
    res.json({
      success: true,
      demoId,
      demoUrl,
      message: 'Demo created successfully'
    });

  } catch (error) {
    console.error('Error creating demo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'SpotDraft Demo Tool' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});