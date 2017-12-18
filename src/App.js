import React, { Component } from 'react';
import { Grid, Row, Col, Button, PageHeader, Nav, NavItem, Table, Image, Modal } from 'react-bootstrap';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';

const TABS = [
  { name: '最新要聞', key: 'news', component: 'News' },
  { name: '直播', key: 'live', component: 'Live' },
  { name: '電視節目', key: 'programmes', component: 'Programmes' }
];

const api = 'http://localhost:9000/v1/focus?limit=20';

const Live = (props) => {
  return (
    <div>Live</div>
  );
}

const Programmes = (props) => {
  return (
    <div>Programmes</div>
  );
}

class News extends Component {
  constructor() {
    super();

    // this.state = {news: []}
  }

  render() {
    return (
      <Table respbordered condensed hover>
        <tbody>
          {this.props.news.map((obj, key) => {
            return (
              <tr className="news-row" key={key} onClick={() => { this.props.onNewsClick(obj._id) }}>
                <td>
                  <Image className="news-img" alt="點我睇視頻" src={obj.image_url_big} rounded={true} />
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
    );
  }
}

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; Adam 2017</p>
    </footer>
  );
};


class MyLargeModal extends Component {
  render() {
    const { title, description, pubDate } = this.props.news;
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Body>
          <h3>{title || ''}</h3>
          <p><small>{moment(pubDate).format('llll')}</small></p>
          <div style={{ 'whiteSpace': 'pre-line' }}>{description ? description : ''}</div>
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

    this.state = { lgShow: false, news: [], modalNews: {}, tabSelected: TABS[0] }
    this.handleNewsClick = this.handleNewsClick.bind(this);
    this.handleTabChanged = this.handleTabChanged.bind(this);
  }

  componentDidMount() {
    // fetch the default tab news
    fetch(api).then(result => {
      return result.json();
    }).then(data => {
      this.setState({ news: data });
    }).catch(e => {
      console.log('e', e);
    });
  }

  handleTabChanged(tabKey) {
    const selectedTab = TABS.find((obj) => { return obj.key === tabKey });
    this.setState({ tabSelected: selectedTab });
  }

  handleNewsClick(id) {
    const news = this.state.news.find((obj) => { return obj._id === id });
    this.setState({ lgShow: true, modalNews: news });
  }

  render() {
    const lgClose = () => this.setState({ lgShow: false });
    const selectedComponent = this.state.tabSelected.component;
    const content = {
      'News': <News news={this.state.news} onNewsClick={this.handleNewsClick} />,
      'Live': <Live />,
      'Programmes': <Programmes />
    };

    return (
      <Grid>
        <MyLargeModal show={this.state.lgShow} news={this.state.modalNews} onHide={lgClose} />
        <Row>
          <PageHeader>TVB無線新聞 <p className="lead" id="leadstyle">.</p></PageHeader>
        </Row>
        <Row className="main">
          <Nav bsStyle="tabs" justified activeKey={this.state.tabSelected.key}>
            {TABS.map((obj, key) => {
              return <NavItem eventKey={obj.key} key={key} onSelect={this.handleTabChanged}> {obj.name} </NavItem>;
            })}
          </Nav>
          {content[selectedComponent]}
        </Row>
        <Footer />
      </Grid>
    );
  };
}


export default App;
