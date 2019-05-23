import React, {Component} from "react";
import {BackHandler, ActivityIndicator, SafeAreaView, View, Image, FlatList} from "react-native";
import {Text, Card, Appbar, Divider} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {Constants} from "../../../util";
import {Colors} from "../../../styles";
import Styles from "./Styles";

export default class HomePage extends Component {

    didFocusSubscription;
    willBlurSubscription;

    static navigationOptions = ({navigation}) => ({
        header: (
            <Appbar.Header>
                <Image
                    resizeMode='stretch'
                    style={Styles.logo}
                    source={require("../../../assets/images/book-change-white.png")}/>
                <Appbar.Content/>
                <Appbar.Action
                    icon="search"
                    color={Colors.white}
                    onPress={() => navigation.navigate(Constants.SEARCH_PAGE)}/>
            </Appbar.Header>
        )
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

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
            <SafeAreaView style={{flex: 1, alignItems: "center"}}>
                <Text>Hello World</Text>
            </SafeAreaView>
        );
    }

}