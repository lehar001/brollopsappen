const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.calculateRating = functions.firestore
  .document('stores/{category}/items/{storeId}/reviews/{reviewId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    const oldDocument = change.before.data();

    const storeRef = admin.firestore().collection('stores').doc(context.params.category).collection('items').doc(context.params.storeId);

    return storeRef.get().then(function(doc) {
       var currentRating = doc.data().rating;
       var currentReviews = doc.data().reviews;
       console.log('Current rating is ' + currentRating);
       // How to handle deletes?
       var newReviews = currentReviews + 1;
       var newRating = ((currentReviews * currentRating) + document.rating) / newReviews;

       console.log('New rating is ' + newRating + ' with a total of ' + newReviews + ' reviews');

       return storeRef.update({
         rating: newRating,
         reviews: newReviews
       });
    }).catch(function(error) {
      console.log(error);
    });
  });
