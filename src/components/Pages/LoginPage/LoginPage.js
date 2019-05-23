import React, {Component} from "react";
import {ActivityIndicator, BackHandler, SafeAreaView, View, Image} from "react-native";
import {Button, TextInput, Text} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {Colors} from "../../../styles";
import Styles from "./Styles";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import UserActions from "../../../store/Ducks/User";
import SplashScreen from "react-native-splash-screen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Constants} from "../../../util";

class LoginPage extends Component {

    didFocusSubscription;
    willBlurSubscription;

    constructor(props) {
        super(props);

        this.state = {
            registry: "",
            password: ""
        };

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });

    }

    async componentWillMount() {
    }

    componentDidMount() {

        SplashScreen.hide();

        this.willBlurSubscription = this.props.navigation.addListener("willBlur", () => {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPressionado)
        });
    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    renderBtnAcessar = () => {

        const {loading} = this.props;

        if (loading) {
            return (
                <View style={{marginTop: 10}}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            );
        }

        return (
            <Button
                mode="contained"
                onPress={() => this.userAuth()}>
                <Text style={Styles.textSignIn}>ENTRAR</Text>
            </Button>
        );
    };

    //método para autenticar-se
    userAuth = () => {

    };

    onBackPressionado = () => {
        BackHandler.exitApp();
        return true;
    };

    render() {

        const {loading} = this.props;

        return (

            <SafeAreaView style={{flex: 1}}>

                <KeyboardAwareScrollView>

                    <View style={Styles.viewImage}>
                        <Image
                            resizeMode="stretch"
                            style={Styles.logo}
                            source={require("../../../assets/images/book-change-black.png")}/>
                    </View>

                    <View style={Styles.container}>

                        <TextInput
                            label="E-mail"
                            mode="outlined"
                            disabled={loading}
                            value={this.state.registry}
                            onChangeText={(registry) => this.setState({registry})}
                        />

                        <TextInput
                            label="Senha"
                            mode="outlined"
                            disabled={loading}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                        />

                        <View style={{marginTop: 5}}>

                            {this.renderBtnAcessar()}

                            <View style={{marginTop: 5}}>
                                <Button
                                    mode="text"
                                    onPress={() => this.props.navigation.navigate(Constants.REGISTER_PAGE)}>
                                    <Text style={Styles.textRegister}>REGISTRAR-SE</Text>
                                </Button>
                            </View>

                        </View>

                    </View>

                </KeyboardAwareScrollView>

            </SafeAreaView>

        );
    }

}

const mapStateToProps = ({user}) => ({
    loading: user.loading
});

const mapDispatchToProps = dispatch => bindActionCreators(UserActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);