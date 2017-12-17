import React, { Component } from 'react';
import { Grid, Row, Col, Button, PageHeader, Nav, NavItem, Table, Image, Modal } from 'react-bootstrap';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';

const tabs = [
  { name: '最新要聞', key: 'news' },
  { name: '直播', key: 'live' },
  { name: '電視節目', key: 'programmes' }
];

const api = 'http://localhost:9000/v1/focus?limit=20';

class Main extends Component {
  constructor(props) {
    super(props);

    this.selected = tabs[0].key;
    this.tags = tabs;
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    this.selected = e;
    console.log(e);
  }

  render() {
    return (
      <Row className="main">
        <Nav bsStyle="tabs" justified activeKey={this.selected} onSelect={this.handleSelect}>
          {this.tags.map((obj, key) => {
            return <NavItem eventKey={obj.key} key={key}>{obj.name}</NavItem>;
          })}
        </Nav>
        <Table respbordered condensed hover>
        <tbody>
        {this.props.news.map((obj, key) => {
            return (
              <tr className="news-row" key={key} onClick={()=>{this.props.onNewsClick(obj._id)}}>
                <td>
                <Image className="news-img" alt="點我睇視頻" src={obj.image_url_big} rounded={true}/>
                </td>
                <td>
                <h4><strong>{obj.title}</strong></h4>
                <p><small>{moment(obj.pubDate).format('llll')}</small></p>
                </td>
                </tr>
            );
          })}
          </tbody>
        </Table>
      </Row>
    );
  }
}

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; Company 2017</p>
    </footer>
  );
};


class MyLargeModal extends Component {
  render() {
    const {title, description, pubDate} = this.props.news;
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Body>
          <h3>{title || ''}</h3>
          <p><small>{moment(pubDate).format('llll')}</small></p>
          <div style={{'white-space': 'pre-line'}}>{description ? description : ''}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


class App extends Component {
  constructor() {
    super();

    this.state = {lgShow: false , news: [], modalNews: {}}
    this.handleNewsClick = this.handleNewsClick.bind(this);
  }

  componentDidMount() {
    fetch(api).then(result=>{
      return result.json();
    }).then(data=>{
      this.setState({news: data});
    }).catch(e=>{
      console.log('e', e);
    });
  }

  handleNewsClick(id) {
    const news = this.state.news.find((obj)=>{return obj._id === id});
    this.setState({ lgShow: true, modalNews: news});
  }

  render() {
    let lgClose = () => this.setState({ lgShow: false });    
    return (
      <Grid>
        <MyLargeModal show={this.state.lgShow} news={this.state.modalNews} onHide={lgClose} />
        <Row>
          <PageHeader>TVB無線新聞 <p className="lead" id="leadstyle">.</p></PageHeader>
        </Row>
        <Main news={this.state.news} onNewsClick={this.handleNewsClick} />
        <Footer />
      </Grid>
    );
  };
}


export default App;
