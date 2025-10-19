const { logger } = require("firebase-functions");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");

async function uploadBase64(base64String, path, name) {
    const bucket = getStorage().bucket();
    const file = bucket.file(`${path}/${name}`);
    await file.save(Buffer.from(base64String, 'base64'));
    const downloadURL = await getDownloadURL(file)
    return {
        path,
        name,
        url: downloadURL
    }
}

async function getDocument(collectionName, id) {
    let companySnapshot = await getFirestore()
            .collection(collectionName)
            .doc(id)
            .get();
    return { id: companySnapshot.id, ...companySnapshot.data() }
}

async function getCollection(collectionName, ...condiciones) {
    let ref = getFirestore().collection(collectionName)
    if (condiciones.length > 0) {
        condiciones.forEach(([campo, operador, valor]) => {
            ref = ref.where(campo, operador, valor);
        });
    }
    const querySnapshot = await ref.get();

    let response = [];
    querySnapshot.forEach((doc) => {
        response.push({ id: doc.id, ...doc.data() });
    });
    return response
}

async function getFirst(collectionName, ...condiciones) {
    let ref = getFirestore().collection(collectionName)
    condiciones.forEach(([campo, operador, valor]) => {
        ref = ref.where(campo, operador, valor);
    });
    const querySnapshot = await ref
        .limit(1)
        .get();
    if (querySnapshot.empty) {
        throw 'No se encontró ningún documento que coincida con la consulta.'
    }
    const firstDoc = querySnapshot.docs[0]
    const data = firstDoc.data()
    return {
        id: firstDoc.id,
        ...data,
      }
}

async function setDocument(collectionName, id, data, currentUser) {
    data.updateBy = currentUser
    data.updateAt = new Date()
    logger.error(data)
    const writeResult = await getFirestore()
        .doc(`${collectionName}/${id}`)
        .set(data, { merge: false });
    return writeResult
}

async function updateDocument(collectionName, id, data, currentUser) {
    data.updateBy = currentUser
    data.updateAt = new Date()
    const writeResult = await getFirestore()
        .doc(`${collectionName}/${id}`)
        .update(data);
    return writeResult
}

async function deleteDocument(collectionName, id, data, currentUser) {
    data.updateBy = currentUser
    data.updateAt = new Date()
    const writeResult = await getFirestore()
        .doc(`${collectionName}/${id}`)
        .delete();
    return writeResult
}

async function addDocument(collectionName, data, currentUser) {
    data.createBy = currentUser
    data.createAt = new Date()
    const writeResult = await getFirestore()
        .collection(collectionName)
        .add(data);
    return writeResult
}

module.exports = { 
    uploadBase64, 
    getDocument, 
    getCollection, 
    getFirst, 
    setDocument, 
    addDocument, 
    updateDocument, 
    deleteDocument 
};