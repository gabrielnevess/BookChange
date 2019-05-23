import React, {Component} from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';
import {Constants} from "../../../util";
import AsyncStorage from "@react-native-community/async-storage";

export default class LoadingScreenPage extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const isTokenNull = await AsyncStorage.getItem(Constants.TOKEN);
        this.props.navigation.navigate(isTokenNull === null ? Constants.LOGIN_PAGE :Constants.HOME_PAGE);
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator/>
            </SafeAreaView>
        );
    }
}