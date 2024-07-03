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

async function getSkippedIds(taxa, mode) {
    const collection = db.collection(`skipped-${mode}`);
    taxa.forEach(taxon_id => {
        
    });
}