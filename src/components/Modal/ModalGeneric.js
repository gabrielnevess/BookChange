import React, {Component} from "react";
import {Portal, Modal, Appbar} from "react-native-paper";
import {SafeAreaView, StyleSheet} from "react-native";
import {Colors} from "../../styles";

export default class ModalGeneric extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {visible, showHideModal, children} = this.props;
        return (
            <Portal>
                <Modal
                    visible={visible}
                    contentContainerStyle={Styles.container}
                    dismissable={false}
                >
                    <Appbar.Header>
                        <Appbar.Content />
                        <Appbar.Action
                            icon="close"
                            onPress={() => showHideModal()}/>
                    </Appbar.Header>
                    <SafeAreaView style={{flex: 1}}>
                        {children}
                    </SafeAreaView>
                </Modal>
            </Portal>
        );

    }
}

const Styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: Colors.white
    },
});
