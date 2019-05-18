import React from "react";
import {Provider as StoreProvider} from "react-redux";
import {DefaultTheme, Provider as PaperProvider} from "react-native-paper";
import store from "../store";
import {Navigation} from "../helpers";


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.blue,
        accent: Colors.blueCardItem,
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