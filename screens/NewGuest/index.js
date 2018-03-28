import React from 'react';
import firebase from 'react-native-firebase';
import UIStepper from 'react-native-ui-stepper';
import Input from '../../components/Input';

import { Text, TextInput, Button, View, StyleSheet } from 'react-native';

class NewGuest extends React.Component {

  static navigationOptions = ({navigation}) => {
    if (navigation.state.params) {
      return {title: navigation.state.params.guest.item.name};
    } else {
      return {title: 'Ny gäst'};
    }
  }

  constructor() {
    super();
    this.state = {
      name: '',
      kids: 0,
      extra: 0,
      status: '',
      isNew: true
    };
  }

  componentDidMount() {
    // Check if this is a new user or an editing
    if (this.props.navigation.state.params !== undefined) {
      const guest = this.props.navigation.state.params.guest.item;
      this.setState({
        name: guest.name,
        kids: guest.kids,
        extra: guest.extra,
        status: guest.status,
        isNew: false
      });
    }
  }

  render() {

    onNew = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const {goBack} = this.props.navigation;

      // Do error handling here
      if (this.state.name) {
        db.collection("weddings").doc(uid).collection("guests").add({
          name: this.state.name,
          extra: this.state.extra,
          kids: this.state.kids,
          status: "noAnswer"
        });

        goBack();
      }
    }

    onUpdate = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const key = this.props.navigation.state.params.guest.item.key;
      const {goBack} = this.props.navigation;

      // Do error handling here
      if (this.state.name) {
        db.collection("weddings").doc(uid).collection("guests").doc(key).set({
          name: this.state.name,
          extra: this.state.extra,
          kids: this.state.kids,
          status: this.state.status,
        });

        goBack();
      }
    }

    onDelete = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const key = this.props.navigation.state.params.guest.item.key;
      const {goBack} = this.props.navigation;

      // Do error handling here
        db.collection("weddings").doc(uid).collection("guests").doc(key).delete();

        goBack();
    }

    return (
      <View>
        <Text>Namn</Text>
        <Input
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          autoCorrect={false}
          placeholder={"Namn"}
        />
        <Text>Medföljande vuxna</Text>
        <UIStepper
          value={this.state.extra}
          initialValue={0}
          minimumValue={0}
          maximumValue={10}
          steps={1}
          displayValue={true}
          onValueChange={(value) => this.setState({extra: value})}
        />
        <Text>Medföljande barn</Text>
        <UIStepper
          value={this.state.kids}
          initialValue={0}
          minimumValue={0}
          maximumValue={10}
          steps={1}
          displayValue={true}
          onValueChange={(value) => this.setState({kids: value})}
        />
        {this.state.isNew ? (
            <Button title="Lägg till gäst" onPress={() => onNew()}/>
        ) : (
          <View>
            <Button title="Uppdatera" onPress={() => onUpdate()}/>
            <Button title="Ta bort" color={"tomato"} onPress={() => onDelete()} />
          </View>
        )}
      </View>
    );
  }
}

export default NewGuest;
