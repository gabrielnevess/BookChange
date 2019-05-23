import { StyleSheet } from "react-native";
import {Colors} from "../../../styles";

export default StyleSheet.create({
    logo: {
        alignSelf: "center",
        width: 200,
        height: 135
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