import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router-dom';
import Navbar from './Navbar.jsx';

const styles = {
  button: {
    margin: 12,
  },
  hidden: {
    visibility: 'hidden'
  },
  card: {
    background: '#424242'
  },
  hero: {
    display: 'inline'
  }
};

class SignIn extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value:'',
      correctHandle: false
    }

  this.handleChange = this.handleChange.bind(this);
  this.checkHandle = this.checkHandle.bind(this);

  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    })

  }

  checkHandle() {
    let handle = this.state.value;
    let context = this;
    $.ajax({
      type: 'POST',
      url: '/checkHandle',
      contentType: 'application/JSON',
      data: JSON.stringify({
        handle: handle
      })
    })
    .done((data) => {

      if (data.redirect === 'true') {
        context.setState({
          correctHandle:true
        })
      }
      else {
          window.location = data.redirect
        }
    })
    .fail(err => {
      console.log('err');
    });

  }

  render() {

    return (
      <div>
      <div className="view hm-black-strong" id="home">
        <div className="mask">
        <Navbar />
        <div className="vertical-center">
          <div className="container">
           <div className="row">

            <div className="col-md-12">
              <div className="text-center align-self-center">
                <div className="text-left">
                <h1 className="hero">Password&#10004;</h1>
                <br/>
                <p className="sub-hero">Use Twitter to Create a Strong #Password</p>
                <input className="primary-text" placeholder="YourTwitterHandle" type="text" name="value" style={{fontSize: '30px', maxWidth:'400px'}} value={this.state.value} onChange={this.handleChange}/>
                <a className="btn btn-primary btn-md" onClick={this.checkHandle}><i className="fa fa-twitter" aria-hidden="true"></i>Start</a>
                {this.state.correctHandle ? <p className="sub-hero" style={{color:'red'}}>The Twitter handle is not valued! Try again!</p> : null}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      </div>





      </div>

    )
  }

}

export default SignIn;
