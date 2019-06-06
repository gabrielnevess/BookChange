import React, {Component} from "react";
import {
    Text,
    Button,
    Card,
    Appbar,
    Paragraph,
    Divider,
    Portal,
    Dialog,
    RadioButton,
    IconButton,
    Checkbox
} from "react-native-paper";
import {BackHandler, ActivityIndicator, SafeAreaView, View, Image, ScrollView, Alert} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-community/async-storage";
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
                <Appbar.BackAction onPress={() => navigation.pop()}/>
                <Appbar.Content title={Constants.ANNOUCEMENT_DETAIL}/>
            </Appbar.Header>
        )
    });

    constructor(props) {
        super(props);

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });

        this.state = {
            loading: false,
        };

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

            let urlName = await AsyncStorage.getItem(Constants.URL);
            const url = urlName //urlNome
                + "/mobileserver?"
                + "className=br.com.percent.pedido.process.CentralPedido"
                + "&isBusinessObject=true"
                + "&methodName=getDadosProduto"
                + "&parameterValues=" + annoucement.in_anuncio_id
                + "&parameterTypes=" + ParamsTypes.INTEGER;
            console.log(url);

            const {data} = await Api.post(url);
            console.log("Annoucement: ", data);

            this.setState({
                annoucement: data,
                loading: false
            });

        } catch (error) {
            this.setState({loading: false});
            AlertError(error);
        }

    };

    renderItem = ({item}) => {
        const {urlName} = this.state;
        return <SliderEntry url={urlName} data={item}/>;
    };

    changePriceValue = () => {

        const {paymentList, selectedPicker, isVisible} = this.state;

        console.log("paymentList: ", paymentList);
        console.log("KEY DO PREÇO: ", selectedPicker);

        if (paymentList.length > 0) {

            // Recebe a forma de pagamento selecionada pelo usuário
            let paymentForm = paymentList[selectedPicker];

            console.log("PAYMENT FORM: ", paymentForm);
            // Calcula o preço do produto dividindo pelas parcelas
            let finalPrice = paymentForm.valor_total_final / paymentForm.sm_parcelas;
            let finalPriceEdited = "";
            let finalSubPrice = "";

            // Se houver mais de uma parcela...
            if (paymentForm.sm_parcelas > 1) {
                // Exibe a quantidade de parcelas junto com o preço final
                finalPriceEdited = `${paymentForm.sm_parcelas} x ${Currency(finalPrice, "BRL")}`;
                finalSubPrice = Currency(paymentForm.valor_total_final, "BRL");
            } else {
                finalPriceEdited = `${Currency(finalPrice, "BRL")}`;
            }

            let paymentFormList = `${paymentForm.in_forma_pagamento_id}; ${paymentForm.sm_parcelas}; ${paymentForm.valor_total_final}; ${paymentForm.sm_parcelas}; ${paymentForm.valor}; ${paymentForm.codigo_agrupamento}`;

            // Adiciona no state o valor do produto final
            this.setState({
                value: finalPriceEdited,
                subValue: finalSubPrice,
                paymentFormList: paymentFormList,
                isVisible: !isVisible
            });
        }
    };

    setPaymentConditionCode = async () => {

        const {useSwapMerchandise, paymentFormList, swapMerchandise} = this.state;
        this.setState({loading: !this.state.loading});

        let useCreditCard = "0";

        if (swapMerchandise != null) {
            useCreditCard = useSwapMerchandise ? "1" : "0";
        }

        try {

            const urlName = await AsyncStorage.getItem(Constants.URL)
            const urlPaymentConditionCode = urlName //urlNome
                + "/mobileserver?"
                + "className=br.com.percent.pedido.process.CentralPedido"
                + "&isBusinessObject=true"
                + "&methodName=setCodigoCondicaoPagamento"
                + "&parameterValues=" + paymentFormList
                + "&parameterValues=" + useCreditCard
                + "&parameterTypes=" + ParamsTypes.STRING
                + "&parameterTypes=" + ParamsTypes.INTEGER;

            console.log("urlPaymentConditionCode: ", urlPaymentConditionCode);
            await axios.post(urlPaymentConditionCode); // Request

            this.setState({loading: !this.state.loading});

        } catch (error) {
            this.setState({loading: !this.state.loading});
            AlertError(error);
        }
    };

    renderBuyButton = (product) => {
        return (
            <Button style={{backgroundColor: Colors.pink, marginRight: 5}} mode="contained" onPress={async () => {
                let newProduct = {product, paymentFormList: this.state.paymentFormList};
                /*
                    Verificação se o cpfCnpj é nulo, caso seja, o usuário será redirecionado para pagina de
                    cadastro de cliente, caso não seja, ele será redirecionado para pagina de detalhes da compra
                */

                const cpfCnpj = await AsyncStorage.getItem(Constants.CPF);
                this.setState({cpfCnpj: cpfCnpj});

                await this.getObjUser();
                this.setPaymentConditionCode();

                if (this.state.cpfCnpj === null) {
                    this.props.navigation.navigate(Constants.REGISTER_VERIFY_CPF_CNPJ_PAGE, {
                        product: newProduct
                    });
                } else {
                    this.props.navigation.navigate(Constants.CHECK_INVENTORY_PAGE, {
                        product: newProduct,
                        user: this.state.objUser
                    });
                }
                console.log("Botão de compra clicado.")
            }}>
                COMPRAR
            </Button>
        )
    };

    loadPaymentConditions = async (preco) => {

        const {product} = this.props.navigation.state.params;

        console.log("PRECO: ", preco);

        try {

            let urlName = await AsyncStorage.getItem(Constants.URL);
            const url = urlName //urlNome
                + "/mobileserver?"
                + "className=br.com.percent.pedido.process.CentralPedido"
                + "&isBusinessObject=true"
                + "&methodName=getCondicaoPagamento"
                + "&parameterValues=" + product.id
                + "&parameterValues=" + preco.tipoPreco
                + "&parameterValues=" + preco.codigoAgrupamento
                + "&parameterValues=" + (Currency(preco.preco, "BRL")).substring(3)
                + "&parameterTypes=" + ParamsTypes.INTEGER
                + "&parameterTypes=" + ParamsTypes.INTEGER
                + "&parameterTypes=" + ParamsTypes.STRING
                + "&parameterTypes=" + ParamsTypes.DOUBLE;

            console.log(url);

            const {data} = await axios.post(url);

            console.log("DATA LOG: ", data);

            let formasPagamento = [];
            data.formasPagamento.map((elementI, keyI) => {
                formasPagamento.push({label: elementI.va_nome_condicao, value: keyI});
            });

            this.setState({
                formasPagamento: formasPagamento,
                paymentList: data.formasPagamento
            });

            this.showDialog();

        } catch (error) {
            this.setState({loading: false});
            AlertError(error);
        }
    }

    showGeneralStock = () => this.setState({isStockVisible: !this.state.isStockVisible});

    showSwapAccountsDialog = (data) =>
        this.setState({
            isSwapAccountsVisible: !this.state.isSwapAccountsVisible,
            swapMerchandise: data != null ? String(true) : data,
            orderId: data != null ? data.pedidoId : data
        });

    getGeneralStock = () => {
        const {isStockVisible} = this.state;

        if (isStockVisible) {
            const {product} = this.props.navigation.state.params;
            return (
                <StocksDialog
                    productId={product.id}
                    isVisible={isStockVisible}
                    showDialog={this.showGeneralStock}
                />
            );
        }
    }

    getSwapAccounts = () => {
        const {isSwapAccountsVisible} = this.state;

        if (isSwapAccountsVisible) {
            return (
                <SwapMerchandiseDialog
                    isVisible={isSwapAccountsVisible}
                    showDialog={this.showSwapAccountsDialog}
                />
            );
        }
    }

    returnProduct = (product) => {

        const {orderId, swapMerchandise, useSwapMerchandise} = this.state;

        let bookmarkColor = Colors.black;
        // Configura a cor do bookmark
        if (product.sinalizadorEstoque == 1) {
            bookmarkColor = Colors.blue
        } else if (product.sinalizadorEstoque == 2) {
            bookmarkColor = Colors.green;
        } else if (product.sinalizadorEstoque == 3) {
            bookmarkColor = Colors.yellow;
        } else {
            bookmarkColor = Colors.red
        }

        return (
            <View>
                <Text style={[Styles.textPricePromotion, {marginTop: 20}]}>{product.produtoNome}</Text>
                <Text>Cód. Item: {product.produtoCodigo}</Text>
                <Text>Cód. EAN: {product.produtoCodigoBarras}</Text>

                <Carousel
                    initialNumToRender={1}
                    maxToRenderPerBatch={2}
                    data={product.fotos}
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

                <Row>
                    {

                        orderId == null &&
                        <IconButton
                            color={Colors.gray} icon="shuffle"
                            onPress={() => this.showSwapAccountsDialog(null)}/>
                    }

                    {
                        product.foraLinha == 1 &&
                        <IconButton
                            color={Colors.red} icon="flare"
                            onPress={() => {

                                Alert.alert(
                                    "",
                                    "Produto fora de linha.",
                                    [
                                        {
                                            text: "Não",
                                            onPress: () => false
                                        },
                                        {
                                            text: "Sim",
                                            onPress: () => false
                                        },
                                    ],
                                    {cancelable: false}
                                )
                            }}/>
                    }

                    <IconButton
                        color={bookmarkColor} icon="bookmark"
                        onPress={() => this.showGeneralStock()}/>

                    {/* <IconButton
                        color={Colors.gray} icon="portrait"
                        onPress={() => {

                            Alert.alert(
                                "",
                                "Desconto para produto?",
                                [
                                    {
                                        text: "Não",
                                        onPress: () => false
                                    },
                                    {
                                        text: "Sim",
                                        onPress: () => false
                                    },
                                ],
                                {cancelable: false}
                            )
                        }}/> */}

                    {/*<IconButton
                        color={Colors.gray} icon="monetization-on"
                        onPress={() => {

                            Alert.alert(
                                "",
                                "Simular compra?",
                                [
                                    {
                                        text: "Não",
                                        onPress: () => false
                                    },
                                    {
                                        text: "Sim",
                                        onPress: () => false
                                    },
                                ],
                                {cancelable: false}
                            )
                        }}/>*/}
                </Row>

                <Card
                    elevation={3}
                    style={{marginTop: 5}}>
                    <Card.Title
                        theme={{
                            colors: {
                                text: Colors.white
                            }
                        }}
                        style={Styles.cardItem}
                        title={this.state.value}
                        subtitle={this.state.subValue}
                        right={() => this.renderBuyButton(product)}/>
                    <Divider/>
                    <Card.Content>

                        {
                            swapMerchandise != null &&
                            <Row style={{
                                alignItems: "center"
                            }}>
                                <Checkbox
                                    status={useSwapMerchandise ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        this.setState({
                                            useSwapMerchandise: !this.state.useSwapMerchandise
                                        });
                                    }}
                                />
                                <Text style={{fontSize: Fonts.regular}}> Utilizar carta de crétido</Text>
                            </Row>
                        }

                        <Paragraph style={{margin: 5, fontSize: 16, fontWeight: "bold"}}>Escolha a forma de
                            pagamento:</Paragraph>
                        <Grid>
                            <Col>

                                {
                                    product.precos.map((elementI, keyI) => {

                                        let tipoPreco = elementI.tipoPreco;
                                        let uriImage = require("../../../assets/imgs/imperio.png");

                                        if (tipoPreco == 2) {
                                            uriImage = {uri: `${this.state.urlName}/~extensions.cache/pedido/images/logo_oferta_do_dono.png`};
                                        } else if (tipoPreco != 2 && tipoPreco != 0) {
                                            uriImage = {uri: `${this.state.urlName}/${elementI.url}`};
                                        }

                                        if (tipoPreco != 2) {
                                            return (
                                                <Row
                                                    size={2}
                                                    key={keyI}
                                                    style={{
                                                        justifyContent: "flex-start",
                                                        alignItems: "center"
                                                    }}
                                                    onPress={() => this.loadPaymentConditions(elementI)}
                                                >
                                                    <Image
                                                        source={uriImage}
                                                        style={[Styles.progressiveImageQuaternary, {
                                                            marginTop: 5,
                                                            marginLeft: 10,
                                                            marginRight: 70
                                                        }]}
                                                        defaultSource={require("../../../assets/imgs/imperio.png")}
                                                    />

                                                    <Paragraph
                                                        style={{marginLeft: 70}}>{`${Currency(elementI.preco, "BRL")}`}</Paragraph>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                        </Grid>
                    </Card.Content>
                </Card>

                {this.returnWarranty(product)}
                {this.returnFeatures(product)}

            </View>
        );
    };

    returnFeatures = (product) => {
        return (

            <Card
                elevation={3}
                style={{marginTop: 5, marginBottom: 10}}>
                <Card.Title
                    theme={{
                        colors: {
                            text: Colors.white
                        }
                    }}
                    style={Styles.cardItem} title="Características"/>
                <Card.Content>
                    {
                        product.caracteristicas.map((elementI, keyI) => {
                            return (
                                <View key={keyI}>
                                    <Text>
                                        <Text style={{fontWeight: "bold"}}>{elementI.titulo} </Text>
                                        <Text>{elementI.descricao}</Text>
                                    </Text>
                                </View>
                            )
                        })
                    }
                </Card.Content>
            </Card>
        );
    };

    returnWarranty = (product) => {
        if (product.servicos.garantias.length != 0) {
            return (

                <Card
                    elevation={3}
                    style={{marginTop: 5, marginBottom: 10}}>
                    <Card.Title
                        theme={{
                            colors: {
                                text: Colors.white
                            }
                        }}
                        style={Styles.cardItem} title="Opções da garantia"/>
                    <Card.Content>
                        {
                            product.servicos.garantias.map((elementI, keyI) => {
                                return (
                                    <View key={keyI} style={{flexDirection: "row", alignItems: "center"}}>
                                        <View style={{flexDirection: "column"}}>
                                            <Image
                                                resizeMode={"contain"}
                                                source={{uri: `${this.state.urlName}/~extensions.cache/pedido/images/garantia-${elementI.tempo}-meses.png`}}
                                                style={Styles.progressiveImageTertiary}/>
                                        </View>
                                        <View style={{flexDirection: "column"}}>
                                            <Paragraph style={{marginLeft: 40}}>{`R$ ${elementI.preco}`}</Paragraph>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </Card.Content>
                </Card>
            );
        }
    };

    showDialog = () => this.setState({isVisible: !this.state.isVisible});

    renderDialog = () => {

        const {isVisible, formasPagamento} = this.state;

        if (isVisible) {
            return (
                <Portal>
                    <Dialog
                        style={{height: 300}}
                        dismissable={false}
                        visible={isVisible}
                    >
                        <Dialog.Title>Formas de Pagamento</Dialog.Title>
                        <Dialog.ScrollArea>
                            <ScrollView>
                                <RadioButton.Group
                                    onValueChange={(value) => this.setState({selectedPicker: value})}
                                    value={this.state.selectedPicker}
                                >
                                    {
                                        formasPagamento.map((elementI, keyI) => {
                                            return (
                                                <Grid key={keyI}>
                                                    <Col style={{justifyContent: "center"}}>
                                                        <Row style={{alignItems: "center"}}>
                                                            <RadioButton value={elementI.value}/>
                                                            <Text>{elementI.label}</Text>
                                                        </Row>
                                                    </Col>
                                                </Grid>
                                            )
                                        })
                                    }
                                </RadioButton.Group>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button onPress={() => this.showDialog()}>Cancelar</Button>
                            <Button onPress={() => this.changePriceValue()}>Concluir</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            );
        }
    }

    loading = () => {

        const {loading, product} = this.state;

        if (loading) {
            return (
                <View style={{alignSelf: "center", marginVertical: 20}}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            );
        }

        if (product) {
            return this.returnProduct(product);
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
                    {this.renderDialog()}
                    {this.getGeneralStock()}
                    {this.getSwapAccounts()}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}
