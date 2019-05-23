import React, {Component} from "react";
import {BackHandler, ActivityIndicator, SafeAreaView, View, FlatList, Image} from "react-native";
import {Text, Card, Appbar, Divider, Searchbar} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {Constants} from "../../../util";
// import {Dialog} from "../../../helpers";
import {Colors} from "../../../styles";
import Styles from "./Styles";

export default class SearchPage extends Component {

    didFocusSubscription;
    willBlurSubscription;

    static navigationOptions = ({navigation}) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.pop()}/>
                    <SafeAreaView style={{flex: 1}}>
                        {
                            !navigation.state.params ?
                                <Searchbar
                                    placeholder="Pesquisar"/> :
                                <Searchbar
                                    placeholder="Pesquisar"
                                    autoFocus
                                    value={navigation.state.params.firstQuery}
                                    onChangeText={(query) => navigation.state.params.onChangeTextSearchbar(query)}
                                    onSubmitEditing={() => navigation.state.params.onSubmitEditing(navigation.state.params.firstQuery)}
                                />
                        }
                    </SafeAreaView>
                </Appbar.Header>
            )
        }

    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            productList: null
        };

        this.didFocusSubscription = props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPressionado);
        });

    }

    componentWillMount() {
        this.props.navigation.setParams({
            firstQuery: "",
            onChangeTextSearchbar: this.onChangeTextSearchbar.bind(this),
            onSubmitEditing: this.onSubmitEditing.bind(this)
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

    onChangeTextSearchbar = (query) => {
        this.props.navigation.setParams({
            firstQuery: query
        });
    };

    onSubmitEditing = (query) => {
        if (query.trim().length !== 0) {
            //this.loadSearch(query);
        }
    };

    onBackPressionado = () => {
        BackHandler.exitApp();
        return true;
    };

    loading = () => {

        const {loading, productList} = this.state;
        if (loading) {
            return (
                <View style={{alignSelf: 'center', marginVertical: 22}}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            );
        }

        if (productList !== null && productList.length === 0) {
            return (
                <View style={{alignSelf: 'center', marginVertical: 22}}>
                    <Text>Não encontramos nenhum dado correspondente a sua pesquisa.</Text>
                </View>
            );
        }

        // return (
        //     <FlatList
        //         style={{marginBottom: 60}}
        //         data={productList}
        //         renderItem={this.renderProduct}
        //         keyExtractor={item => String(item.id)} // É obrigatório utilizar item, é padrão do flatlist
        //         numColumns={2}
        //         disableVirtualization={true}/>
        // );
    };

    // renderProduct = ({item}) => {
    //     return (
    //         <Card style={Styles.cardContainer} onPress={() => {
    //             this.props.navigation.navigate(Constants.PRODUCT_DETAIL_PAGE, {product: item})
    //         }}>
    //             <Card.Content>
    //                 <Image
    //                     resizeMode={"stretch"}
    //                     source={{uri: `${this.state.urlName}/${item.foto}`}}
    //                     style={Styles.image}
    //                     defaultSource={require("../../../assets/imgs/imperio.png")}/>
    //                 <Divider/>
    //                 <Text style={{margin: 2}}>{item.nome}</Text>
    //                 <Divider/>
    //                 {
    //                     item.preco_normal_double != item.preco_promocao_double &&
    //                     <Text style={Styles.textPrice}>{Currency(item.preco_normal_double, "BRL")}</Text>
    //                 }
    //                 <Text style={Styles.textPricePromotion}>{Currency(item.preco_promocao_double, "BRL")}</Text>
    //                 <Text>{item.sm_parcelas} x {Currency((item.preco_promocao_double / item.sm_parcelas), "BRL")}</Text>
    //             </Card.Content>
    //         </Card>
    //     );
    // };

    render() {
        return (
            <SafeAreaView style={{flex: 1, alignItems: "center"}}>
                {this.loading()}
            </SafeAreaView>
        );
    }

}