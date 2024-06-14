const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');
const { vectorsData } = require ('./Data');
const { setCollectionName } = require('../utils/config');


const client = new MilvusClient({ address: 'http://localhost:19530' });

function generateUniqueCollectionName() {
const timestamp = Date.now();
return `embedding_${timestamp}`;
}

async function storeEmbeddings(embeddings) {
    const collectionName = generateUniqueCollectionName();
    setCollectionName(collectionName);

    console.log(`Embedding length: ${embeddings[0].length}`);

    const create = await client.createCollection({
        collection_name: collectionName,
        fields: [
          {
            name: 'id',
            description: 'ID field',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true,
          },
          {
            name: 'vector',
            description: 'Vector field',
            data_type: DataType.FloatVector,
            dim: 10,
          },
        ],
      });
      console.log('Create collection is finished:', create);
    
    
      for (const embedding of embeddings) {
        const insertData = [{
            vector: embedding,
        }];

        const insert = await client.insert({
            collection_name: collectionName,
            fields_data: insertData,
        });

        console.log('Collection Name:', collectionName, 'Embedding: ', embedding);

        if (insert.status.error_code !== 'Success') {
            throw new Error(`Failed to insert data: ${insert.status.reason}`);
        }
    }

  
    await client.createIndex({
      collection_name: collectionName,
      field_name: 'vector',
      metric_type: 'L2',
    });

    console.log("Embeddings stored successfully in Milvus");
}

module.exports = {
storeEmbeddings,
generateUniqueCollectionName,
};