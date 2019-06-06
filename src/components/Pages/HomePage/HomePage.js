import React, {Component} from "react";
import {BackHandler, ActivityIndicator, SafeAreaView, View, Image, FlatList} from "react-native";
import {Text, Card, Appbar, Avatar} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {Constants} from "../../../util";
import {Colors} from "../../../styles";
import Styles from "./Styles";
import {Api} from "../../../helpers";
import {baseURL} from "../../../helpers/Api";
import {Grid, Col} from "react-native-easy-grid";
import SplashScreen from "react-native-splash-screen";
import {bindActionCreators} from "redux";
import UserActions from "../../../store/Ducks/User";
import {connect} from "react-redux";

class HomePage extends Component {

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
            loading: false,
            isEndLine: false,
            dataList: [],
            page: 1,
        };

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });
    }

    async componentDidMount() {
        SplashScreen.hide();

        const storage = await AsyncStorage.getItem(Constants.TOKEN);
        this.props.userSetToken(storage); //set token

        this.willBlurSubscription = this.props.navigation.addListener("willBlur", () => {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPressionado)
        });
        this.loadDataList();
    }

    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    onBackPressionado = () => {
        BackHandler.exitApp();
        return true;
    };

    loadDataList = async () => {

        if (!this.state.loading && !this.state.isEndLine) {

            const {page} = this.state;
            this.setState({loading: true});

            try {

                const {data} = await Api.get(`/anuncios?page=${page}&limit=${10}`, {
                    headers: {
                        "Authorization": `Bearer ${this.props.token}`,
                        "Content-Type": "application/json"
                    }
                });
                console.log(data.content);

                if(data.content.data.length > 0) {
                    this.setState({
                        dataList: [...this.state.dataList, ...data.content.data],
                        page: page + 1,
                        loading: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                        isEndLine: true
                    });
                }

            } catch (e) {
                console.log(e);
                this.setState({loading: false});
            }

        }

    };

    renderAnuncios = ({item, index}) => {
        let image = item.imagens[index] ? {uri: `${baseURL}/anuncio_imagens/${item.imagens[index].te_path}`} : null;
        return (
            <Card
                elevation={3}
                style={Styles.cardContainer}
                onPress={() => this.props.navigation.navigate(Constants.ANNOUCEMENT_DETAIL_PAGE, {
                    annoucement: item
                })}
            >
                <Grid>
                    <Col style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image
                            resizeMode={"contain"}
                            source={image}
                            style={Styles.image}
                            defaultSource={require("../../../assets/images/book-change-black.png")}/>
                    </Col>
                    <Col>
                        <Col style={{alignItems: "flex-end"}}>
                            <Avatar.Icon size={24} icon={item.en_tipo_anuncio === "troca" ? "swap-horiz" : "attach-money"}/>
                        </Col>
                        <Col style={{ alignItems: "flex-end" }}>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.va_titulo_livro}</Text>
                            <Text>{item.va_autor_livro}</Text>
                            <Text>{item.va_ano_livro}</Text>
                        </Col>
                    </Col>
                </Grid>
            </Card>
        );

    };

    renderFooter = () => {
        const {loading} = this.state;
        if (!loading) {
            return null
        }
        return (
            <View style={{alignSelf: 'center', marginVertical: 22}}>
                <ActivityIndicator size="large" color={Colors.lightPink}/>
            </View>
        );
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <FlatList
                    style={{marginBottom: 55, marginTop: 5}}
                    data={this.state.dataList}
                    renderItem={this.renderAnuncios}
                    keyExtractor={item => String(item.in_anuncio_id)} // É obrigatório utilizar item, é padrão do flatlist
                    onEndReached={this.loadDataList}
                    onEndReachedThreshold={0.9} // Chegando em 10% do fim da flatlist chama o onEndReached
                    numColumns={1}
                    disableVirtualization={true}
                    ListFooterComponent={this.renderFooter}
                />
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
)(HomePage);
