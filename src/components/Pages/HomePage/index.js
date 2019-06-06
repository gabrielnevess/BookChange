import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";
import {Animated} from "react-native";

/* paginas */
import HomePage from "./HomePage";
import SearchPage from "../SearchPage/SearchPage";
//import AnnoucementDetailPage from "../AnnouncementDetailPage";

export default createStackNavigator(
    {
        HomePage: {screen: HomePage},
        SearchPage: {
            screen: SearchPage,
            navigationOptions: {
                header: null
            }
        },
        // AnnoucementDetailPage: {
        //     screen: AnnoucementDetailPage,
        //     navigationOptions: {
        //         header: null
        //     }
        // },
        initialRouteName: Constants.HOME_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        headerMode: "screen",
        transitionConfig : () => ({
            transitionSpec: {
                duration: 200,
                timing: Animated.timing,
            },
        }),
    }
);
