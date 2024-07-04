const firebaseConfig = {
    apiKey: "AIzaSyDZT6ZnYnrOvWjN3__u2vz7M3gmFS8hX2A",
    authDomain: "birds-bbabb.firebaseapp.com",
    projectId: "birds-bbabb",
    storageBucket: "birds-bbabb.appspot.com",
    messagingSenderId: "419452911794",
    appId: "1:419452911794:web:57e05757aca5e24cca09ab"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


async function getBadIds(taxa, mode) {
    // gets iNaturalist ids of bad observations from firebase
    const collection = db.collection(`bad-observations-${mode}`);
    const bad_ids = {}; // key is taxon id, value is array of iNaturalist observation ids
    const promises = [];
    taxa.forEach(taxon_id => {
        promises.push(
            collection.doc(String(taxon_id)).get().then(doc => {
                bad_ids[taxon_id] = doc.exists ? doc.data().ids : [];
            })
        )
    });
    await Promise.all(promises);
    return bad_ids;
}

function addBadId(taxon_id, iNaturalist_id, mode) {
    const doc = db.collection(`bad-observations-${mode}`).doc(String(taxon_id));
    try {
        doc.update({ ids: firebase.firestore.FieldValue.arrayUnion((iNaturalist_id)) });
    } catch {
        // doc probably doesn't exist, create it
        doc.set({ ids: [iNaturalist_id] });
    }
}


// Old idea: optimize firebase writes by updating in bulk instead of after every game question
// We'd want to update when the game ended, or when the user left the page

// to send a request when closing the page, we need to use navigator.sendBeacon()
// but we need to know what HTTP request to send - firebase has an API

// here is a GET
// await (await fetch("https://firestore.googleapis.com/v1beta1/projects/birds-bbabb/databases/(default)/documents/bad-observations-birdsong/9083?key=AIzaSyDZT6ZnYnrOvWjN3__u2vz7M3gmFS8hX2A")).json()

// how to do this (see webpages and below code):
// https://firebase.google.com/docs/firestore/reference/rest/v1beta1/projects.databases.documents/batchWrite
// https://firebase.google.com/docs/firestore/reference/rest/v1beta1/Write#FieldTransform
// problem though... the REST API needs an access token from OAuth, unlike using the namespaced API
/*

function addBadIds(bad_ids_to_add, mode) {
    // appends iNaturalist ids of bad observations to firebase
    // bad_ids_to_add is an object, key is taxon id, value is array of iNaturalist observation ids
    const writes = [];
    for(const [taxon_id, ids] of Object.entries(bad_ids_to_add)){
        writes.push(makeBadIdWriteObject(taxon_id, mode, ids))
    }
    const post_data = JSON.stringify({"writes": writes});
    console.log(post_data)
    // TODO set appropriate headers
}

function makeBadIdWriteObject(taxon_id, mode, ids) {
    return {
        "transform": {
            "document": `projects/birds-bbabb/databases/(default)/documents/bad-observations-${mode}/${taxon_id}`,
            "fieldTransforms": [{
                "fieldPath": "ids",
                "appendMissingElements": {
                    "values": ids.map(id => { return { "integerValue": id } })
                }
            }]
        }
    }
}

*/