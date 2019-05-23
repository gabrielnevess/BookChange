import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import SearchPage from "./SearchPage";

export default createStackNavigator(
    {
        SearchPage: {screen: SearchPage},
        initialRouteName: Constants.SEARCH_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);