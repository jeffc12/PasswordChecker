import React from 'react';
import {render} from 'react-dom';
import Navbar from './Navbar.jsx';
import ProgressBar from "bootstrap-progress-bar";

const styles = {
  card: {
    backgroundColor: 'white',
    maxWidth: '600px',
    height: '450px',
  },
  correctColor: {
    color: '#2E8B57'
  }
};

class DashBoard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      wordLength: false,
      commonKeyword: false,
      uniqueChar: false,
      specialChar: false,
      historyKeyword:false,
      socialKeyword:false,
      strengthCount: 0,
      userName: '',
      percentage: 0,
      message: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.statusBar = this.statusBar.bind(this);
  }

  componentDidMount() {
    /*******************************
    RETURN NAME OF USER
    *******************************/
    let context = this;
    $.ajax({
      type: 'GET',
      url: '/returnUser',
    })
    .done((data) => {
      context.setState({
        userName: data
      })
    })
    .fail(err => {
      console.log('err');
    });
  }

  handleChange(e) {
    let context = this;
    this.checkWord(e.target.value);

    context.setState({
      value: e.target.value
    });
  }

  checkWord(word) {
    /*******************************
    SERVER CALL FOR WORD CHECK
    *******************************/
    let context = this;

    if (word.length >= 4) {
      $.ajax({
        type: 'POST',
        url: '/passwordCheck',
        contentType: 'application/JSON',
        data: JSON.stringify({
          word: word
        })
      })
      .done((data) => {
        data = JSON.parse(data);
        context.setState(data);
        context.statusBar();
      })
      .fail(err => {
        console.log('err');
      });
    } else {
      context.setState({
        wordLength: false,
        commonKeyword: false,
        uniqueChar: false,
        specialChar: false,
        historyKeyword:false,
        socialKeyword:false,
        strengthCount: 0,
      });
      context.statusBar();
    }


  }

  statusBar() {
    /*******************************
    CHECK PERCENT FOR weak/ok/strong
    *******************************/
    let percentage = (this.state.strengthCount / 6) * 100;
    if (percentage < 50) {
      this.setState({
        percentage: percentage,
        message: "Weak"
      })
    }
    else if (percentage < 10) {
      this.setState({
        percentage: 0,
        message: ""
      })
    }
    else if (percentage >= 50 && percentage < 80) {
      this.setState({
        percentage: percentage,
        message: "Ok"
      })
    }
    else if (percentage >= 80) {
      this.setState({
        percentage: percentage,
        message: "Strong"
      })
    }
  }
  savePassword() {
    /*******************************
    SAVE PASSWORD IN REDIS ON SUBMIT
    *******************************/
    let context = this;
    console.log(context.state.value);
    $.ajax({
      type: 'POST',
      url: '/savePassword',
      contentType: 'application/JSON',
      data: JSON.stringify({
        saveWord: context.state.value
      })
    })
    .done(() => {
      console.log('password Saved');
      context.setState({
        value: '',
        wordLength: false,
        commonKeyword: false,
        uniqueChar: false,
        specialChar: false,
        historyKeyword:false,
        socialKeyword:false,
        strengthCount: 0,
      })

    })
    .fail((err) => {
      console.log('password did not save', err);
    });
    //clear text when saved
    context.refs.passwordClear.value = '';
  }


  render() {

    return(
      <div>
       <Navbar/>
        <section className="container">
          <div className="dash-center">
            <div className="card-deck">
              <div className="card wow fadeIn" style={styles.card}>
                <div className="card-block">
                <h4 className="card-title">Welcome @{this.state.userName}!</h4>
                  <div className="row">
                    <div className="col-lg-12 in-center">
                    <input ref="passwordClear" className="primary-text" placeholder="Input a Password..." type="password" name="value" style={{fontSize: '30px', maxWidth:'500px', color:'black'}} value={this.state.value} onChange={this.handleChange}/>
                      <p/>
                      <ProgressBar width={this.state.percentage.toString()+'%'} message={this.state.message}/>
                    <a className="btn btn-primary btn-md" onClick={this.savePassword}><i aria-hidden="true" style={{width:'300px'}}></i>Submit</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card wow fadeIn" style={styles.card}>
                <div className="card-block">
                  {this.state.donutChart && this.state.keywordBar ? <KeywordBarChart ranking={this.state.keywordsRanking}/> :
                  <div className="row">
                    <div className="col-lg-12 load-centered">
                      {this.state.wordLength ? <p style={styles.correctColor}>&#10004; Be a minimum of eight (8) characters in length.</p>:<p>&#x2716; Be a minimum of eight (8) characters in length.</p>}
                      {this.state.commonKeyword ? <p style={styles.correctColor}>&#10004; Does not contain a common keyword for a password.</p>:<p>&#x2716; Does not contain a common keyword for a password.</p>}
                      {this.state.uniqueChar ? <p style={styles.correctColor}>&#10004; Contain at least one (1) character from the following categories:
                        <li>Uppercase letter (A-Z)</li>
                        <li>Lowercase letter (a-z)</li>
                        <li>Digit (0-9)</li>
                        </p>:
                        <p>&#x2716; Contain at least one (1) character from the following categories:
                        <li>Uppercase letter (A-Z)</li>
                        <li>Lowercase letter (a-z)</li>
                        <li>Digit (0-9)</li>
                        </p>}
                      {this.state.specialChar ? <p style={styles.correctColor}>&#10004; Contains one or more special character. (!#$%^&*)</p>:<p>&#x2716; Contains one or more Special character. (!#$%^&*)</p>}
                      {this.state.historyKeyword ? <p style={styles.correctColor}>&#10004; Have not been used as a previous password.</p>:<p>&#x2716; Have not been used as a previous password.</p>}
                      {this.state.socialKeyword ? <p style={styles.correctColor}>&#10004; Contains NO relationship with your Twitter profile or postings.</p>:<p>&#x2716; Contains NO relationship with your Twitter profile or postings.</p>}

                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
           </div>
        </section>
      </div>
    )
  }
}

export default DashBoard;
