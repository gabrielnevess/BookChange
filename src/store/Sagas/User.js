import {put, call} from "redux-saga/effects";
import UserTypes from "../Ducks/User";
import {Constants} from "../../util";
import {Api} from "../../helpers";
import AsyncStorage from "@react-native-community/async-storage";
import QueryString from "query-string";

export function* userRequestLogin({email, password}) {
    try {

        const obj = {
            va_email: email,
            va_password: password
        };

        const {data} = yield call(Api.post, "/autenticar", QueryString.stringify(obj));
        console.log("userRequestLogin: ", data);
        AsyncStorage.multiSet([[Constants.EMAIL, email], [Constants.TOKEN, data.token]]);

        yield put(UserTypes.userSetToken(data.token));

    } catch (error) {
        console.log(error.response);
        yield put(UserTypes.userRequestFailed());

    }

}