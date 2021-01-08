import React from 'react';
import './App.css';
import Recommended from './Recommended';

class RecommendedArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)){
     for(let i =0; i < this.props.data.length; i++){
      courses.push (
        <Recommended key={i} data={this.props.data[i]} courseKey={this.props.data[i].number}/>
      )
    }
  }
  else{
    for(const course of Object.keys(this.props.data)){
      courses.push (
        <Recommended key={this.props.data[course].number} data={this.props.data[course]} 
        courseKey={this.props.data[course].number}/>
      )
    }
  }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  render() {
    return (
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default RecommendedArea;
