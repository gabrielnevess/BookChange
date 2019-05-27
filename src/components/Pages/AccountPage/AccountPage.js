import React, {Component} from "react";
import {BackHandler, SafeAreaView, Alert} from "react-native";
import {Appbar, Button, Text} from "react-native-paper";
import {Colors} from "../../../styles";
import {bindActionCreators} from "redux";
import UserActions from "../../../store/Ducks/User";
import {connect} from "react-redux";
import {Constants} from "../../../util";
import AsyncStorage from "@react-native-community/async-storage";
import Login from "../../MyComponents/Login";

class AccountPage extends Component {

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

        if (this.props.token === null) {
            return (
                <Login {...this.props} />
            )
        }
        return (
            <SafeAreaView style={{flex: 1, alignItems: "center"}}>
                <Button
                    mode="contained"
                    onPress={() => {

                        Alert.alert(
                            'Já vai?',
                            'Deseja realmente sair?',
                            [
                                {text: 'Não', onPress: () => console.log('Cancel Pressed')},
                                {
                                    text: 'Sim', onPress: () => {
                                        AsyncStorage.removeItem(Constants.TOKEN);
                                        this.props.userSetToken(null);
                                    }
                                },
                            ],
                            {cancelable: false},
                        );
                    }}>
                    <Text>Sair</Text>
                </Button>
            </SafeAreaView>
        );
    }

}

const mapStateToProps = ({user}) => ({
    loading: user.loading,
    token: user.token,
});

const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountPage);