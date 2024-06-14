const { MilvusClient } = require('@zilliz/milvus2-sdk-node');

const client = new MilvusClient("localhost:19530");

async function testMilvus() {
    try {
        // List all collections
        const collections = await client.collectionManager.showCollections();
        console.log("List all collections:\n", collections);

        // Create a new collection if it doesn't exist
        const collectionName = 'test_embeddings';
        if (!collections.includes(collectionName)) {
            await client.collectionManager.createCollection({
                collection_name: collectionName,
                fields: [
                    { name: 'filename', type: 'string', is_primary_key: true },
                    { name: 'embedding', type: 'float_vector', params: { dim: 128 } } // Example dimension
                ]
            });
            console.log(`Collection ${collectionName} created`);
        } else {
            console.log(`Collection ${collectionName} already exists`);
        }
    } catch (error) {
        console.error("Error in Milvus test script:", error);
    }
}

testMilvus();
