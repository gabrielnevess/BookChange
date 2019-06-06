import React, {Component} from "react";
import {Appbar} from "react-native-paper";
import {BackHandler, ActivityIndicator, SafeAreaView, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Constants, Dimensions} from "../../../util";
import Carousel from "react-native-snap-carousel";
import {SliderEntry} from "../../MyComponents";
import {baseURL} from "../../../helpers/Api";
import {Colors} from "../../../styles";
import {Api} from "../../../helpers";
import Styles from "./Styles";

export default class AnnoucementDetailPage extends Component {

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
            annoucementList: []
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

            //se não encontrar nenhuma imagem no array de imagens
            if (data.imagens.length === 0) {
                data.imagens = [{url: ""}];
            }

            this.setState({
                annoucementList: data,
                loading: false
            });

        } catch (error) {
            console.log(error);
            this.setState({loading: false});
        }

    };

    renderItem = ({item}) => {
        return <SliderEntry url={`${baseURL}/anuncio_imagens`} data={item}/>;
    };

    renderAnnoucementDetail = () => {
        return (
            <Carousel
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                data={this.state.annoucementList.imagens}
                renderItem={this.renderItem}
                sliderWidth={Dimensions.WIDTH}
                itemWidth={Dimensions.WIDTH * 0.95 + 10}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={1}
                enableMomentum={true}
                activeSlideAlignment={"start"}
                containerCustomStyle={Styles.slider}
                contentContainerCustomStyle={Styles.sliderContentContainer}
                activeAnimationType={"spring"}
                loop={true}
                activeAnimationOptions={{friction: 2, tension: 40}}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={3000}
            />
        );
    };

    loading = () => {

        const {loading} = this.state;

        if (loading) {
            return (
                <View style={{alignSelf: "center", marginVertical: 20}}>
                    <ActivityIndicator size="large" color={Colors.lightPink}/>
                </View>
            );
        }

        if(this.state.annoucementList.length !== 0) {
            return this.renderAnnoucementDetail();
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
