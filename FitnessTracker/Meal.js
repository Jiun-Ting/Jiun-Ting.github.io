import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal, TouchableHighlight } from 'react-native';
import Food from './Food';

class Meal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modalEditVisible: false,
        modalAddVisible: false,
        id: this.props.data.id,
        name: this.props.data.name,
        date: this.props.data.date,
        foodList: [],
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
setModalAddVisible = (visible) => {
    this.setState({ modalAddVisible: visible });
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
    this.props.edit(
        {
            id: this.state.id,
            date: this.state.date,
            name: this.state.name
        }
        
    )
    alert("Meal Updated")
}

handleDelete() {
  fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id, {
      method: 'DELETE',
      headers: { 'x-access-token': this.props.accessToken },            
  })
  alert("Meal Deleted")
  this.props.delete(this.state.id)
}

getDate(){
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, '0');
  var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = now.getFullYear(); 
  return yyyy+'-'+mm + '-' + dd
}
getFood(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id+'/foods', {
        method: 'GET',
        headers: { 'x-access-token': this.props.accessToken }
    })
    .then(res => res.json())
    .then(res => {
    this.setState({
        foodList: res.foods.map(o => o.id),
        calories: res.foods.map(o => o.calories).reduce((a, b) => a + b, 0),
        protein: res.foods.map(o => o.protein).reduce((a, b) => a + b, 0),
        fat: res.foods.map(o => o.fat).reduce((a, b) => a + b, 0),
        carbohydrates: res.foods.map(o => o.carbohydrates).reduce((a, b) => a + b, 0),
    });
    });
}
handleCreateFood() {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id+'/foods', {
        method: 'POST',

        headers: {  'Accept': 'application/json', 'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken },
        body: JSON.stringify({
            foods: [],
        })
    }).then(res => res.json())
      .then(res => {
        this.setState({
          addFoodId: res.id,
        }
      )});
    
}
handleDeleteFood(fid) {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id+'/foods/'+fid, {
        method: 'DELETE',
        headers: { 'x-access-token': this.props.accessToken },            
    })
}

handleEditFood(fid) {
 
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id+'/foods/'+fid, {
        
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
        this.setState({ foodList: [...this.state.foodList, 
             this.state.addFoodId,
             ]})
    ).then(
        this.setState({
            addFoodId:'',
            addFoodName:'',
            addFoodCalories:0,
            addFoodFat:0,
            addFoodProtein:0,
            addFoodCarbo:0,
            calories: this.state.calories+parseFloat(this.state.addFoodCalories),
            protein: this.state.protein+parseFloat(this.state.addFoodProtein),
            fat: this.state.fat+parseFloat(this.state.addFoodFat),
            carbohydrates: this.state.carbohydrates+parseFloat(this.state.addFoodCarbo),
        })
    )
    
    alert("Exercise Updated")
}


// componentDidUpdate(prevState) {
//     if (this.state.foodList !== prevState.foodList) {
//       this.getFood();
//     }
// }

onEditFood(e){
            this.setState({
            calories: this.state.calories + parseFloat(e.calories) - parseFloat(e.oldcalories),
            carbohydrates: this.state.carbohydrates + parseFloat(e.carbohydrates) -parseFloat(e.oldcarbohydrates),
            fat: this.state.fat + parseFloat(e.fat) -parseFloat(e.oldfat),
            protein: this.state.protein + parseFloat(e.protein) -parseFloat(e.oldprotein),
            })  
    }
onDeleteFood(e){
   
        this.setState({
            foodList: this.state.foodList.filter(o => o !== e.id)  
        }, ()=>{if (e !== 0){
            this.setState({
            calories: this.state.calories - parseFloat(e.calories),
            carbohydrates: this.state.carbohydrates -parseFloat(e.carbohydrates),
            fat: this.state.fat-parseFloat(e.fat),
            protein: this.state.protein-parseFloat(e.protein),
            })
        }}
        ) 
        
    }

// onEditFood(e){
// //    let isMounted = true; 
//     this.setState({
//         foodList: this.state.foodList.filter(o => o !== e.id)
//     }, 
//     ()=>{
//         fetch('https://mysqlcs639.cs.wisc.edu/meals/'+this.state.id+'/foods/'+e, {
//         method: 'GET',
//         headers: { 
//             'x-access-token': this.props.accessToken },

