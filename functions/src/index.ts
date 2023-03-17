import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const APARTMENT_COLLECTION = "apartments";

type Apartment = {
  id: string;
  address: string;
  price: number;
};

admin.initializeApp();
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// Listens for new messages added to /messages/:documentId/original and creates
// an uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();
    functions.logger.log(`New message: ${uppercase}`);

    // You must return a Promise when performing asynchronous tasks inside a
    //  Functions such as writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({uppercase}, {merge: true});
  });

// add apartment to firestore.
exports.addApartment = functions.https.onRequest(async (req, res) => {
  const apartment = req.body.apartment;

  if (await isExistingDoc(apartment.address)) {
    res.status(400).json({error: "This is an existing address"});
  } else {
    const resDocument = await admin
      .firestore()
      .collection(APARTMENT_COLLECTION)
      .add({...apartment});

    res.status(201).json({result: `Message with ID: ${resDocument.id} added.`});
  }
});

const isExistingDoc = async (address: string): Promise<boolean> => {
  const docSnapshot = await admin
    .firestore()
    .collection(APARTMENT_COLLECTION)
    .where("address", "==", address)
    .get();

  return docSnapshot.docs.length > 0;
};
// get all apartments listed:
exports.getApartments = functions.https.onRequest(async (req, res) => {
  const apartmentSnapshot = await admin
    .firestore()
    .collection(APARTMENT_COLLECTION)
    .get();

  const apartments: Apartment[] = [];
  apartmentSnapshot.forEach((doc) => {
    const data = doc.data() as Apartment;
    apartments.push(data);
  });

  // console.log("apartments:", apartments);
  res.send({result: {apartments}});
});

exports.scrapeApartments = functions.https.onRequest(async (req, res) => {
  const url = req.body.url;

  res.send({result: url});
});

exports;
