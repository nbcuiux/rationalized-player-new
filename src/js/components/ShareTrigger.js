import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classNames from "classnames";

export default class ShareTrigger extends Component {

	static propTypes = {
		onClickShare : PropTypes.func
	}


	constructor(props) {
		super(props);
		this.state = {
 			showExpanded: false
 		}
	}

	onClickShare = (e) => {
		this.props.onClickShare();
	}

	render() {
		let { show, isVideoEnd, hasNextItem, showShareCard } = this.props;
		let { showExpanded } = this.state;
 		showExpanded = isVideoEnd && !hasNextItem && !showShareCard;
 		const classnames = classNames({
 			'share-trigger': true,
 			'share-trigger--expanded': showExpanded
 		});

		const content = show ? (
			<div className={classnames} onClick={ this.props.onClick }>
				<i className="iconcss icon-share"></i>
			</div>
		) : null;
		
		return (
			<ReactCSSTransitionGroup transitionName="share-trigger" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
				{content}
			</ReactCSSTransitionGroup>
		)
	}
}