import React from 'react';
import firebase from 'react-native-firebase';
import { View, Text, Button, TextInput } from 'react-native';
import Input from '../../components/Input';

class NewBudgetItem extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      unitPrice: '',
      quantity: 1,
      amount: '',
      isNew: true,
    }
  }

  static navigationOptions = ({navigation}) => {
    if (navigation.state.params) {
        return {title: navigation.state.params.item.item.name}
    }
    return {title: 'Ny kostnad'}
  }

  componentDidMount() {
    // Check if this is a new user or an editing
    if (this.props.navigation.state.params !== undefined) {
      const item = this.props.navigation.state.params.item.item;
      const amount = item.unitPrice * item.quantity;
      this.setState({
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        amount: amount,
        isNew: false
      });
    }
  }

  render() {

    onNew = () => {
      if (this.state.name && this.state.unitPrice) {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const { goBack } = this.props.navigation;

        db.collection("weddings").doc(uid).collection("budget").add({
          name: this.state.name,
          unitPrice: this.state.unitPrice,
          quantity: this.state.quantity,
          amount: this.state.amount,
        });

        goBack();
      } else {
        console.log("Something is not filled out");
      }
    }

    onDelete = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const { goBack } = this.props.navigation;
      const key = this.props.navigation.state.params.item.item.key;

      db.collection("weddings").doc(uid).collection("budget").doc(key).delete();

      goBack();
    }

    onUpdate = () => {
      if (this.state.name && this.state.unitPrice) {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const key = this.props.navigation.state.params.item.item.key;
        const { goBack } = this.props.navigation;

        db.collection("weddings").doc(uid).collection("budget").doc(key).set({
          name: this.state.name,
          unitPrice: this.state.unitPrice,
          amount: this.state.amount,
          quantity: this.state.quantity
        });

        goBack();
      } else {
        console.log("Something is not filled out")
      }
    }

    onAmountUpdate = (value) => {
      var amount = value * this.state.quantity;
      this.setState({
        unitPrice: value,
        amount: amount
      });
    }

    onquantityUpdate = (quantity) => {
      var amount = quantity * this.state.unitPrice;
      this.setState({
        quantity: quantity,
        amount: amount
      });
    }

    return(
      <View>
        <Text>Namn</Text>
        <Input
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          autoCorrect={false}
          placeholder={"Namn"}
        />
        <Text>Kostnad</Text>
        <TextInput
          value={`${this.state.unitPrice}`}
          onChangeText={(text) => {
            if(text === ""){
                onAmountUpdate('');
                return;
            }
            if(isNaN(text))    //this will allow only number
                return;
            onAmountUpdate(parseInt(text))}
          }
          keyboardType="numeric"
        />
        <Text>Antal</Text>
        <TextInput
          value={`${this.state.quantity}`}
          keyboardType="numeric"
          onChangeText={(quantity) => {
            if(quantity === "") {
              onquantityUpdate('');
              return;
            }
            if(isNaN(quantity))
              return
            onquantityUpdate(parseInt(quantity))}
          }
        />
        <Text>Totalt: {this.state.amount}</Text>
        {this.state.isNew ? (
            <Button title="Lägg till kostnad" onPress={() => onNew()}/>
        ) : (
          <View>
            <Button title="Uppdatera" onPress={() => onUpdate()}/>
            <Button title="Ta bort" color={"tomato"} onPress={() => onDelete()} />
          </View>
        )}
      </View>
    )
  }
}

export default NewBudgetItem;
