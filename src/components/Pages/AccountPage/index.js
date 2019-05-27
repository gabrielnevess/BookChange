import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import AccountPage from "./AccountPage";
import RegisterPage from "../RegisterPage/RegisterPage";

export default createStackNavigator(
    {
        AccountPage: {screen: AccountPage},
        RegisterPage: {screen: RegisterPage},
        initialRouteName: Constants.ACCOUNT_PAGE
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);