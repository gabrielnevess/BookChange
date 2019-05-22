import React from "react";
import {Provider as StoreProvider} from "react-redux";
import {DefaultTheme, Provider as PaperProvider} from "react-native-paper";
import {createAppContainer, createStackNavigator} from "react-navigation";
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Navigation} from "../helpers";
import {Colors} from "../styles";
import {Constants} from "../util";
import store from "../store";

/* paginas */
import LoadingScreenPage from "../components/Pages/LoadingScreenPage/LoadingScreenPage";
import LoginPage from "../components/Pages/LoginPage/LoginPage";

// const TabNavigator = createMaterialBottomTabNavigator({
//     //HomePage,
//     //SearchPage
// });

const StackNavigator = createStackNavigator(
    {
        LoadingScreenPage: {screen: LoadingScreenPage},
        LoginPage: {screen: LoginPage},
        // Main: {screen: TabNavigator},
    },
    {
        initialRouteName: Constants.LOADING_SCREEN_PAGE,
        headerMode: "none",
        defaultNavigationOptions: {
            gesturesEnabled: false
        }
    },
);

const AppContainer = createAppContainer(StackNavigator);

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.blue,
        accent: Colors.yellow,
        background: Colors.white,
        text: Colors.black
    },
};

export default () => {
    return (
        <StoreProvider store={store}>
            <PaperProvider theme={theme}>
                <AppContainer
                    ref={navigatorRef => {
                        Navigation.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </PaperProvider>
        </StoreProvider>
    );
}