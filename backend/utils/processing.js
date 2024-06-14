const fs = require('fs').promises;
const { OpenAI } = require('openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const openai = new OpenAI({ apiKey: '' });

async function processDocument(filePath) {
    try {
        const text = await fs.readFile(filePath, 'utf-8');
        console.log(`Text from file: ${text}`);
        console.log(`Text length: ${text.length}`);

        const chunks = await splitDocumentIntoChunks(text);
        
        const embeddings = await generateEmbeddingsForChunks(chunks);
        return { embeddings, rawText: text };
    } catch (error) {
        console.error('Error processing document:', error);
        throw error;
    }
}

async function splitDocumentIntoChunks(text) {
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 50, chunkOverlap: 10 });

    const docOutput = await textSplitter.createDocuments([text]);

    const chunkTexts = docOutput.map(doc => doc.pageContent);
    console.log('Chunks:', chunkTexts);

    return chunkTexts;
}

async function generateEmbeddingsForChunks(chunks) {
    const embeddings = [];

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        embeddings.push(embedding);
    }

    return embeddings;
}

async function generateEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: [text],
        encoding_format: "float",
        dimensions: 10,
    });

    console.log('Embedding generated:', response.data[0].embedding);

    return response.data[0].embedding;
}

module.exports = {
    processDocument,
    generateEmbedding
};
