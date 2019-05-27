import React, {Component} from "react";
import {ActivityIndicator, Image, SafeAreaView, View, StyleSheet} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Button, Text, TextInput} from "react-native-paper";
import {Constants} from "../../util";
import {Colors} from "../../styles";
import {Navigation} from "../../helpers";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };

    }

    renderBtnAcessar = () => {
        const {loading} = this.props;
        if (loading) {
            return (
                <View style={{marginTop: 10}}>
                    <ActivityIndicator size="large"/>
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
        const {email, password} = this.state;
        this.props.userRequestLogin(email, password);
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAwareScrollView>
                    <View style={Styles.viewImage}>
                        <Image
                            resizeMode="stretch"
                            style={Styles.logo}
                            source={require("../../assets/images/book-change-black.png")}/>
                    </View>
                    <View style={Styles.container}>
                        <TextInput
                            label="E-mail"
                            mode="outlined"
                            disabled={this.props.loading}
                            value={this.state.email}
                            onChangeText={(email) => this.setState({email})}
                        />
                        <TextInput
                            label="Senha"
                            mode="outlined"
                            disabled={this.props.loading}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                        />
                        <View style={{marginTop: 5}}>
                            {this.renderBtnAcessar()}
                            <View style={{marginTop: 5}}>
                                <Button
                                    mode="text"
                                    onPress={() => Navigation.navigate(Constants.REGISTER_PAGE)}>
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

const Styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        width: 200,
        height: 135
    },
    textRegister: {
        textAlign: "center",
        color: Colors.black
    },
    textSignIn: {
        textAlign: "center",
        color: Colors.white
    },
    buttonLogin: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.blue,
    },
    container: {
        flex: 3,
        marginTop: 50,
        marginHorizontal: 5
    },
    viewImage: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
        marginBottom: 15
    }
});