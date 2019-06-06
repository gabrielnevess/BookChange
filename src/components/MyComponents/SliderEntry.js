import React, {Component} from "react";
import {Image, StyleSheet} from "react-native";
import {Card} from "react-native-paper";
import {Dimensions} from "../../util";

function wp(percentage) {
    const value = (percentage * Dimensions.WIDTH) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class SliderEntry extends Component {

    get image() {
        const {data, url} = this.props;
        return (
            <Image
                resizeMode={"contain"}
                source={{uri: `${url}/${data.url}`}}
                style={styles.image}
                defaultSource={require("../../assets/images/book-change-black.png")}/>
        );
    };

    render() {
        return (
            <Card style={styles.imageContainer}>
                <Card.Content style={styles.imageContainer}>
                    {this.image}
                </Card.Content>
            </Card>
        );
    }
}

export const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
    },
    image: {
        height: Dimensions.WIDTH / 1.5,
        width: Dimensions.WIDTH / 1.1
    }
});
