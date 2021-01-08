import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal, TouchableHighlight } from 'react-native';


class Food extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modalEditVisible: false,
        id: this.props.data,
        name: '',
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        protein: 0,
        addFoodName:'',
        addFoodCalories:0,
        addFoodCarbo:0,
        addFoodFat:0,
        addFoodProtein:0,
        addFoodId:0,
    }
}
componentDidMount() {
    this.getFood()
}
setModalEditVisible = (visible) => {
  this.setState({ modalEditVisible: visible });
}

handleEdit() {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'x-access-token': this.props.accessToken },
        body: JSON.stringify({
            date: this.state.date,
            name: this.state.name
        })
    })
    alert("Meal Updated")
}

handleDelete() {
  fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id, {
      method: 'DELETE',
      headers: { 'x-access-token': this.props.accessToken },            
  })
  alert("Meal Deleted")
  this.props.change(this.state.id)
}

getFood(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.props.meal+'/foods/'+this.props.data, {
        method: 'GET',
        headers: { 'x-access-token': this.props.accessToken }
    })
    .then(res => res.json())
    .then(res => {
    this.setState({
        name: res.name,
        calories: res.calories,
        protein: res.protein,
        fat: res.fat,
        carbohydrates: res.carbohydrates,

        addFoodName:res.name,
        addFoodCalories:res.calories,
        addFoodFat:res.fat,
        addFoodProtein:res.protein,
        addFoodCarbo:res.carbohydrates,
    });
    });
}

handleDeleteFood(e) {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.props.meal+'/foods/'+e.id, {
        method: 'DELETE',
        headers: { 'x-access-token': this.props.accessToken },            
    })
    this.props.delete(e)
}

handleEditFood(e) {
 
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.props.meal+'/foods/'+e.id, {
        
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'x-access-token': this.props.accessToken },
        body: JSON.stringify({
            name: this.state.addFoodName,
            calories: parseFloat(this.state.addFoodCalories),
            fat: parseFloat(this.state.addFoodFat),
            protein: parseFloat(this.state.addFoodProtein),
            carbohydrates: parseFloat(this.state.addFoodCarbo),
        })
    }).then(
        this.setState({name: this.state.addFoodName})
    ).then(
        this.setState({addFoodName: ""})
    )
    this.props.edit(e)
    alert("Exercise Updated")
}
    render() {
        const { modalEditVisible } = this.state;
        return (
            <View style={styles.container}>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.modalView}>
                    <Text>Food Name </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder= {this.state.name}
                        placeholderTextColor="#992a20"
                        onChangeText={(Name) => this.setState({ addFoodName: Name })}
                        value={this.state.addFoodName}
                        autoCapitalize="none" />
                    <Text>Calories </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={String(this.state.calories)}
                        placeholderTextColor="#992a20"
                        onChangeText={(Calories) => this.setState({ addFoodCalories: Calories })}
                        value={String(this.state.addFoodCalories)}
                        autoCapitalize="none" />
                    <Text>Fat </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={String(this.state.fat)}
                        placeholderTextColor="#992a20"
                        onChangeText={(Fat) => this.setState({ addFoodFat: Fat })}
                        value={String(this.state.addFoodFat)}
                        autoCapitalize="none" />
                    <Text>Protein </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={String(this.state.protein)}
                        placeholderTextColor="#992a20"
                        onChangeText={(Protein) => this.setState({ addFoodProtein: Protein })}
                        value={String(this.state.addFoodProtein)}
                        autoCapitalize="none" />
                    <Text>Carbohydrates </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={String(this.state.carbohydrates)}
                        placeholderTextColor="#992a20"
                        onChangeText={(Carbohydrates) => this.setState({ addFoodCarbo: Carbohydrates })}
                        value={String(this.state.addFoodCarbo)}
                        autoCapitalize="none" />
            
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.handleEditFood({
                        id: this.state.id,
                        name: this.state.name,
                        calories: parseFloat(this.state.addFoodCalories),
                        fat: parseFloat(this.state.addFoodFat),
                        protein: parseFloat(this.state.addFoodProtein),
                        carbohydrates: parseFloat(this.state.addFoodCarbo),
                        oldcalories: this.state.calories,
                        oldprotein: this.state.protein,
                        oldfat: this.state.fat,
                        oldcarbohydrates: this.state.carbohydrates,

                    })
                    this.setModalEditVisible(!modalEditVisible);
                    }}
                >
                    <Text style={styles.textStyle}>Save</Text>
                </TouchableHighlight>


                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.handleDeleteFood({
                        name: this.state.name,
                        calories: this.state.calories,
                        protein: this.state.protein,
                        fat: this.state.fat,
                        carbohydrates: this.state.carbohydrates,
	                    id: this.state.id
                    });
                    this.setModalEditVisible(!modalEditVisible);}}>
                    <Text style={styles.textStyle}>Delete</Text>
                </TouchableHighlight>

                
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.setModalEditVisible(!modalEditVisible);}}>
                    <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
                </View>
        
                </Modal>
               
            <TouchableHighlight
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={() => {
            this.setModalEditVisible(!modalEditVisible);
            }}
        >
            <Text style={styles.textStyle}>{this.state.name} </Text>
            </TouchableHighlight>
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
    },
    
});

export default Food;