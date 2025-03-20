const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    // Проверка, что вызов идет от авторизованного пользователя
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    // Добавление роли админа
    return admin.auth().getUserByEmail(data.email)
        .then(user => {
            return admin.auth().setCustomUserClaims(user.uid, { admin: true });
        })
        .then(() => {
            return { message: `Success! ${data.email} has been made an admin.` };
        })
        .catch(error => {
            return { error: error.message };
        });
});
