const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

class GeminiService {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateHTMLFromScreenshot(imagePath, clickwrapId, cluster, contextImagePaths = []) {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");

    // Process context images
    const contextImages = contextImagePaths.map(path => {
      const data = fs.readFileSync(path);
      return {
        inlineData: {
          data: data.toString("base64"),
          mimeType: "image/png"
        }
      };
    });

    console.log("🎨 Starting two-stage design process...");

    // STAGE 1: Extract Design DNA
    const designSystem = await this.extractDesignSystem(base64Image, contextImages);
    console.log("✅ Design system extracted");

    // STAGE 2: Generate HTML using Design DNA
    const html = await this.generateHTMLWithDesignSystem(base64Image, designSystem, clickwrapId, cluster);
    console.log("✅ HTML generated with design system");

    return html;
  }

  async extractDesignSystem(base64Image, contextImages) {
    const maxRetries = 3;
    let retryCount = 0;

    const designExtractionPrompt = `
You are a world-class design system analyst and color expert. Analyze these images with surgical precision to extract the complete design DNA.

MISSION: Extract every visual detail to create a comprehensive design system specification.

ANALYZE AND EXTRACT:

1. **COLOR PALETTE** (be extremely specific):
   - Primary colors (exact hex values if possible)
   - Secondary colors
   - Accent colors
   - Background colors (light/dark variations)
   - Text colors (primary, secondary, muted)
   - Border colors
   - Button colors (default, hover, active states)
   - Link colors

2. **TYPOGRAPHY SYSTEM**:
   - Font families being used (identify if possible: Arial, Helvetica, Roboto, etc.)
   - Font weights (light, regular, medium, bold)
   - Font sizes for headings (H1, H2, H3)
   - Body text font size
   - Letter spacing
   - Line heights

3. **SPACING & LAYOUT**:
   - Margin patterns (small, medium, large values)
   - Padding patterns
   - Grid system (if apparent)
   - Container max-widths
   - Section spacing

4. **COMPONENT STYLES**:
   - Button styles (border-radius, padding, shadows)
   - Input field styles (borders, focus states, padding)
   - Card/container styles
   - Shadow patterns
   - Border styles and thickness

5. **DESIGN PERSONALITY**:
   - Overall aesthetic (minimalist, bold, corporate, playful, etc.)
   - Border radius preference (sharp, slightly rounded, very rounded)
   - Shadow usage (none, subtle, prominent)
   - Color temperature (warm, cool, neutral)

RETURN FORMAT: Provide a detailed JSON-like specification with exact values. Be very specific about colors, sizes, and measurements.

Example:
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#64748B",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "typography": {
    "fontFamily": "Inter, Arial, sans-serif",
    "headingWeight": "600",
    "bodySize": "16px"
  },
  "spacing": {
    "small": "8px",
    "medium": "16px",
    "large": "32px"
  },
  "components": {
    "borderRadius": "8px",
    "buttonPadding": "12px 24px",
    "shadow": "0 4px 6px rgba(0,0,0,0.1)"
  }
}

Be extremely detailed and precise. This design system will be used to recreate the exact aesthetic.`;

    while (retryCount < maxRetries) {
      try {
        const parts = [
          { text: designExtractionPrompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/png"
            }
          },
          ...contextImages
        ];

        const response = await this.ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [{ role: "user", parts: parts }],
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });

