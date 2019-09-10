import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classNames from "classnames";


export default class PauseCard extends Component {

	static propTypes = {
		show: PropTypes.bool,
		onClick: PropTypes.func,
		mode: PropTypes.string
	}

	static defaultProps = {
		mode: "play"
	}


	constructor(props) {
		super(props);
		this.state = {
 			showExpanded: false
		}
	}

	render() {

		const { show, play, onClick, videoTitle, videoSubtitle, videoDescription, isVideoEnd, hasNextItem, showShareCard, backgroundImgSrc} = this.props;
		let { showExpanded } = this.state;
 		showExpanded = isVideoEnd && !hasNextItem;
 		const classnames = classNames({
 			'pause-card': true,
 			'pause-card--expanded': showExpanded
 		});
 		let backgroundStyle = showExpanded ? ({ backgroundImage: "url(" + backgroundImgSrc + ")" }) : null;
		return (
			<div className="card-wrapper">
				<ReactCSSTransitionGroup transitionName="pause-card" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					{
						show ? (
							<div className={classnames} onClick={onClick} style={backgroundStyle}>
								<div className="pause-card__content">
									<h2>{videoTitle}</h2>
									<h3>{videoSubtitle}</h3>
									<p>{videoDescription}</p>
								</div>
								<div className="pause-card__play">
									<i className="iconcss icon-play"></i>
								</div>								
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