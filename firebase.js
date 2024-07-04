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
    const taxon_ref = db.collection(`bad-observations-${mode}`).doc(String(taxon_id)).update({
        ids: firebase.firestore.FieldValue.arrayUnion((iNaturalist_id))
    });
}


async function setBadIds(bad_ids, mode) {
    // bad_ids is an object, key is taxon id, value is array of iNaturalist observation ids
    // the array will have a property dirty=true if we changed it since getting it from firebase

    // filter bad_ids so we only update firebase if we have something to add
    const taxa_to_update = [];
    for (let taxon_id in bad_ids) {
        if (bad_ids[taxon_id].length === 0) continue;
        if (!bad_ids[taxon_id].dirty) continue;
        taxa_to_update.push(taxon_id);
    }

    // get data again, in case it changed
    let firebase_bad_ids = await getBadIds(taxa_to_update, mode);

    // reconcile and write
    const collection = db.collection(`bad-observations-${mode}`);
    for (let taxon_id of taxa_to_update) {
        // remove any duplicates
        const set = new Set(bad_ids[taxon_id]);
        const ids = Array.from(set);

        // add any new ids from firebase to my id list
        firebase_bad_ids[taxon_id].forEach(id => { if (!set.has(id)) ids.push(id) });

        // write
        collection.doc(String(taxon_id)).set({ ids: ids });
        bad_ids[taxon_id].dirty = false;
    }
}


// to send a request when closing the page, we need to use navigator.sendBeacon(), or fetch() with keepalive specified
// sendBeacon() is probably most appropriate
// but we need to send an HTTP request
// so can use the firebase api

// here is a GET
// await (await fetch("https://firestore.googleapis.com/v1beta1/projects/birds-bbabb/databases/(default)/documents/bad-observations-birdsong/9083?key=AIzaSyDZT6ZnYnrOvWjN3__u2vz7M3gmFS8hX2A")).json()

// problem: we want to fetch the current data and then send a POST with the reconciled data

// hmmm... seems we can do this with one function, maybe we can do this with one HTTP request too then:
// https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
// YES WE CAN!
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