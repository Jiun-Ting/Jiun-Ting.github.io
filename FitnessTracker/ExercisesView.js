import React from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal, TouchableHighlight, Dimensions } from 'react-native';
import Exercise from './Exercise';

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseList: [],
            modalVisible: false,
            modalEditVisible: false,
            AddId:'',
            AddName:'',
            AddTime:'',
            AddDate:'',
            AddCalories:'',
            selectedStartDate: null,
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
        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
        .then(res => res.json())
        .then(res => {
        this.setState({
            exerciseList: res.activities,
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
        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
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
    handleEdit(Id) {
 
        fetch('https://mysqlcs639.cs.wisc.edu/activities/'+Id, {
            
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken },
            body: JSON.stringify({
                id: Id,
                calories: parseFloat(this.state.AddCalories),
                duration: parseFloat(this.state.AddTime),
                name: this.state.AddName,
                date: this.state.AddDate
            })
            
        }).then(
            this.setState({ exerciseList: [...this.state.exerciseList, 
                {name: this.state.AddName,
                 id: this.state.AddId,
                 date: this.state.AddDate,
                 duration: this.state.AddTime,
                 calories: this.state.AddCalories
                }] })
        ).then(
            this.setState({
                AddId:'',
                AddName:'',
                AddTime:'',
                AddDate: this.getDate(),
                AddCalories:'',
            })
        )
        
        alert("Exercise Updated")
    }
    handleDelete(id) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/'+id, {
            method: 'DELETE',
            headers: { 'x-access-token': this.props.accessToken },            
        })
    }
    handleDeleteAlert(id){
        this.handleDelete(id)
        this.setState({
            exerciseList: this.state.exerciseList.filter(o => o.id !== id)
        })
        alert("Exercise Deleted")

    }
    showExercise(){
        const { modalEditVisible } = this.state;
        return this.state.exerciseList.map((exercise, i) => {
            return (
                <View style={styles.exerciseContainer} key={i}>
                <Text>ID: {exercise.id}</Text>
                <Text>Name: {exercise.name}</Text>
                <Text>Date: {exercise.date}</Text>
                <Text>Duration: {exercise.duration}</Text>
                <Text>Calories: {exercise.calories}</Text>
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
                            placeholder={exercise.name}
                            placeholderTextColor="#992a20"
                            onChangeText={(name) => this.setState({ AddName: name })}
                            value={this.state.AddName}
                            autoCapitalize="none" />
                        <Text>Duartion (Minutes)</Text>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={String(exercise.duration)}
                            placeholderTextColor="#992a20"
                            onChangeText={(time) => this.setState({ AddTime: time })}
                            value={this.state.AddTime}
                            autoCapitalize="none" />
                        <Text>Calories Burnt</Text>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={String(exercise.calories)}
                            placeholderTextColor="#992a20"
                            onChangeText={(calorie) => this.setState({ AddCalories: calorie })}
                            value={this.state.AddCalories}
                            autoCapitalize="none" />
                        <Text>Date: {exercise.date}</Text>
                        <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                        this.handleEdit(exercise.id)
                        alert(exercise.id +"updated")
                        this.setModalEditVisible(!modalEditVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>Add</Text>
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
                <Button color="#a1635f" title="Edit" onPress={() => {
 
                  this.setModalEditVisible(!modalEditVisible);
                }} />
                <Button color="#a1635f" title="Delete" onPress={() => this.handleDeleteAlert(exercise.id)} />
                </View>
            );
        });
    }
    showE(){
        let exercises = [];
        for(const exercise of Object.values(this.state.exerciseList)) {
          exercises.push (
            <Exercise key={exercise.id} data={exercise} accessToken={this.props.accessToken} 
            delete={(e)=>this.onDelete(e)} edit={(e)=>this.onEdit(e)}/>
          )
          
        }
        return exercises;
    }
    onDelete(e){
        this.setState({
            exerciseList: this.state.exerciseList.filter(o => o.id !== e)
        })
    }
    onEdit(e){
        this.setState({ 
            exerciseList: this.state.exerciseList.filter(o => o.id !== e.id)},
            ()=>{this.setState({
            exerciseList: [...this.state.exerciseList, e],
            AddId:'',
            AddName:'',
            AddTime:'',
            AddDate: this.getDate(),
            AddCalories:'',
            })
            })   
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
                <Text style={styles.bigText}>Exercise</Text>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.modalView}>
                    <Text>Exercise Name </Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="name"
                        placeholderTextColor="#992a20"
                        onChangeText={(name) => this.setState({ AddName: name })}
                        value={this.state.Addname}
                        autoCapitalize="none" />
                    <Text>Duartion (Minutes)</Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="time"
                        placeholderTextColor="#992a20"
                        onChangeText={(time) => this.setState({ AddTime: time })}
                   //     value={String(this.state.Addtime)}
                        autoCapitalize="none" />
                    <Text>Calories Burnd</Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="calorie"
                        placeholderTextColor="#992a20"
                        onChangeText={(calorie) => this.setState({ AddCalories: calorie })}
                     //   value={String(this.state.AddCalories)}
                        autoCapitalize="none" />
                     <Calendar onDayPress={(date) => this.setState({ AddDate: date.year+'-'+date.month+'-'+date.day})}/>
                     <Text>SELECTED DATE:{this.state.AddDate.substring(0,19)}</Text>
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

  
                {this.showE()} 
                <Button color="#942a21" style={styles.buttonInline} title="Add Exercise" 
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
      }, bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
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

export default ExercisesView;