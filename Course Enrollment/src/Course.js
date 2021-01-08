import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      show: false,
      cart: false,
      qualified: true
    }
    this.handleClose = this.handleClose.bind(this);

  }
  
	handleClose(){
		this.setState({
			show:false
		});
	}
 
  getRequisites(data) {
    let dict = data.requisites;
    let completed = this.props.complete;

    for (let must in dict) {
      let  subReq= false;
      for (let option in dict[must]) {
        for(let i =0; i < completed.length; i++) {
          if (dict[must][option]===completed[i]){
            subReq = true
          }
        }
      }
      if (subReq === false){
        return false
      }
    }
    return true
  }


  getQualified() {
    if (!this.getRequisites(this.props.data) && this.state.cart===true){
      return false
    }
    return true
  }


  
  getPriority = (data, output) => {

    let dict = data.requisites;
    if (dict.length === 0){
      return output
    }
    let Requisites = [];
    for (let must in dict) {
      let group = [];
      for (let option in dict[must]) {
        let temp = this.props.complete.find((x) => {return x === dict[must][option]})
        console.log(this.props.complete)
        if (!temp){
          group.push(dict[must][option])
        }
        let course = this.props.allCourses.find((x) => {return x.number === dict[must][option]})
        if (!this.getRequisites(course)){
          output.push(this.getPriority(course, output)[0])
 
        }
        group.push(" OR ");
      }
      group.pop();
      Requisites.push(group.join().replaceAll(",",''))
    }
    
    output.push("Take: "+ Requisites+" to satisfiy: "+data.number+ "\n")
    return output
  }

  removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }
  render() {
    return (
      <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>
            <div style={{maxWidth: 250}}>
              {this.props.data.name} 
            </div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}
          
          </Card.Subtitle>
          {this.getDescription()}
          <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
        </Card.Body>
        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            {this.getSections()}
          </Modal.Body>
          <Modal.Footer>
       
          {this.getQualified() ? ' ': 
            <div  style={{ color: 'red' }}>
                        <Accordion defaultActiveKey="0">
			        <Card>
			<Card.Header>
				<Accordion.Toggle as={Button} variant="link" eventKey="1">
				<strong > <div  style={{ color: 'red' }}>Not Qualified</div></strong>
				</Accordion.Toggle>
				<div className="float-right"> 
					
						</div>


			</Card.Header>
			<Accordion.Collapse eventKey="1">
				<Card.Body>
        You can take courses by the follwing steps: 
            {this.removeDups(this.getPriority(this.props.data, []))} 
				</Card.Body>
			</Accordion.Collapse>
			</Card>
		        </Accordion>
           

           </div> 
          
          }

            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    )
  }



  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>

    )
  }

  getSections() {
    let sections = [];


    for (let i =0; i < this.props.data.sections.length; i++){
      sections.push (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section " + i}
              {this.getSectionButton(i)}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {JSON.stringify(this.props.data.sections[i].time)}
                {this.getSubsections(i, this.props.data.sections[i])}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }
  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }


  addCourse() {
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        
      }
    );
    this.setState({cart: true});
  }

  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
      }
    );
    this.setState({cart: false});
  }

  addSection(e, section) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
    this.setState({cart: true});
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
    this.setState({cart: false});
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
    this.setState({cart: true});
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
    this.setState({cart: false});
  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =0; i < sectionValue.subsections.length; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
            {i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;



