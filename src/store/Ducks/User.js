import {createReducer, createActions} from "reduxsauce";
import Immutable from "seamless-immutable";

const {Types, Creators} = createActions({
    userRequestLogin: ["email", "password"],
    userRequestSuccess: null,
    userRequestFailed: null
});

const INITIAL_STATE = Immutable({
    loading: false
});

export const reducer = createReducer(INITIAL_STATE, {
    [Types.USER_REQUEST_LOGIN]: state => state.merge({loading: true}),
    [Types.USER_REQUEST_SUCCESS]: state => state.merge({loading: false}),
    [Types.USER_REQUEST_FAILED]: state => state.merge({loading: false})
});

export const UserTypes = Types;
export default Creators;