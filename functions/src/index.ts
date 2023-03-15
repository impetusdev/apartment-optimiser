import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const APARTMENT_COLLECTION = "apartment";

admin.initializeApp();
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

  //TODO: add a filter to check if this apartment exists.

  const resDocument = await admin
    .firestore()
    .collection(APARTMENT_COLLECTION)
    .add({...apartment});

  res.status(201).json({result: `Message with ID: ${resDocument.id} added.`});
});

// const isExistingDoc = (address: string): boolean => {
//   return true;
// };

exports;

// do we need to trigger any repository second effects?
