import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal, TouchableHighlight } from 'react-native';


class Exercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modalEditVisible: false,
        id: this.props.data.id,
        name: this.props.data.name,
        duration: this.props.data.duration,
        date: this.props.data.date,
        calories: this.props.data.calories,
    }
}
setModalEditVisible = (visible) => {
  this.setState({ modalEditVisible: visible });
}
handleEdit(Id) {
  fetch('https://mysqlcs639.cs.wisc.edu/activities/'+Id, {
      
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken },
      body: JSON.stringify({
          calories: parseFloat(this.state.calories),
          duration: parseFloat(this.state.duration),
          date: this.state.date,
          name: this.state.name,
          
      })
  })
  
  this.props.edit(
    {
      id: Id,
      calories: parseFloat(this.state.calories),
      duration: parseFloat(this.state.duration),
      date: this.state.date,
      name: this.state.name,
      
  }
  )  
  alert("Exercise Updated")
}
handleDelete(id) {
  fetch('https://mysqlcs639.cs.wisc.edu/activities/'+id, {
      method: 'DELETE',
      headers: { 'x-access-token': this.props.accessToken },            
  })
  this.props.delete(id)
  alert("Exercise Deleted")
}

getDate(){
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, '0');
  var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = now.getFullYear(); 
  return yyyy+'-'+mm + '-' + dd
}
    render() {
        const { modalEditVisible } = this.state;
        return (
            
            <View style={styles.container}>
                <Text>Name: {this.props.data.name}</Text>
                <Text>Date: {this.props.data.date.substring(0,10)}</Text>
                <Text>Duration: {String(this.props.data.duration)}</Text>
                <Text>Calories Burnd: {String(this.props.data.calories)}</Text>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalEditVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                    >
                    <View style={styles.modalView}>
                        <Text>Exercise Name</Text>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={this.props.data.name}
                            placeholderTextColor="#992a20"
                            onChangeText={(Name) => this.setState({ name: Name })}
                            value={this.state.name}
                            autoCapitalize="none" />
                        <Text>Duartion (Minutes)</Text>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={String(this.props.data.duration)}
                            placeholderTextColor="#992a20"
                            onChangeText={(Duration) => {
                              return (Duration==='')?
                            1:this.setState({ duration: Duration })}}
                      //      value={String(this.state.duration)}
                            autoCapitalize="none" />
                        <Text>Calories Burnd</Text>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={String(this.props.data.calories)}
                            placeholderTextColor="#992a20"
                            onChangeText={(Calories) => {
                              return (Calories==='')?
                            1:this.setState({ calories: Calories })}}
                       //     value={String(this.state.calories)}
                            autoCapitalize="none" />
               
                        <Calendar onDayPress={(date) => this.setState({ date: date.year+'-'+date.month+'-'+date.day})}/>
                     <Text>SELECTED DATE:{this.state.date.substring(0,10)}</Text>
                        <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                        this.handleEdit(this.props.data.id)
                        this.setModalEditVisible(!modalEditVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>Save</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                            this.setModalEditVisible(!modalEditVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </TouchableHighlight>
            </View>

                </Modal>
    
                <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {this.setModalEditVisible(!modalEditVisible);
                        }}>
                        <Text style={styles.textStyle}>Edit</Text>
                    </TouchableHighlight>
                <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => this.handleDelete(this.props.data.id)}
                    >
                        <Text style={styles.textStyle}>Delete</Text>
                    </TouchableHighlight>
                    <View style={styles.spaceSmall} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  buttonInline: {
      display: "flex"
    }, buttonInline: {
      display: "flex"
    },
    input: {
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    },  modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    }, spaceSmall: {
      width: 20,
      height: 10,
    },
    
});

export default Exercise;