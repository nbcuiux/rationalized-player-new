import React, { Component, PropTypes } from 'react';
import classNames from "classnames";

export default class Circle extends Component {

  static propTypes = {
    skipIntro: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  render() {
    let { skipIntro, currentTime } = this.props;

    const classnames = classNames({
      'btn-skip': true,
      'btn-skip--visible': currentTime > 0.00 && currentTime < 46.00
    });

    return (
      <div onClick={ this.props.skipIntro }>
        <span className={classnames}>Skip Intro</span>
      </div>
    )
  }
}