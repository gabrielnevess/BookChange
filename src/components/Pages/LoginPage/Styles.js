import { StyleSheet } from "react-native";
import {Colors} from "../../../styles";

export default StyleSheet.create({
    logo: {
        alignSelf: "center",
        width: 200,
        height: 130
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
    inputStyle: {
        backgroundColor: Colors.whiteSmoke
    },
    container: {
        flex: 3,
        marginTop: 50,
        marginHorizontal: 5
    },
    buttonConf: {
        width: 50,
        height: 50
    },
    viewImage: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
        marginBottom: 15
    }
});