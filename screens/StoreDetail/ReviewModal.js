import React from 'react';
import { Button, Text, TextInput, Modal, View } from 'react-native';
import firebase from 'react-native-firebase';
import EStyleSheet from 'react-native-extended-stylesheet';
import StarRating from 'react-native-star-rating';


class ReviewModal extends React.Component {

  constructor() {
    super();
    this.state={
      rating: 0,
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    var store = this.props.store
    return(

      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
      >
        <View style={{marginTop: 22}}>
          <View>
            <Text>Skriv en recension om {store.name}</Text>
            <StarRating
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'red'}
            />
            <TextInput
              style={styles.multilineInput}
              multiline={true}
            />
            <Button
              title="Avbryt"
              color={"tomato"}
              onPress={this.props.setModalVisible}
            />
            <Button
              title="Spara"
              onPress={this.props.setModalVisible}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

export default ReviewModal;

const styles = EStyleSheet.create({
  multilineInput: {
    backgroundColor: "#F5F5F5",
  }
});
