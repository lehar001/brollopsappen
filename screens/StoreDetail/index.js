import React from 'react';
import { View, Text } from 'react-native';

class StoreDetail extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {title: navigation.state.params.store.name}
  }

  render() {
    var store = this.props.navigation.state.params.store;
    return(
      <View>
        <Text>This store has a rating of {store.rating}</Text>
      </View>
    )
  }
}

export default StoreDetail;
