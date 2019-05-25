import {all, takeLatest} from "redux-saga/effects";

import {UserTypes} from "../Ducks/User";
import {
    userRequestLogin,
} from "./User";

export default function* rootSaga() {
    return yield all([
        takeLatest(UserTypes.USER_REQUEST_LOGIN, userRequestLogin),
    ]);
}