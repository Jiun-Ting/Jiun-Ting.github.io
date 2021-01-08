import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Dimensions  } from 'react-native';

import Exercise from './Exercise'
import Meal from './Meal';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseList: [],
            mealList: [],
            today:'',
            totalMins:0,
            totalCalories:0,
            totalFat:0,
            totalProtein:0,
            totalCarbo:0,
            goalDailyActivity:0,
        }
    }
    getExercises(){
        let exercises = [];
        for(const exercise of Object.values(this.state.exerciseList)) {
          exercises.push (
            <Exercise key={exercise.id} data={exercise} accessToken={this.props.accessToken} 
            delete={(e)=>this.onDelete(e)} edit={(e)=>this.onEdit(e)}/>
          )
          
        }
        return exercises;
    }
    getMeals(){
        fetch('https://mysqlcs639.cs.wisc.edu/meals', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                mealList: res.meals.filter(o => o.date.substring(0,10)==this.state.today)
              });
            }).then(()=>{
                this.setState({
                    totalCalories: 0,
                    totalProtein: 0,
                    totalFat: 0,
                    totalCarbo: 0,
                })
            })
            .then(
                
                ()=>{
                    for(const meal of Object.values(this.state.mealList)) {
                        this.getFood(meal.id)
                    }
                }
            );

    }
    getProfile(){
        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                goalDailyActivity: res.goalDailyActivity,
                goalDailyCalories: res.goalDailyCalories,
                goalDailyProtein: res.goalDailyProtein,
                goalDailyCarbohydrates: res.goalDailyCarbohydrates,
                goalDailyFat: res.goalDailyFat,
              });
            });
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('focus', () => {
            this.setDate()
            fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                exerciseList: res.activities.filter(o => o.date.substring(0,10)==this.state.today),
                totalMins:0,
              });
            })
            .then(
                ()=>{
                    this.getMins()
                }
            );
            this.getMeals()
            this.getProfile()       
        });
   
    }
    backToLogin() {
        this.props.revokeAccessToken();
    }
    backToProfile() {
        this.props.navigation.navigate('FitnessTracker');
      }
    backToExercise() {
        this.props.navigation.navigate('Exercise');
    }
    onDeleteExercise(e){
        this.setState({
            exerciseList: this.state.exerciseList.filter(o => o.id !== e)
        },()=>{ 
            this.setState({
                totalMins: this.state.exerciseList
                .map(exercise => exercise.duration)
                .reduce((a, b) => a + b,0)
            
            })}
        )
    }
    onDeleteMeal(e){
        this.setState({
            mealList: this.state.mealList.filter(o => o.id !== e)
        })
    }
    showExercises(){
        let exercises = [];
        for(const exercise of Object.values(this.state.exerciseList)) {
          exercises.push (
            <Exercise key={exercise.id} data={exercise} accessToken={this.props.accessToken} 
            delete={(e)=>this.onDeleteExercise(e)} edit={(e)=>this.onEditExercise(e)}/>
          )
        }
        return exercises;
    }

    onEditExercise(e){
        this.setState(
            {exerciseList: this.state.exerciseList.filter(o => o.id !== e.id),
            },
            ()=>{ 
                this.setState({
                    totalMins: this.state.exerciseList
                    .map(exercise => exercise.duration)
                    .reduce((a, b) => a + b,0)
                
                }, ()=>{
                    if (e.date.substring(0,10)==this.state.today){    
                        this.setState({
                            exerciseList: [...this.state.exerciseList, e] ,
                            totalMins: this.state.totalMins += parseFloat(e.duration)
                        })
                    }
                })
            }
        )        
    }

    onEditMeal(e){
        this.setState({ mealList: this.state.mealList.filter(o => o.id !== e.id)},
        () =>{
            if (e.date.substring(0,10)==this.state.today){    
            this.setState({
                mealList: [...this.state.mealList, 
                    {name: e.name,
                    id: e.id,
                    date: e.date,
                    }]       
            })
        }}
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
    getMins(){
        var totalMin = this.state.exerciseList
                        .map(exercise => exercise.duration)
                        .reduce((a, b) => a + b,0)
        this.setState({totalMins: totalMin})
    }
    getFood(meal){
        fetch('https://mysqlcs639.cs.wisc.edu/meals/'+meal+'/foods', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
        .then(res => res.json())
        .then(res => {
        this.setState({
            totalCalories: res.foods.map(o => o.calories).reduce((a, b) => a + b, this.state.totalCalories),
            totalProtein: res.foods.map(o => o.protein).reduce((a, b) => a + b, this.state.totalProtein),
            totalFat: res.foods.map(o => o.fat).reduce((a, b) => a + b, this.state.totalFat),
            totalCarbo: res.foods.map(o => o.carbohydrates).reduce((a, b) => a + b, this.state.totalCarbo),
        });
        });
    }
    getTodayFood(meal){
        fetch('https://mysqlcs639.cs.wisc.edu/meals/'+meal+'/foods', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
        .then(res => res.json())
        .then(res => {
        this.setState({
            totalCalories: res.foods.map(o => o.calories).reduce((a, b) => a + b, 0),

        });
        });
    }



    getDate(){
        var now = new Date();
        var dd = String(now.getDate()).padStart(2, '0');
        var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = now.getFullYear();
 
        return yyyy+'-'+mm + '-' + dd
    }
    setDate(){
        this.setState({
            today: this.getDate()
        });
    }

    render() {
        
        return (
            
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <Text style={styles.bigText}>{this.state.today}</Text>
                <Text style={styles.midText}>Goals Status </Text>
                <Text>Daily Activities: {this.state.totalMins}/{this.state.goalDailyActivity} </Text>
                <Text>Daily Calories: {this.state.totalCalories}/{this.state.goalDailyCalories} </Text>
                <Text>Daily Protein: {this.state.totalProtein}/{this.state.goalDailyProtein} </Text>
                <Text>Daily Carbohydrates: {this.state.totalCarbo}/{this.state.goalDailyCarbohydrates} </Text>
                <Text>Daily DailyFat: {this.state.totalFat}/{this.state.goalDailyFat} </Text>
                <View style={styles.spaceSmall} />
                <Text style={styles.midText}>Exercises </Text>
                {this.showExercises()}
                <Text style={styles.midText}>Meals </Text> 
                {this.showMeals()} 
            
               
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
      }, 
    exercisecontainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
    }, midText: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 5
    },
    buttonInline: {
    display: "flex"
    },spaceSmall: {
    width: 20,
    height: 20,
  },
});

export default TodayView;