import React, { Component, PropTypes } from 'react';
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";


// This manager class allows us to assign ids to each instance of HoverDialog,
// and then remeber which is open to make sure we don't have more than one open
// at once.

export default class LoadingCard extends Component {

	static propTypes = {
		show: PropTypes.bool
	}

	constructor(props) {
		super(props);
	}

	render() {

		const classnames = classNames({
			'loading-card': true
		})

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="loading-card" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					{
						this.props.show ? (
							<div className={classnames}>
								<div className="loading-card__spinner"></div>
							</div>
						)
						:
							null
					}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}