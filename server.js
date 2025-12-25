const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Calculate endpoint
app.post('/calculate', (req, res) => {
    const { expression } = req.body;
    
    if (!expression) {
        return res.status(400).json({ error: 'Expression is required' });
    }
    
    try {
        // Basic validation to prevent malicious code
        if (!isValidExpression(expression)) {
            return res.status(400).json({ error: 'Invalid expression' });
        }
        
        // Calculate the result
        const result = eval(expression);
        
        // Check if result is a valid number
        if (isNaN(result) || !isFinite(result)) {
            return res.status(400).json({ error: 'Invalid calculation result' });
        }
        
        res.json({ result: result.toString() });
    } catch (error) {
        res.status(400).json({ error: 'Calculation error' });
    }
});

// Validate expression to prevent code injection
function isValidExpression(expr) {
    // Only allow numbers, basic operators, and decimal points
    const validChars = /^[0-9+\-*/.() ]+$/;
    return validChars.test(expr);
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Calculator API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Calculator API server running on port ${PORT}`);
});
