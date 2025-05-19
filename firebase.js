const firebaseConfig = {
  apiKey: "AIzaSyDZT6ZnYnrOvWjN3__u2vz7M3gmFS8hX2A",
  authDomain: "birds-bbabb.firebaseapp.com",
  projectId: "birds-bbabb",
  storageBucket: "birds-bbabb.appspot.com",
  messagingSenderId: "419452911794",
  appId: "1:419452911794:web:57e05757aca5e24cca09ab",
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function getBadIds(taxa, mode) {
  // gets iNaturalist ids of bad observations from firebase
  const collection = db.collection(`bad-observations-${mode}`);
  const bad_ids = {}; // key is taxon id, value is array of iNaturalist observation ids
  const promises = [];
  taxa.forEach((taxon_id) => {
    promises.push(
      collection
        .doc(String(taxon_id))
        .get()
        .then((doc) => {
          bad_ids[taxon_id] = doc.exists ? doc.data().ids : [];
        })
    );
  });
  await Promise.all(promises);
  return bad_ids;
}

function addBadId(taxon_id, iNaturalist_id, mode) {
  if (data_source !== "iNaturalist") {
    console.warn(
      "Tried to add non iNaturalist observation to firebase, canceling attempt."
    );
    return;
  }
  const doc = db.collection(`bad-observations-${mode}`).doc(String(taxon_id));
  doc
    .update({
      ids: firebase.firestore.FieldValue.arrayUnion(iNaturalist_id),
    })
    .catch((error) => {
      // document probably doesn't exist for this taxon, create it
      doc.set({ ids: [iNaturalist_id] });
    });
}

function firebaseAddSimilarSpecies(data, sounds) {
  // data is of format {taxonId: {stuff}, ...}
  for (let taxonId in data) {
    db.collection(`similar-species-${sounds ? "sounds" : "photos"}`)
      .doc(String(taxonId))
      .set(data[taxonId]);
  }
}

// debug
function firebaseDeleteSimilarSpecies(sounds) {
  for (const obj of list_taxa) {
    db.collection(`similar-species-${sounds ? "sounds" : "photos"}`)
      .doc(String(obj.id))
      .delete();

    if (obj.rank_level < 10) {
      db.collection(`similar-species-${sounds ? "sounds" : "photos"}`)
        .doc(String(getSpeciesParent(obj).id))
        .delete();
    }
  }
}

async function getSimilarSpeciesDataFromFirebase(taxonIds) {
  // each query can only get 10 documents at a time, so split up id list into chunks
  taxonIds = taxonIds.map((id) => String(id));
  const chunks = [];
  for (let i = 0; i < taxonIds.length; i += 10) {
    chunks.push(taxonIds.slice(i, i + 10));
  }
  // console.log("getting similar species data from firebase", taxonIds);

  const soundPromises = chunks.map((chunk) => {
    return db
      .collection("similar-species-sounds")
      .where(firebase.firestore.FieldPath.documentId(), "in", chunk)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach(
          (doc) => (similarSpeciesData.birdsong[doc.id] = doc.data())
        );
      });
  });

  const photoPromises = chunks.map((chunk) => {
    return db
      .collection("similar-species-photos")
      .where(firebase.firestore.FieldPath.documentId(), "in", chunk)
      .get()
      .then((snapshot) =>
        snapshot.docs.forEach(
          (doc) => (similarSpeciesData.visual_id[doc.id] = doc.data())
        )
      );
  });

  await Promise.all(soundPromises.concat(photoPromises));
}
