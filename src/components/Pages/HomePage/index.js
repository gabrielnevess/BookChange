import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import HomePage from "./HomePage";
import SearchPage from "../SearchPage";

export default createStackNavigator(
    {
        HomePage: {screen: HomePage},
        SearchPage: {
            screen: SearchPage,
            navigationOptions: {
                header: null
            }
        },
        initialRouteName: Constants.HOME_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);