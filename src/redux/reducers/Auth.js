// src/redux/reducers/Auth.js
import {
	AUTH_TOKEN,
	AUTHENTICATED,
	SHOW_AUTH_MESSAGE,
	HIDE_AUTH_MESSAGE,
	SIGNOUT_SUCCESS,
	SIGNUP_SUCCESS,
	SHOW_LOADING,
	SIGNIN_WITH_GOOGLE_AUTHENTICATED,
	SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
	SET_USER,
	CLEAR_USER
} from '../constants/Auth';

const initState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN),
	user: null,
	isAdmin: false,
};

const auth = (state = initState, action) => {
	switch (action.type) {
		case AUTHENTICATED:
			return {
				...state,
				loading: false,
				redirect: '/',
				token: action.token,
			};
		case SHOW_AUTH_MESSAGE:
			return {
				...state,
				message: action.message,
				showMessage: true,
				loading: false,
			};
		case HIDE_AUTH_MESSAGE:
			return {
				...state,
				message: '',
				showMessage: false,
			};
		case SIGNOUT_SUCCESS:
			return {
				...state,
				token: null,
				redirect: '/',
				loading: false,
				user: null,
				isAdmin: false,
			};
		case SIGNUP_SUCCESS:
			return {
				...state,
				loading: false,
				token: action.token,
			};
		case SHOW_LOADING:
			return {
				...state,
				loading: true,
			};
		case SIGNIN_WITH_GOOGLE_AUTHENTICATED:
			return {
				...state,
				loading: false,
				token: action.token,
			};
		case SIGNIN_WITH_FACEBOOK_AUTHENTICATED:
			return {
				...state,
				loading: false,
				token: action.token,
			};
		case SET_USER:
			console.log('Setting user with token:', action.payload.token);
			return {
				...state,
				token: action.payload.token,
				user: action.payload.user,
				isAdmin: action.payload.isAdmin,
			};
		case CLEAR_USER:
			return {
				...state,
				user: null,
				isAdmin: false,
			};
		default:
			return state;
	}
};

export default auth;