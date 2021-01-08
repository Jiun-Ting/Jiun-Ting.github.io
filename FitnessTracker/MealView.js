import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal, TouchableHighlight, Dimensions } from 'react-native';

import Meal from './Meal';

class MealView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mealList: [],
            modalVisible: false,
            modalEditVisible: false,
            AddId:'',
            AddName:'',
            AddDate:'',
            AddCalories:'',
            selectedStartDate: null,
            change:false,
        }
        this.onDateChange = this.onDateChange.bind(this);
    }
    onDateChange(date) {
        this.setState({
          selectedStartDate: date,
        });
      }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
    setModalEditVisible = (visible) => {
        this.setState({ modalEditVisible: visible });
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('focus', () => {
        this.getList()
        })
    }

    getList(){
        fetch('https://mysqlcs639.cs.wisc.edu/meals', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
        .then(res => res.json())
        .then(res => {
        this.setState({
            mealList: res.meals,
            AddDate: this.getDate(),
            change: false
        });
        });
    }
    backToLogin() {
        this.props.revokeAccessToken();
    }
    backToProfile() {
        this.props.navigation.navigate('FitnessTracker');
      }
    backToToday() {
        this.props.navigation.navigate('Today');
    }
    handleCreate() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals', {
            method: 'POST',
            headers: { 'x-access-token': this.props.accessToken }
        }).then(res => res.json())
        .then(res => {
          this.setState({
            AddId: res.id,
          }
        )}
        );
    }
    handleDelete(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/'+id, {
            method: 'DELETE',
            headers: { 'x-access-token': this.props.accessToken },            
        })
    }
    handleEdit(Id) {
 
        fetch('https://mysqlcs639.cs.wisc.edu/meals/'+Id, {
            
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken },
            body: JSON.stringify({
                date: this.state.AddDate,
                name: this.state.AddName
            })
            
        }).then(
            this.setState({ mealList: [...this.state.mealList, 
                {name: this.state.AddName,
                 id: Id,
                 date: this.state.AddDate,
  
                }] })
        ).then(
            this.setState({
                AddId:'',
                AddName:'',
                AddDate: this.getDate(),
            })
        )
        alert("Meal Updated")
    }

    onDeleteMeal(e){
        this.setState({
            mealList: this.state.mealList.filter(o => o.id !== e)
        })
    }

    onEditMeal(e){
        this.setState({  mealList: this.state.mealList.filter(o => o.id !== e.id)},
        () =>{
        
        this.setState({
            mealList: [...this.state.mealList, 
                {name: e.name,
                 id: e.id,
                 date: e.date,
                 AddId:'',
                 AddName:'',
                 AddDate: this.getDate(),
                }] 
            })}        
        )
    }
    showMeals(){
        let meals = [];
        for(const meal of Object.values(this.state.mealList)) {
          meals.push (
            <Meal key={meal.id} data={meal} accessToken={this.props.accessToken} 
            delete={(e)=>this.onDeleteMeal(e)}
            edit={(e)=>this.onEditMeal(e)}/>
          )
        }
        return meals;
    }
    onChange(e){
        if (e==true){
            alert("cool")
            this.setState({
                change: true
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.change !== prevProps.change) {
          this.getList();
        }
    }

    getDate(){
        var now = new Date();
        var dd = String(now.getDate()).padStart(2, '0');
        var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = now.getFullYear(); 
        return yyyy+'-'+mm + '-' + dd
    }
    render() {
        const { modalVisible } = this.state;
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                     <Text style={styles.bigText}>Meal</Text>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
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
                        onChangeText={(name) => this.setState({ AddName: name })}
                        value={this.state.AddName}
                        autoCapitalize="none" />
                     <Calendar onDayPress={(date) => this.setState({ AddDate: date.year+'-'+date.month+'-'+date.day})}/>
                     <Text>SELECTED DATE:{this.state.AddDate}</Text>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.handleEdit(this.state.AddId)
                    this.setModalVisible(!modalVisible);
                    }}
                >
                    <Text style={styles.textStyle}>Add</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.setModalVisible(!modalVisible);
                    this.handleDelete(this.state.AddId)
                    }}
                >
                    <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
                </View>
        
                </Modal>
                {this.showMeals()}
                <Button color="#942a21" style={styles.buttonInline} title="Add Meal" 
                onPress={() => 
                
                {this.setModalVisible(true);
                {this.handleCreate()}
                }} />
              <Button color="#a1635f" style={styles.buttonInline} title="Exit" onPress={() => this.backToLogin()} />
              </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height
      },
      mainContainer: {
        flex: 1
      },
      scrollViewContainer: {},
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
      }, bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
    }
      
});

export default MealView;