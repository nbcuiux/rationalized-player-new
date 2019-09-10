import React, { Component, PropTypes } from 'react';

const circleLength = 188;
export default class Circle extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		let progressLength = Math.round(this.props.progress * circleLength);
		return (
			<svg viewBox="0 0 60 60" className="progress-circle" style={{ strokeDashoffset : progressLength, color : "#f00" }} >
				<path strokeWidth="2" strokeMiterlimit="10" stroke="#FFFFFF" d="M30,3.3c14.7,0,26.7,12,26.7,26.7S44.7,56.7,30,56.7S3.3,44.7,3.3,30C3.3,15.3,15.2,3.3,30,3.3"/>
			</svg>
		)
	}
}