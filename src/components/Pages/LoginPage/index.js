import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import LoginPage from "./LoginPage";
import RegisterPage from "../RegisterPage";

export default createStackNavigator(
    {
        LoginPage: {
            screen: LoginPage,
            navigationOptions: {
                header: null
            }
        },
        RegisterPage: {
            screen: RegisterPage,
            navigationOptions: {
                header: null
            }
        },
        initialRouteName: Constants.REGISTER_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);