import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { debounce } from 'lodash';

export default class Video extends Component {

	static propTypes = {
		videoSrc: PropTypes.string,
		isPlaying: PropTypes.bool,
		onProgress: PropTypes.func,
		onLoad: PropTypes.func,
		updateInterval: PropTypes.number,
		isScrubbing: PropTypes.bool,
		currentTime: PropTypes.number,
		volume: PropTypes.number,
		isFullScreen: PropTypes.bool,
		onToggleFullScreen: PropTypes.func,
		onClick: PropTypes.func,
		endCardShowInfo: PropTypes.bool,
		onVideoEnd: PropTypes.func,
		onVideoCanPlay: PropTypes.func,
		onVideoWaiting: PropTypes.func
	}

	static defaultProps = {
		updateInterval: 200,
		onProgress: () => false,
		onLoad: () => false,
		onVideoEnd: () => false,
		onVideoCanPlay: () => false
	}


	constructor(props) {
		super(props);
	}

	componentDidMount() {

		// Set up player events
		this.video.addEventListener('loadedmetadata', this.onLoad);
		//this.video.addEventListener('loadeddata', this.onLoad);		
		this.video.addEventListener('ended', this.props.onVideoEnd);
		this.video.addEventListener('canplay', this.props.onVideoCanPlay);
		this.video.addEventListener('waiting', this.props.onVideoWaiting);

		this.video.addEventListener('webkitfullscreenchange', this.onFullScreenChange, false);
		this.video.addEventListener('mozfullscreenchange', this.onFullScreenChange, false);
		this.video.addEventListener('fullscreenchange', this.onFullScreenChange, false);
		this.video.addEventListener('MSFullscreenChange', this.onFullScreenChange, false);

		//ios
		this.video.addEventListener('webkitendfullscreen', this.oniOsDone, false);
	}

	componentDidUpdate(prevProps) {
		const { isPlaying, isScrubbing, currentTime, volume, isFullScreen, forceToTime } = this.props;

		// Play / pause
		if (prevProps.isPlaying !== isPlaying) {
			if (isPlaying) {
				this.play();
			}
			else {
				this.pause();
			}
		}

		if (isPlaying && isScrubbing !== prevProps.isScrubbing) {
			if (isScrubbing) {
				this.pause();
			}
			else {
				this.play();
			}
		}

		if (isScrubbing) {
			if (prevProps.currentTime !== currentTime) {
				this.video.currentTime = currentTime;
			}
		} else if (prevProps.forceToTime !== forceToTime) {
			this.video.currentTime = forceToTime;
		}

		if (volume !== prevProps.volume) {
			this.video.volume = volume;
		}

		if (isFullScreen !== prevProps.isFullScreen) {
			if (isFullScreen) {
				this.goFullScreen();
			}
			else {
				this.exitFullScreen();
			}
		}
	}

	play() {
		this.video.play();
		this.startProgressUpdates();
	}

	pause() {
		this.video.pause();
		this.stopProgressUpdates();		
	}

	oniOsDone = () => {
		console.log("oniOsDone");
		this.props.setPlayState(false);
	}

	onFullScreenChange = () => {
		let paused = this.video.paused;
		console.log("onFullScreenChange! Paused =", paused);

		const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
		this.pendingFullScreenState = state;
		if (state !== this.props.isFullScreen) {
			// If there's a mismatch it means we applied full screen with the native browser control,
			// so we need to re-update the full screen state as a result
			this.props.onToggleFullScreen();
		}
	}

	goFullScreen() {
		let video = this.video;
		if (video.requestFullscreen) {
			video.requestFullscreen();
		}
		else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen();
		}
		else if (video.webkitRequestFullScreen) {
			video.webkitRequestFullScreen();
		}
	}

	exitFullScreen() {
		let video = this.video;
		if (document.exitFullscreen) {
			video.exitFullscreen();
		}
		else if (document.mozExitFullscreen) {
			video.mozExitFullscreen();
		}
		else if (document.webkitExitFullscreen) {
			video.webkitExitFullscreen();
		}
	}

	debounceRestart = debounce(()=>{
		console.log("restarting....");
		this.video.play();
	}, 1000)

	componentWillUnmount() {
		this.stopProgressUpdates();
		this.video.removeEventListener('loadeddata', this.onLoad);
	}

	startProgressUpdates() {
		this.onProgress();
		this.progressUpdateTimeout = setInterval(this.onProgress, this.props.updateInterval);
	}

	stopProgressUpdates() {
		clearInterval(this.progressUpdateTimeout);
	}

	onProgress = () => {
		let currentTime = this.video.currentTime;
		let bufferedRange = this.video.buffered;
		this.props.onProgress(currentTime, bufferedRange);
	}

	onLoad = () => {
		let data = {
			duration: this.video.duration
		}
		this.props.onLoad(data);

		if (this.props.isPlaying) {
			this.play();
		}
	}

	render() {

		const { videoSrc, onClick, endCardShowInfo } = this.props;

		return (
			<div className="video-container">
				<video className="video" src={videoSrc} ref={(el)=> { this.video = el }} onClick={onClick} />
				<i className="iconcss icon-replay"></i>
			</div>
		)
	}
}