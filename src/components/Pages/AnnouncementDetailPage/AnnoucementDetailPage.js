import React, {Component} from "react";
import {Appbar, Avatar, Text, Button} from "react-native-paper";
import {BackHandler, ActivityIndicator, SafeAreaView, View, Alert} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Constants, Dimensions} from "../../../util";
import Carousel from "react-native-snap-carousel";
import {SliderEntry} from "../../MyComponents";
import {baseURL} from "../../../helpers/Api";
import {Colors} from "../../../styles";
import {Api} from "../../../helpers";
import Styles from "./Styles";
import Moment from "moment";
import "moment/locale/pt-br";

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
            annoucement: null
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
                annoucement: data,
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

        const {annoucement} = this.state;

        return (
            <Grid>
                <Row size={75} style={{justifyContent: "center", alignItems: "center"}}>
                    <Col>
                        <Row style={{justifyContent: "center", alignItems: "center"}}>
                            <Text style={Styles.textTitleAnnoucement}>{annoucement.va_titulo_livro}</Text>
                        </Row>
                        <Carousel
                            initialNumToRender={1}
                            maxToRenderPerBatch={2}
                            data={annoucement.imagens}
                            renderItem={this.renderItem}
                            sliderWidth={Dimensions.WIDTH}
                            itemWidth={Dimensions.WIDTH * 0.95}
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
                        <Col>
                            <Row style={{alignItems: "center"}}>
                                <Text style={[Styles.textSummaryBook, {marginRight: 5}]}>
                                    {annoucement.en_tipo_anuncio === "troca" ? "Troca" : "Venda"}
                                </Text>
                                <Avatar.Icon size={24}
                                             icon={annoucement.en_tipo_anuncio === "troca" ? "swap-horiz" : "attach-money"}/>
                            </Row>
                            <Row>
                                <Text style={Styles.textSummaryBook}>Postado: </Text>
                                <Text>{Moment(annoucement.dt_data_criacao).format("LLL")}</Text>
                            </Row>
                            <Row>
                                <Text style={Styles.textSummaryBook}>Autor: </Text>
                                <Text>{annoucement.va_autor_livro}</Text>
                            </Row>
                            <Row>
                                <Text style={Styles.textSummaryBook}>Estado: </Text>
                                <Text>{annoucement.en_estado === "novo" ? "Novo" : "Usado"}</Text>
                            </Row>
                            <Text style={Styles.textSummaryBook}>Resumo do Livro: </Text>
                            <Text style={Styles.textDescripton}>{annoucement.va_descricao}</Text>
                        </Col>
                    </Col>
                </Row>
                <Row size={25} style={{alignItems: "center", justifyContent: "center"}}>
                    <Button
                        style={{backgroundColor: Colors.lightPink, marginTop: 30, marginBottom: 20}}
                        mode="contained" onPress={() => {
                        false
                        Alert.alert(
                            "Dados do Anunciante",
                            `Nome do Anunciante: ${annoucement.usuario.va_nome}\n` +
                            `Celular: ${annoucement.usuario.va_celular}\n` +
                            `E-mail: ${annoucement.usuario.va_email}`,
                            [
                                {text: "Fechar", onPress: () => false},
                            ],
                            {cancelable: false}
                        )
                    }}>
                        <Text style={{color: Colors.white}}>Entrar em Contato com Anunciante</Text>
                    </Button>
                </Row>
            </Grid>
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

        if (this.state.annoucement !== null) {
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
