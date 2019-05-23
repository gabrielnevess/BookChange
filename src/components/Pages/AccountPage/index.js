import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import AccountPage from "./AccountPage";

export default createStackNavigator(
    {
        Account: {screen: AccountPage},
        initialRouteName: Constants.ACCOUNT_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);