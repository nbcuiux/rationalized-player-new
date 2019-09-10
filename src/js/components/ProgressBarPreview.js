import React, { Component, PropTypes } from 'react';
import classNames from "classnames";
import { formatTime } from '../client/utils';

export default class ProgressBarPreview extends Component {

	static propTypes = {
		videoSrc: PropTypes.string,
		timePoint: PropTypes.number,
		timePercent: PropTypes.number,
		videoSrc: PropTypes.string
	}

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return true;
		console.log("the orgress bar preview is updating", nextProps, this.props);
		/*
		if (this.props.videoSrc !== nextProps.videoSrc) {
			return true;
		}

		if (!this.props.show && !nextProps.show) {
			return false;
		}
		else {
			return true;
		}
		*/
	}

	componentDidUpdate(prevProps) {

		const { timePoint, progWidth, timePercent, previewFrame } = this.props;

		if (previewFrame !== prevProps.previewFrame) {
			// Update position of preview video
			this.video.currentTime = previewFrame;

			// Update the position of this component to follow mouse
			let progWidth = this.container.parentNode.offsetWidth;
			let x = timePercent * progWidth;
			let width = this.container.offsetWidth;
			let halfWidth = width / 2;
			let left = width/2;
			let arrowLeft = 0;

			if (x < halfWidth) {
				left = halfWidth;
				arrowLeft = x - halfWidth
			}
			else if (x > progWidth - halfWidth) {
				left = progWidth - halfWidth;
				arrowLeft = x - progWidth + halfWidth;
			}
			else {		
				left = x;
				arrowLeft = 0;
			}

			this.container.style.left = left;
			this.arrow.style.left = arrowLeft;
		}

	}

	render() {

		const { timePoint, show } = this.props;
		const classnames = classNames({
			'quick-preview': true,
			'quick-preview--show': show
		});

		return (
			<div className={classnames} ref={(el)=>{this.container = el}}>
				<div className="quick-preview__arrow" ref={(el)=>{this.arrow = el}}></div>
				<div className="quick-preview__inner">
					<video className="quick-preview__video" ref={(el)=>{this.video = el}} muted={true} key={this.props.videoSrc}>
			      <source src={this.props.videoSrc} type="video/mp4" />'
			    </video>
				<div className="quick-preview__time">{formatTime(timePoint)}</div>
				</div>
			</div>
		)
	}
}