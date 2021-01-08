import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



class Completed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      rating : '',
      score: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  closeModal() {
    this.setState({showModal: false});
  }
  handleSubmit(event) {
    event.preventDefault();
    let interests = this.props.data.keywords
    if (this.element.value >=4){
        this.props.addPreference(interests)
    }else{
        this.props.removePref(interests)
    }

    this.setState({ rating: this.element.value });
    if (this.element.value >= 0 && this.element.value <= 5){
    this.closeModal();
    }
  }
  handleRatingKeyDown(e) {
    if(['0','1','2','3','4','5','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].indexOf(e.key) === -1)
      e.preventDefault();
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
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}    Rating: {this.state.rating}</Card.Subtitle>
          {this.getDescription()}
          <Button variant='dark' onClick={() => this.openModal()}>Rate</Button>
          
        </Card.Body>
     

        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>Rate {this.props.data.name}</Modal.Title>
          </Modal.Header>
        <Modal.Body>
  

        <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="form-group check">

                <input type="text"  ref={el => this.element = el} id="inputRating"  
                onKeyDown={(e) => this.handleRatingKeyDown(e)}  maxLength = "1"
                placeholder="Your rating"
                className="form-control" 
                name="quantity" min="0" max="5"/>

                <small id="ratingHelp" class="text-grey">
                Enter a integer in [0,5]. 
                </small>      
            </div>
            
        </form>
        
        <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
        </Modal.Body>        

        </Modal>
      </Card>
    )
  }


 

  openModal() {
    this.setState({showModal: true});
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

export default Completed;
