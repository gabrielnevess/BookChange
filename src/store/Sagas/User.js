import {put, call} from "redux-saga/effects";
import UserTypes from "../Ducks/User";
import {Constants} from "../../util";
import {Axios, Navigation} from "../../helpers";
import AsyncStorage from "@react-native-community/async-storage";
import QueryString from "qs";

export function* userRequestLogin({email, password}) {
    try {

        const obj = {
            va_email: email,
            va_password: password
        };

        const {data} = yield call(Axios.post, "/autenticar", QueryString.stringify(obj));
        console.log("userRequestLogin: ", data);
        AsyncStorage.multiSet([[Constants.EMAIL, email], [Constants.TOKEN, data.token]]);

        Navigation.navigate(Constants.HOME_PAGE);
        yield put(UserTypes.userRequestSuccess());

    } catch (error) {

        console.log(error.response);
        yield put(UserTypes.userRequestFailed());

    }

}