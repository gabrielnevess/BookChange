import {StackActions, NavigationActions} from "react-navigation";

let _navigator;

const setTopLevelNavigator = (navigatorRef) => {
    _navigator = navigatorRef;
};

const navigate = (routeName, params) => {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
};

const resetPagesWithNavigation = (routeName, params) => {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName,
                    params,
                })
            ]
        })
    );
};

export default {
    navigate,
    setTopLevelNavigator,
    resetPagesWithNavigation
};