//     }).then(res => res.json())
//       .then(res => {
//   //      if (isMounted){
//         this.setState({ foodList: [...this.state.foodList, 
//              res.id,
//              ]})
//     //    }
//     }
//     ).then(() => {
//         if (isMounted){
//         this.setState({
//             foodList: [],
//             calories: 0,
//             protein: 0,
//             fat: 0,
//             carbohydrates: 0,
//         })}
//     }
//     ).then(
//         this.getFood()
//     )
//     });
// //    return () => { isMounted = false }
// }
showFoodList(){
    let foods = [];
        for(const food of Object.values(this.state.foodList)) {
          foods.push (
            <Food key={food} data={food} meal={this.props.data.id} accessToken={this.props.accessToken} 
            delete={(e)=>this.onDeleteFood(e)}
            edit={(e)=>this.onEditFood(e)}/>
          )
        }
    return foods;
}
    render() {
        const { modalEditVisible } = this.state;
        const { modalAddVisible } = this.state;
        return (
            
            <View style={styles.container}>
                <Text>Name: {this.props.data.name}</Text>
                <Text>Foods: {this.showFoodList()} 
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                        this.handleCreateFood()
                        this.setModalAddVisible(!modalAddVisible);
                        }}>
                        <Text style={styles.textStyle}>+</Text>
                    </TouchableHighlight>                
                </Text>

                <Modal
                animationType="slide"
                transparent={true}
                visible={modalAddVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.modalView}>
                    <Text>Food Name </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="name"
                        placeholderTextColor="#992a20"
                        onChangeText={(Name) => this.setState({ addFoodName: Name })}
                        value={this.state.addFoodName}
                        autoCapitalize="none" />
                    <Text>Calories </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Calories"
                        placeholderTextColor="#992a20"
                        onChangeText={(Calories) => this.setState({ addFoodCalories: Calories })}
                        value={String(this.state.addFoodCalories)}
                        autoCapitalize="none" />
                    <Text>Fat </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Fat"
                        placeholderTextColor="#992a20"
                        onChangeText={(Fat) => this.setState({ addFoodFat: Fat })}
                        value={String(this.state.addFoodFat)}
                        autoCapitalize="none" />
                    <Text>Protein </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Protein"
                        placeholderTextColor="#992a20"
                        onChangeText={(Protein) => this.setState({ addFoodProtein: Protein })}
                        value={String(this.state.addFoodProtein)}
                        autoCapitalize="none" />
                    <Text>Carbohydrates </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Carbo"
                        placeholderTextColor="#992a20"
                        onChangeText={(Carbohydrates) => this.setState({ addFoodCarbo: Carbohydrates })}
                        value={String(this.state.addFoodCarbo)}
                        autoCapitalize="none" />
            
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.handleEditFood(this.state.addFoodId)
                    this.setModalAddVisible(!modalAddVisible);
                    }}
                >
                    <Text style={styles.textStyle}>Save</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.setModalAddVisible(!modalAddVisible);
                    this.handleDeleteFood(this.state.addFoodId);
                    }}
                >
                    <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
                </View>
        
                </Modal>
               
                <Text>Date: {this.state.date.substring(0,10)}</Text>
                <Text>Total Calories: {this.state.calories}</Text>
                <Text>Total Carbohydrates: {this.state.carbohydrates}</Text>
                <Text>Total fat: {this.state.fat}</Text>
                <Text>Total protein: {this.state.protein}</Text>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.modalView}>
                    <Text>Meal Name </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="name"
                        placeholderTextColor="#992a20"
                        onChangeText={(Name) => this.setState({ name: Name })}
                        value={this.state.name}
                        autoCapitalize="none" />
                     <Calendar onDayPress={(Date) => this.setState({ date: Date.year+'-'+Date.month+'-'+Date.day})}/>
                     <Text>SELECTED DATE:{this.state.date.substring(0,10)}</Text>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.handleEdit()
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
                        onPress={() => {this.setModalEditVisible(!modalEditVisible);}}>
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
    },  spaceSmall: {
        width: 20,
        height: 10,
      },
    
});

export default Meal;