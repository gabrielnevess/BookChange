import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import AnnoucementDetailPage from "./AnnoucementDetailPage";
import {Animated} from "react-native";

export default createStackNavigator(
    {
        AnnoucementDetailPage: {screen: AnnoucementDetailPage},
        initialRouteName: Constants.ANNOUCEMENT_DETAIL_PAGE,
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
