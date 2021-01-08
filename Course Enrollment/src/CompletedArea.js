import React from 'react';
import './App.css';
import Completed from './Completed';

class CompletedArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)){
     for(let i =0; i < this.props.data.length; i++){
      courses.push (
        <Completed key={i} data={this.props.data[i]} courseKey={this.props.data[i].number} 
        addPreference={this.props.addPreference}
        removePref={this.props.removePreference}
        />
      )
    }
  }
  else{
    for(const course of Object.keys(this.props.data)){
      courses.push (
        <Completed key={this.props.data[course].number} data={this.props.data[course]} 
        courseKey={this.props.data[course].number}
        addPreference={this.props.addPreference}
        removePref={this.props.removePreference}/>
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

export default CompletedArea;
