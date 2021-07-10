import React from 'react';

class Rank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: '',
    };
  }

  componentDidMount() {
    this.getEmoji(this.props.entries);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.entries === this.props.entries) {
      return;
    } else {
      this.getEmoji(this.props.entries);
    }
  }

  getEmoji = (entries) => {
    fetch(
      `https://2yyihydex6.execute-api.us-east-1.amazonaws.com/dev/leaderboard?score=${entries}`,
      {
        method: 'get',
      }
    )
      .then((res) => res.json())
      .then((data) => this.setState({ emoji: String(data.input) }))
      .catch((err) => '💩');
  };

  render() {
    return (
      <div>
        <div className="white f3">
          {`${this.props.name}, your current entry count is...`}
        </div>
        <div className="white f1">
          {typeof this.props.entries === 'string'
            ? `${this.props.entries}  `
            : ''}
        </div>
        <div className="white f3">{'Badge: ' + this.state.emoji}</div>
      </div>
    );
  }
}
export default Rank;
