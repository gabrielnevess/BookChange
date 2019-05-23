import {createStackNavigator} from "react-navigation";
import {Constants} from "../../../util";

/* paginas */
import RegisterPage from "./RegisterPage";

export default createStackNavigator(
    {
        Account: {screen: RegisterPage},
        initialRouteName: Constants.REGISTER_PAGE,
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);