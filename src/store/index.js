import {createStore, applyMiddleware} from "redux";
import createSagasMiddleware from "redux-saga";
import rootReducer from "./Ducks";
import rootSaga from "./Sagas";

const sagasMiddleware = createSagasMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagasMiddleware));
sagasMiddleware.run(rootSaga);

export default store;