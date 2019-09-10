import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class ShareDialog extends Component {

	onClickShare = (e) => {
		this.props.onClickShare();
	}

	static propTypes = {
		show: PropTypes.bool,
		onClose: PropTypes.func,
		allowEmbed: PropTypes.bool,
		sharePlatforms: PropTypes.array
	}

	constructor(props) {
		super(props);
	}

	checkInput = (event) => {
		//numbers only
		if (!(event.charCode >= 48 && event.charCode <= 57)) {
			event.preventDefault();
			event.stopPropagation();
			return 0;
		}
	}

	copyValue = (event) => {
		let elem = event.target;
		elem.select();
		document.execCommand('copy');
		return true;
	}

	render() {

		let { show, allowEmbed, sharePlatforms } = this.props;

		const content = show ? (
			<div className="share-card">
				<div className="share-card__close" onClick={ this.props.onClose } >
					<i className="iconcss icon-close"></i>
				</div>
				<div className="share-card__content">
					{
						sharePlatforms.length > 0 ?
							<div className="share-card__buttons">
								{
									sharePlatforms.map((platform) => {
										switch(platform) {
											case "facebook": {
												return (
													<button className="share-card__button facebook">
														<i className="iconcss icon-facebook"></i>
													</button>
												)
											}
											case "twitter": {
												return (
													<button className="share-card__button twitter">
														<i className="iconcss icon-twitter"></i>
													</button>
												)
											}
											case "googleplus": {
												return (
													<button className="share-card__button google-plus">
														<i className="iconcss icon-google-plus"></i>
													</button>
												)
											}
											default:
												return null								
										}
									})
								}
							</div>
						:
							null
					}
					<div className="share-card__text-line share-card__link">
						<span className="label">Link</span>
						<input className="input-fullwidth truncate" type="text" defaultValue="http://www.usanetwork.com/shooter/videos/danger-close" readOnly onClick={ this.copyValue }></input>
					</div>
					{
						allowEmbed ?
							<div className="share-card__embed">
								<div className="share-card__text-line share-card__embed">
									<span className="label">Embed</span>
									<input className="input-fullwidth truncate" type="text" defaultValue="http://www.usanetwork.com/shooter/videos/danger-close" readOnly onClick={ this.copyValue }></input>
								</div>
								<div className="share-card__text-line share-card__size">
									<span className="label">Size</span>
									<input className="input-sizewidth " type="text" defaultValue="480" maxLength="4" onKeyPress={ this.checkInput }></input>
									<span className="size-separator">x</span>
									<input className="input-sizewidth" type="text" defaultValue="270" maxLength="4" onKeyPress={ this.checkInput }></input>
									<span className="space"></span>
								</div>
							</div>
						: 
							null
					}

				</div>
			</div>
		) : null;
		return (
			<ReactCSSTransitionGroup transitionName="share-card" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
				{content}
			</ReactCSSTransitionGroup>
		)
	}
}