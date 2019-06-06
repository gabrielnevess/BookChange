import {StyleSheet} from "react-native";
import {Fonts} from "../../../styles";

export default StyleSheet.create({
    sliderContentContainer: {
        paddingVertical: 10, // for custom animation
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    textTitleAnnoucement: {
        fontSize: Fonts.extraLarge,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10
    },
    textDescripton: {
        textAlign: "justify"
    },
    textSummaryBook: {
        alignSelf: "flex-start",
        fontWeight: "bold"
    }
});
