const express = require('express');
const multer = require('multer');
const { processDocument } = require('../utils/processing');
const { storeEmbeddings } = require('../utils/milvus');
const { generateCustomizedResponse } = require('../utils/textgeneration');
const { similaritySearch } = require('../utils/similaritySearch');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let documentText = '';

router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('No file uploaded');
        }
        console.log(`Processing file: ${file.filename}`);

        const { embeddings, rawText } = await processDocument(file.path);
        documentText = rawText;
        console.log(`Embeddings generated for file: ${file.filename}`);

        await storeEmbeddings(embeddings);
        console.log(`Embeddings stored for file: ${file.filename}`);

        res.status(200).send({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).send({ error: 'Failed to upload document', details: error.message });
    }
});

router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query text is required' });
        }

    
        const structuredResponse = await generateCustomizedResponse(documentText, query);

        console.log('Structured response generated successfully');

    
    

        res.status(200).send(structuredResponse);
    } catch (error) {
        console.error('Error generating structured response for query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
