import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import HomePage from "./HomePage";
import SearchPage from "../SearchPage/SearchPage";

export default createStackNavigator(
    {
        HomePage: {screen: HomePage},
        SearchPage: {screen: SearchPage},
        initialRouteName: Constants.HOME_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);