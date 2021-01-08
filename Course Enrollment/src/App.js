import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import CompletedArea from './CompletedArea';
import RecommendedArea from './RecommendedArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      completedCourses: [],
      interests: [],
      preference: []
    };
    this.addPreference = this.addPreference.bind(this);
    this.removePreference = this.removePreference.bind(this);
            
  }



  componentDidMount() {
   this.loadInitialState()
   this.loadCompleted()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()


    this.setState({allCourses: courseData, filteredCourses: courseData, 
      subjects: this.getSubjects(courseData), interests: this.getInterests(courseData)});
  }

  async loadCompleted(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let courseData = await (await fetch(courseURL)).json()


    this.setState({completedCourses: courseData.data});
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getKeywords(data) {
    let dict = data.keywords;
    let KeyWords = [];
    for (let key in dict) {
      KeyWords.push(dict[key])
    }
    return KeyWords

  }
  getInterests(data) {
    let interestRaw = this.getSubjects(data)
    let interests =  interestRaw.slice(0,1)
    interests = interests.concat(interestRaw.slice(1).map(v => v.toLowerCase()));
    for(let i = 0; i < data.length; i++) {
      let keywords = this.getKeywords(data[i])
 
      for(let j = 0; j < keywords.length; j++) {
        if(interests.indexOf(keywords[j]) === -1){
          interests.push(keywords[j])
        }
      }
    }
    return interests;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  getCompletedData() {
    let completedData = [];
    let courseNum = this.state.completedCourses;

    for(let i =0; i < courseNum.length; i++){
      for(const courseKey of Object.values(this.state.allCourses)) {
        if (courseKey.number === courseNum[i]){
   
          completedData.push(courseKey)
        }
      }
    }

    return completedData;
  
  }

  getRecommendedData() {
    let recommendedData = [];
    let courseNum = this.state.completedCourses;
    for(const courseKey of Object.values(this.state.allCourses)) {
      let complete = false
      for(let i =0; i < courseNum.length; i++){
        if (courseKey.number === courseNum[i]){
          complete = true
          break
        }
      }
      if (complete===false){

        for(const item of Object.values(this.state.preference)){
      
          if (courseKey.subject.toLowerCase() === item){
            if (recommendedData.indexOf(courseKey)===-1){
              recommendedData.push(courseKey)
              break
            }
          }else{
            for(const keyword of Object.values(courseKey.keywords)){
              if (keyword.toLowerCase() === item){
                if (recommendedData.indexOf(courseKey)===-1){
                  recommendedData.push(courseKey)
                  break
                }
              }
            }
          }
        }
      }
    }
    return recommendedData;
  }
  addPreference(e) {

    let pref = this.state.preference
    let add = []

    if (pref.length===0){
      add = e
    }
    else{
      for(let i=0; i< e.length;  i++){
        let nonExistEntry = true
        for(const item of Object.values(pref)){
      
          if (item===e[i]){
            nonExistEntry=false
            break
          }
        }
        if (nonExistEntry===true){
          add.push(e[i])
        }
        
      }
    }
   
    this.setState({
      preference: pref.concat(add)
    })
  }

  removePreference(e) {
    let newPref = [];
    for(const item of Object.values(this.state.preference)){
      let keepPref= true
      for(const entry of Object.values(e)) {
        if (item ===entry){ 
          keepPref = false
          break
        }
      }
      if (keepPref === true){ 
        newPref.push(item);
      }
    }
    this.setState({ preference: newPref });
  }
  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} 
            subjects={this.state.subjects} interests = {this.state.interests}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea all = {this.state.allCourses} complete ={this.state.completedCourses} data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea  all = {this.state.allCourses} complete ={this.state.completedCourses} data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="complete" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>

            <CompletedArea data={this.getCompletedData()} 
            addPreference={(data) => this.addPreference(data)}
            removePreference={(data) => this.removePreference(data)}/>
             
            </div>
          </Tab>
          <Tab eventKey="recommend" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
            <Alert variant="success">
  <p>The following are untaken courses which has common interests with the completed ones that was rated more that 3.</p>
</Alert>




            <RecommendedArea data={this.getRecommendedData()}/>

            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
