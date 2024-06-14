// config.js
let collectionName = '';

function setCollectionName(name) {
    collectionName = name;
}

function getCollectionName() {
    return collectionName;
}

module.exports = {
    setCollectionName,
    getCollectionName
};
