// Удалите эту строку
// import { auth, registerUser, addAdminRole, registerAndAssignAdmin } from '../auth/FirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions'; // Импортируем функции
import firebaseConfig from 'configs/FirebaseConfig';

firebase.initializeApp(firebaseConfig);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();

// Регистрация пользователя
const registerUser = async (email, password) => {
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(email, password);
		const user = userCredential.user;
		console.log('User registered:', user);

		// Получение JWT токена
		const token = await user.getIdToken();
		console.log('JWT Token:', token);

		return { user, token };
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};

// Вызов функции для назначения роли админа
const addAdminRole = async (email) => {
	const addAdminRoleFunction = firebase.functions().httpsCallable('addAdminRole');
	try {
		const result = await addAdminRoleFunction({ email });
		console.log(result.data.message);
	} catch (error) {
		console.error('Error adding admin role:', error);
	}
};

// Пример использования
const registerAndAssignAdmin = async (email, password) => {
	try {
		const { user, token } = await registerUser(email, password);
		console.log('Admin registered with token:', token);
		await addAdminRole(user.email);
	} catch (error) {
		console.error('Registration error:', error);
	}
};

export {
	db,
	auth,
	currentUser,
	googleAuthProvider,
	facebookAuthProvider,
	twitterAuthProvider,
	githubAuthProvider,
	registerUser,
	addAdminRole,
	registerAndAssignAdmin
};
