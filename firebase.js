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

const test_ref = db.collection("skipped-birdsong").doc("9083");
test_ref.get().then(doc => {
    if (doc.exists) {
        console.log(doc.data())
    }
    else {
        console.log("doesn't exist")
    }
})



// method for using:
// when a game starts, get the skipped ids and store in a variable
// as the user plays the game, add ids to this object
// when the game ends or before the page unloads, update the database with this object
// this way we only have to do one write
// BTW we will need to get skipped ids again right before writing in case someone else changed it


async function getSkippedIds(taxa, mode) {
    const collection = db.collection(`skipped-${mode}`);
    const skipped_ids = {}; // key is taxon id, value is array of iNaturalist observation ids
    const promises = [];
    taxa.forEach(taxon_id => {
        promises.push(
            collection.doc(String(taxon_id)).get().then(doc => {
                skipped_ids[taxon_id] = doc.exists ? doc.data().ids : [];
            })
        )
    });
    await Promise.all(promises);
    return skipped_ids;
}


async function setSkippedIds(skipped_ids, mode) {
    // skipped_ids is an object, key is taxon id, value is array of iNaturalist observation ids

    // get data again, in case it changed
    const firebase_skipped_ids = await getSkippedIds(Object.keys(skipped_ids), mode);

    // reconcile and write
    const collection = db.collection(`skipped-${mode}`);
    for (let [taxon_id, ids] of Object.entries(skipped_ids)) {
        // remove any duplicates
        const set = new Set(ids);
        ids = Array.from(set);

        // add any new ids from firebase to my id list
        firebase_skipped_ids[taxon_id].forEach(id => { if (!set.has(id)) ids.push(id) });

        // write
        collection.doc(String(taxon_id)).set({ ids: ids });
    }
}