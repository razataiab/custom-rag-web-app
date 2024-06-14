import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('document', file);

        try {
            await axios.post('http://localhost:3001/upload', formData); 
            alert('File uploaded successfully');
        } catch (error) {
            console.error('File upload failed', error);
            alert('File upload failed');
        }
    };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3001/query', { query });
            setResponse(result.data);
        } catch (error) {
            console.error('Failed to get response', error);
            alert('Failed to get response');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-300">
            <h1 className="text-4xl font-bold mb-6">Custom RAG System</h1>
            <nav>
                <ul className="flex space-x-4 mb-6">
                    <li>
                        <Link href="#upload" legacyBehavior>
                            <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Upload Document</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="#query" legacyBehavior>
                            <a className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Write a Query</a>
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <section id="upload" className="w-full max-w-md mb-12">
                <h2 className="text-3xl font-bold mb-4">Upload Document</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-800 text-gray-300" />
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Upload</button>
                </form>
            </section>
            
            <section id="query" className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4">Query Document</h2>
                <form onSubmit={handleQuerySubmit} className="space-y-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query"
                        className="w-full p-2 border rounded bg-gray-800 text-gray-300"
                    />
                    <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Search</button>
                </form>
                {response && (
                    <div className="mt-6 p-4 bg-gray-800 shadow rounded text-gray-300">
                        <h2 className="text-xl font-bold">Response:</h2>
                        <p>{response}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
