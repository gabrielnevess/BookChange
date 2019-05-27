import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import AccountPage from "./AccountPage";
import RegisterPage from "../RegisterPage";

export default createStackNavigator(
    {
        Account: {screen: AccountPage},
        RegisterPage: {
            screen: RegisterPage,
            navigationOptions: {
                header: null
            }
        },
        initialRouteName: Constants.ACCOUNT_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);