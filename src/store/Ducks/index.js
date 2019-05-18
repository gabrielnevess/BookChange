import {combineReducers} from "redux";

/* user */
import {reducer as user} from "./User";

const reducers = combineReducers({
    user,
});

export default reducers;