import React, {Component} from "react";
import {Appbar} from "react-native-paper";
import {BackHandler, ActivityIndicator, SafeAreaView, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Col, Row, Grid} from "react-native-easy-grid";
import Carousel from "react-native-snap-carousel";
import {SliderEntry} from "../../MyComponents";
import {Constants} from "../../../util";
import {Colors} from "../../../styles";
import Styles from "./Styles";
import {Api} from "../../../helpers";

export default class ProductDetailPage extends Component {

    didFocusSubscription;
    willBlurSubscription;

    static navigationOptions = ({navigation}) => ({
        header: (
            <Appbar.Header>
                <Appbar.BackAction
                    color={Colors.white}
                    onPress={() => navigation.pop()}
                />
                <Appbar.Content
                    color={Colors.white}
                    title={Constants.ANNOUCEMENT_DETAIL}
                />
            </Appbar.Header>
        )
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });
    }

    async componentDidMount() {

        this.loadAnnoucementDetail = this.props.navigation.addListener("willFocus", this.loadAnnoucementDetail);
        this.willBlurSubscription = this.props.navigation.addListener("willBlur", () => {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPressionado)
        });

    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.loadAnnoucementDetail && this.loadAnnoucementDetail.remove();
    }

    loadAnnoucementDetail = async () => {

        const {annoucement} = this.props.navigation.state.params;
        this.setState({loading: true});

        try {

            const {data} = await Api.get(`/anuncios/${annoucement.in_anuncio_id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Annoucement: ", data);

            this.setState({
                annoucement: data,
                loading: false
            });

        } catch (error) {
            console.log(error);
            this.setState({loading: false});
        }

    };

    // renderItem = ({item}) => {
    //     const {urlName} = this.state;
    //     return <SliderEntry url={urlName} data={item}/>;
    // };

    loading = () => {

        const {loading} = this.state;

        if (loading) {
            return (
                <View style={{alignSelf: "center", marginVertical: 20}}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            );
        }

    };

    onBackPressionado = () => {
        this.props.navigation.pop();
        return true;
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1, marginHorizontal: 5, marginTop: 5}}>
                <KeyboardAwareScrollView>
                    {this.loading()}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}
