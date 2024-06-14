// utils/textgeneration.js
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: 'sk-proj-9YnvVWg8aRPytcZNF0L5T3BlbkFJl7AOhn2nm0TSj2hplsAN' });

/**
 * @param {string} rawText
 * @param {string} userQuery
 * @returns {Promise<string>}
 */
async function generateCustomizedResponse(rawText, userQuery) {
    try {
        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Based on the following text:\n\n"${rawText}"\n\nPlease provide a structured response that addresses the following user query:\n\n"${userQuery}"` }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: messages,
        });

        const customizedResponse = response.choices[0].message.content.trim();
        console.log('Customized response:', customizedResponse);

        return customizedResponse;
    } catch (error) {
        console.error('Error generating customized response:', error);
        throw error;
    }
}

module.exports = { generateCustomizedResponse };