        return response.text;

      } catch (error) {
        retryCount++;
        if (error.message.includes('overloaded') || error.message.includes('503')) {
          console.log(`Design extraction retry ${retryCount}/${maxRetries} in 5 seconds...`);
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
        }
        throw error;
      }
    }
  }

  async generateHTMLWithDesignSystem(base64Image, designSystem, clickwrapId, cluster) {
    const maxRetries = 3;
    let retryCount = 0;

    const baseUrls = {
      'IN': 'https://api.in.spotdraft.com/',
      'US': 'https://api.us.spotdraft.com/',
      'EU': 'https://api.eu.spotdraft.com/',
      'ME': 'https://api.me.spotdraft.com/'
    };

    const htmlGenerationPrompt = `
You are a world-class frontend developer. Your mission: recreate this screenshot with SURGICAL PRECISION using the provided design system.

DESIGN SYSTEM TO FOLLOW RELIGIOUSLY:
${designSystem}

CRITICAL MISSION:
1. Use the EXACT colors, fonts, spacing, and styles from the design system above
2. Every pixel must match the screenshot
3. Apply the design system consistently throughout
4. Create a complete, functional HTML page

IMPLEMENTATION REQUIREMENTS:
1. Complete HTML document with <!DOCTYPE html>, <html>, <head>, and <body> tags
2. ALL inline CSS styles - no external stylesheets
3. Use CSS custom properties for the design system values
4. Responsive design with modern CSS (flexbox/grid)
5. Functional form elements with proper IDs:
   - id="email-input" for email fields
   - id="submit-btn" for main CTA button
6. Exact placeholder text from screenshot
7. Perfect visual recreation

SPOTDRAFT CLICKTHROUGH INTEGRATION:
Position naturally in the page flow (above/near main CTA):

Before </head>:
<script type="module" src="https://sdk.spotdraft.com/clickwrap/v1/sdk.js"></script>

In body (positioned naturally):
<div id="clickthrough-container" style="margin: 10px 0; padding: 8px; font-size: 12px; color: var(--text-muted); border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--background-subtle);"></div>

Before </body>:
<script>
window.addEventListener("sdClickthroughLoaded", function () {
  try {
    const clickthrough = new SdClickthrough({
      clickwrapId: "${clickwrapId}",
      hostLocationDomId: "clickthrough-container",
      baseUrl: "${baseUrls[cluster]}"
    });
    clickthrough.init();
    
    const submitBtn = document.getElementById("submit-btn") || 
                     document.querySelector('button[type="submit"]') || 
                     document.querySelector('button');
    
    if (submitBtn) {
      const originalOnclick = submitBtn.onclick;
      
      submitBtn.onclick = function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById("email-input") || 
                          document.querySelector('input[type="email"]') || 
                          document.querySelector('input[name="email"]') ||
                          document.querySelector('input[type="text"]');
        
        const emailValue = emailInput ? emailInput.value : "demo@example.com";
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;
        
        clickthrough.submit({
          user_identifier: emailValue,
          first_name: "Demo",
          last_name: "User",
          user_email: emailValue
        }).then(contractData => {
          submitBtn.textContent = "✓ Success!";
          submitBtn.style.backgroundColor = "var(--success-color)";
          
          setTimeout(() => {
            alert("Terms accepted and contract created!\\n\\nContract ID: " + contractData.id);
            console.log("Contract Data:", contractData);
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "";
            
            if (originalOnclick) originalOnclick.call(this, e);
          }, 1500);
        }).catch(error => {
          console.error("Clickthrough Error:", error);
          alert("Demo: Terms acceptance simulated\\n\\nError: " + error.message);
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
      };
    }
    
    console.log("SpotDraft Clickthrough initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Clickthrough:", error);
  }
});
</script>

RETURN: Only the complete HTML code - no markdown, no explanations.
The result must be visually identical to the screenshot using the exact design system provided.`;

    while (retryCount < maxRetries) {
      try {
        const parts = [
          { text: htmlGenerationPrompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/png"
            }
          }
        ];

        const response = await this.ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [{ role: "user", parts: parts }],
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });

        let html = response.text;
        html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
        return html;

      } catch (error) {
        retryCount++;
        if (error.message.includes('overloaded') || error.message.includes('503')) {
          console.log(`HTML generation retry ${retryCount}/${maxRetries} in 5 seconds...`);
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
        }
        throw error;
      }
    }
  }
}

module.exports = GeminiService;