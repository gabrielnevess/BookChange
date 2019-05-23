import React, {Component} from "react";
import {BackHandler, SafeAreaView} from "react-native";
import {Appbar} from "react-native-paper";
import {Colors} from "../../../styles";

export default class AccountPage extends Component {

    didFocusSubscription;
    willBlurSubscription;

    static navigationOptions = ({navigation}) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.Content
                        color={Colors.white}
                        title="Perfil"/>
                </Appbar.Header>
            )
        }

    };

    constructor(props) {
        super(props);

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });

    }

    componentDidMount() {

        this.willBlurSubscription = this.props.navigation.addListener("willBlur", () => {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPressionado)
        });

    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    onBackPressionado = () => {
        BackHandler.exitApp();
        return true;
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1, alignItems: "center"}}></SafeAreaView>
        );
    }

}