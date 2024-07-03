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

// method for using:
// when a game starts, get the bad ids and store in a variable
// as the user plays the game, add ids to this object
// when the game ends or before the page unloads, update the database with this object
// this way we only have to do one write
// BTW we will need to get bad ids again right before writing in case someone else changed it


async function getBadIds(taxa, mode) {
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


async function setBadIds(bad_ids, mode) {
    // bad_ids is an object, key is taxon id, value is array of iNaturalist observation ids

    // get data again, in case it changed
    const firebase_bad_ids = await getBadIds(Object.keys(bad_ids), mode);

    // reconcile and write
    const collection = db.collection(`bad-observations-${mode}`);
    for (let [taxon_id, ids] of Object.entries(bad_ids)) {
        if(ids.length === 0) continue;

        // remove any duplicates
        const set = new Set(ids);
        ids = Array.from(set);

        // add any new ids from firebase to my id list
        firebase_bad_ids[taxon_id].forEach(id => { if (!set.has(id)) ids.push(id) });

        // write
        collection.doc(String(taxon_id)).set({ ids: ids });
    }
}