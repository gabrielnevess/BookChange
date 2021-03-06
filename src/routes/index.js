import React from "react";
import {Provider as StoreProvider} from "react-redux";
import {DefaultTheme, Provider as PaperProvider} from "react-native-paper";
import {createAppContainer} from "react-navigation";
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Navigation} from "../helpers";
import {Colors} from "../styles";
import {Constants} from "../util";
import store from "../store";

/* icone da tabBar */
import tabBarIcon from "../components/MyComponents/TabBarIcon";

/* paginas */
import HomePage from "../components/Pages/HomePage";
import AccountPage from "../components/Pages/AccountPage";

const TabNavigator = createMaterialBottomTabNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: Constants.HOME,
            tabBarIcon: tabBarIcon("home"),
        },
    },
    AccountPage: {
        screen: AccountPage,
        navigationOptions: {
            tabBarLabel: Constants.ACCOUNT,
            tabBarIcon: tabBarIcon("person"),
        },
    },
}, {
    activeColor: Colors.white,
    barStyle: {
        position: "absolute"
    }
});

//desativa tabBar para as seguintes páginas
HomePage.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

AccountPage.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;

    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

const AppContainer = createAppContainer(TabNavigator);

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.lightPink,
        accent: Colors.blue,
        background: Colors.white,
        text: Colors.black,
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
