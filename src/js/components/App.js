import React, { Component, PropTypes } from 'react';
import classNames from "classnames";
import Video from './Video';
import ControlBar from './ControlBar';
import PauseCard from './PauseCard';
import CCCard from './CCCard';
import SqueezeCard from './SqueezeCard';
import CoverImg from './CoverImg';
import ShareCard from './ShareCard';
import ShareTrigger from './ShareTrigger';
import LoadingCard from './LoadingCard';
import AdRollOverlay from './AdRollOverlay';
import SkipButton from './SkipButton';
import { vpModeLive, vpModeVOD, maxLiveReplayTime } from '../constants'
const bpXlarge = 1800;
const bpLarge = 1400;
const bpDesktop = 1100;
const bpMedium = 800;
const bpSmall = 600;
const bpXsmall = 480; // for isMobile

export default class App extends Component {

	static propTypes = {
		aspectRatio: PropTypes.number,
		playlist: PropTypes.array,
		showSqueezeCard: PropTypes.bool,
		playlist: PropTypes.array,
		initialPlaylistIndex: PropTypes.number,
		endCardLinks: PropTypes.array,
		controlBarHoverTimeout: PropTypes.number,
		playNextDelay: PropTypes.number,
		playerMode: PropTypes.string,
		adRoll: PropTypes.bool,
		sharePlatforms: PropTypes.array,
		allowEmbed: PropTypes.bool,
		allowShare: PropTypes.bool,
		theme: PropTypes.object,
		enableSquezeCardControls: PropTypes.bool,
		hasSkipButton: PropTypes.bool,
	}

	static childContextTypes = {
		theme: PropTypes.object
	}


	constructor(props) {
		super(props);

		// Initial state
		this.state = {
			currPlaylistIndex: props.initialPlaylistIndex,
			containerHover: false,
			hasLoadedMetadata: false,
			isPlaying: false,
			isPlayingAdRoll: props.adRoll,
			isWaiting: true,
			isScrubbing: false,
			isVolumeDragging: false,
			isVideoEnd: false,
			isFullScreen: false,
			showCCSettings: false,
			currentTime: props.playerMode === vpModeVOD ? 0 : 200,
			currentLiveReplayTime: 0,
			buffered: null,
			duration: 0,
			volume: 1,
			endCardOpen: false,
			squeezeCardOpen: false,
			showShareCard: false,
			isMobile: false,
			isTouch: false,
			justClickedPlay: false,
			hasSkipButton: props.hasSkipButton,
			forceToTime: 0,
			window : {
				width : 0,
				height : 0
			}
		}
	}

	getChildContext() {
    return {theme: this.props.theme};
  }

	componentDidMount() {
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);
	}

	onWindowResize = (e) => {
		var w = window,
		d = document,
		documentElement = d.documentElement,
		body = d.getElementsByTagName('body')[0],
		width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
		height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

		this.setState({
			window : {
				width : width,
				height : height
			}
		});
		this.detectMobile(width);
	}

	detectMobile = (_w) => {
		var _isMobile = false;
		//check if the size is xsmall
		if (_w <= bpXsmall) _isMobile = true;
		this.setState({
			isMobile : _isMobile
		});
	}
	setPlayState = (_state) => {
		this.setState({isPlaying: !this.state.isPlaying});
	}

	onMouseUp = () => {
		this.setState({
			isScrubbing: false,
			isVolumeDragging: false
		})
	}

	togglePlay = () => {
		
		const newState = {
			isPlaying: !this.state.isPlaying,
			isVideoEnd: false,
			containerHover: false
		}

		if (!this.state.isPlaying) {
			newState.justClickedPlay = true;
			setTimeout(()=> {
				this.setState({justClickedPlay: false});
			}, 1000);
		}
		
		this.setState(newState);

	}

	/********* Video events **********/

	onProgress = (time, bufferedRange) => {
		let newState = {
			currentTime: time,
			buffered: bufferedRange
		}
		// Open up the sqeeze card as we approach the end
		if (!this.state.isPlayingAdRoll) {
			if (this.props.endCardShowTime > 0) {
				let timeLeft = this.state.duration - time;
				if (!this.state.squeezeCardOpen && timeLeft <= this.props.endCardShowTime && timeLeft > this.props.endCardShowTime - 1) {
					newState.squeezeCardOpen = true;
				}
			}
		}
		this.setState(newState);
	}

	onLoad = (data) => {
		this.setState({
			isWaiting: false,
			duration: data.duration,
			hasLoadedMetadata: true,
			isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
		})
		this.onWindowResize();
		window.addEventListener("resize", this.onWindowResize);
	}

	onVideoCanPlay = () => {
		this.setState({
			isWaiting: false
		})
	}

	onVideoWaiting = () => {
		this.setState({
			isWaiting: true
		})
	}


	onVideoEnd = () => {
		this.setState({
			isPlaying: false,
			isVideoEnd: true
		})
	}


	onVideoClick = (e) => {
		e.preventDefault();
		if (this.state.squeezeCardOpen) {
			this.setState({
				squeezeCardOpen: false
			})
		}
		else {
			this.togglePlay();
		}
	}



	onVolumeChanged = (val, fromMouse = true) => {
		this.setState({
			volume: val,
			isVolumeDragging: fromMouse
		})
	}

	onScrubberChanged = (val, fromMouse = true) => {

		if (this.props.playerMode === vpModeVOD) {
			this.setState({
				isScrubbing: fromMouse,
				currentTime: val
			})
		}
		else {
			let currentLiveReplayTime = maxLiveReplayTime - val;
			let currentTime = (val/maxLiveReplayTime) * 200;
			this.setState({
				isScrubbing: fromMouse,
				currentLiveReplayTime: currentLiveReplayTime,
				currentTime: currentTime,
				forceToTime: currentTime
			})	

		}

	}

	onToggleFullScreen = () => {
		this.setState({
			isFullScreen: !this.state.isFullScreen
		})
	}

	onClickCCSettings = () => {
		this.setState({
			showCCSettings: true
		})
	}

	onCCSettingsSave = () => {
		this.setState({
			showCCSettings: false
		})
	}

	onCCSettingsCancel = () => {
		this.setState({
			showCCSettings: false
		})
	}

	shareCardShow = () => {
		this.setState({
			showShareCard: true
		})
	}
	shareCardHide = () => {
		this.setState({
			showShareCard: false
		})
	}

	onReplay = () => {
		this.setState({
			isPlaying: true,
			currentTime: 0,
			forceToTime: 0,
			squeezeCardOpen: false
		})
	}

	onMouseMove = (e) => {
		clearTimeout(this.mouseMoveTimeout);
		this.mouseMoveTimeout = setTimeout(this.clearJustMouseMoved, this.props.controlBarHoverTimeout*1000);
		if (!this.state.isJustMouseMoved) {
			this.setState({
				isJustMouseMoved: true
			})
		}
	}

	onMouseLeave = (e) => {
		clearTimeout(this.mouseMoveTimeout);
		if (this.state.isJustMouseMoved) {
			this.setState({
				isJustMouseMoved: false
			})
		}		
	}

	clearJustMouseMoved = () => {
		this.setState({
			isJustMouseMoved: false,
		})
	}


	goToNextPlaylistItem = () => {

		const { playlist } = this.props;
		const { currPlaylistIndex } = this.state;
		
		if (playlist[currPlaylistIndex + 1] == undefined) {
			return;
		}

		this.setState({
			currPlaylistIndex: currPlaylistIndex + 1,
			isWaiting: true,
			isPlaying: true,
			currentTime: 0,
			endCardOpen: false,
			squeezeCardOpen: false,
			showShareCard: false,
			showCCSettings: false,
			isVideoEnd: false
		})

	}


	/* ---- Ad roll stuff ---- */

	onAdRollProgress = () => {

	}

	onAdRollCanPlay = () => {
		this.setState({
			isWaiting: false
		})
	}

	onAdRollWaiting = () => {

	}

	onAdRollEnd = () => {
		this.setState({
			isPlayingAdRoll: false,
			isWaiting: true,
			currentTime: 0
		})
	}

	skipIntro = () => {
		this.setState({
			currentTime: 46.00,
			isPlaying: true,
			forceToTime: 46.00,
		})
	//reset forceToTIme after jumping to scene
		setTimeout(()=> {
				this.setState({forceToTime: this.state.currentTime});
			}, 1000);	
	}

	
	/* ---- Style ---- */

	getGlobalStyle() {

		let str = "";
		const { colorHighlight } = this.props.theme;
		str = str + ".theme-background { background-color: " + colorHighlight +  ";}";
		str = str + ".rc-slider-track { background-color: " + colorHighlight +  ";}";
		return str;
	}

	render() {

		const { 
			aspectRatio, 
			endCardShowTime,
			playlist,
			endCardLinks,
			playNextDelay,
			enableSquezeCardControls,
			allowEmbed,
			sharePlatforms,
			allowShare,
			hasSkipButton
		} = this.props;

		const { 
			isPlaying, 
			currentTime, 
			currentLiveReplayTime,
			forceToTime,
			buffered,
			duration, 
			isScrubbing, 
			volume, 
			isVolumeDragging, 
			isFullScreen,
			isVideoEnd,
			isJustMouseMoved,
			showCCSettings,
			isWaiting,
			showShareCard,
			squeezeCardOpen,
			isMobile,
			isTouch,
			currPlaylistIndex,
			hasLoadedMetadata,
			isPlayingAdRoll,
			justClickedPlay,
			
		} = this.state;

		const { videoSrc, coverImgSrc, title, subtitle, description } = playlist[currPlaylistIndex];
		const nextPlaylistItem = playlist[currPlaylistIndex + 1];
		const hasNextItem = nextPlaylistItem !== undefined;
		const timeToEnd = duration - currentTime;
		//const nextCountdown = parseInt(duration - currentTime + playNextDelay);

		const showCCSettingsCalc = (this.state.window.width > bpSmall) && showCCSettings;
		const coverImgShow = (currentTime === 0 && !isPlaying);
		const replayCardShow = isVideoEnd && !hasNextItem;

		const pauseCardShow = (isVideoEnd ? false : !isPlaying)  && !showShareCard && !showCCSettingsCalc;
		let endCardShow;

		if (endCardShowTime === 0) {
			endCardShow = (timeToEnd <= 0.2) && !showShareCard && hasNextItem && !isWaiting && !isPlayingAdRoll;
		}
		else {
			endCardShow = (squeezeCardOpen || timeToEnd <= 0.2) && hasNextItem && !isWaiting && !isPlayingAdRoll;
		}

		const controlBarShow = (isJustMouseMoved || isScrubbing || isVolumeDragging) && !(justClickedPlay || endCardShow || coverImgShow || showCCSettingsCalc || showShareCard || isVideoEnd);
		const showShareTrigger = allowShare && (pauseCardShow || (isJustMouseMoved && !showShareCard && !showCCSettings && !isPlayingAdRoll) || (isVideoEnd && !hasNextItem && !showShareCard));


		var isPlayingCalc;
		if (this.props.playerMode == vpModeVOD) {
			isPlayingCalc = !showShareCard && (!showCCSettingsCalc || isMobile) && isPlaying;
		}else if (this.props.playerMode == vpModeLive) {
			isPlayingCalc = isPlaying;
		}

		
		const runSqueezeCardTimer = !showShareCard;
		const endCardShowInfo = !showShareCard && !showCCSettingsCalc;
		const loadingCardShow = isPlaying && isWaiting;

		//const controlBarShow = true;
		const classnames = classNames({
			'container': true,
			'container--playing': isPlayingCalc,
			'container--volume-dragging': isVolumeDragging,
			'container--fullscreen': isFullScreen,
			'container--show-controls': controlBarShow,
			//'container--show-controls': true,
			'container--show-share-card': showShareCard,
			'container--is-mobile': isMobile,
			'container--is-touch': isTouch,
			'container--show-squeeze-card': endCardShow,
			'container--no-squeeze': endCardShowTime === 0,
			'container--is-playing-ad': isPlayingAdRoll,
			[this.props.playerMode]: true
		})

		const style = {
			paddingTop: ((1/aspectRatio) * 100) + "%"
		}

		const globalStyle = this.getGlobalStyle();



		return (
			<div className={classnames} style={style} ref={(el)=>{this.player = el}} onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave}>
				<style>
					{ globalStyle }
				</style>


				{ isPlayingAdRoll ?
						<div>
							<Video 
								key={-1}
								videoSrc={"assets/img/mobile-stroke-ad.mp4"} 
								currentTime={0}
								isPlaying={isPlaying}
								isScrubbing={false}
								isFullScreen={isFullScreen}
								onProgress={this.onProgress}
								onLoad={this.onLoad}
								volume={volume}
								onToggleFullScreen={this.onToggleFullScreen}
								onVideoEnd={this.onAdRollEnd}
								onVideoCanPlay={this.onAdRollCanPlay}
								onVideoWaiting={this.onAdRollWaiting}
								forceToTime={forceToTime}
							/>
							<AdRollOverlay timeToEnd={timeToEnd} placement="overlay"/>
						</div>
					:
						<Video 
							key={videoSrc}
							videoSrc={videoSrc} 
							currentTime={currentTime}
							isPlaying={isPlayingCalc}
							isScrubbing={isScrubbing}
							isFullScreen={isFullScreen}
							onLoad={this.onLoad} 
							onProgress={this.onProgress}
							volume={volume}
							endCardShowInfo={endCardShowInfo}
							onToggleFullScreen={this.onToggleFullScreen}
							onClick={this.onVideoClick}
							onVideoEnd={this.onVideoEnd}
							onVideoCanPlay={this.onVideoCanPlay}
							onVideoWaiting={this.onVideoWaiting}
							setPlayState={this.setPlayState}
							forceToTime={forceToTime}
						/>
				}
				<LoadingCard
					show={loadingCardShow}
				/>
				<CoverImg
					src={coverImgSrc}
					show={coverImgShow}
				/>
				

				{ hasSkipButton ? 

				<SkipButton
					skipIntro={this.skipIntro}
					currentTime={currentTime}
				/> : null

				}



				<PauseCard 
					show={pauseCardShow}
					onClick={this.togglePlay}
					videoTitle={title}
					videoSubtitle={subtitle}
					videoDescription={description}
					isVideoEnd={isVideoEnd}
 					hasNextItem={hasNextItem}
 					showShareCard={showShareCard}
 					backgroundImgSrc={coverImgSrc}
				/>
				<PauseCard 
					show={replayCardShow}
					onClick={this.togglePlay}
					videoTitle={title}
					videoSubtitle={subtitle}
					videoDescription={description}
					mode="replay"
					isVideoEnd={isVideoEnd}
 					hasNextItem={hasNextItem}
 					showShareCard={showShareCard}
 					backgroundImgSrc={coverImgSrc}
				/>
				<CCCard
					show={showCCSettingsCalc}
					onSave={this.onCCSettingsSave}
					onCancel={this.onCCSettingsCancel}
				/>
				<ShareCard
					show={showShareCard}
					onClose={this.shareCardHide}
					allowEmbed={allowEmbed}
					sharePlatforms={sharePlatforms}
				/>
				<ShareTrigger
					show={showShareTrigger}
					onClick={this.shareCardShow}
					isVideoEnd={isVideoEnd}
 					hasNextItem={hasNextItem}
 					showShareCard={showShareCard}
				/>
				<SqueezeCard
					show={endCardShow}
					backgroundImgSrc={coverImgSrc}
					onReplay={this.onReplay}
					goToNextPlaylistItem={this.goToNextPlaylistItem}
					nextItem={nextPlaylistItem}
					endCardShowInfo={endCardShowInfo}
					links={endCardLinks}
					playNextDelay={playNextDelay}
					enableSquezeCardControls={enableSquezeCardControls}
					timeToEnd={timeToEnd}
					runTimer={runSqueezeCardTimer}
				/>
				<ControlBar
					isScrubbing={isScrubbing}
					isPlaying={isPlaying}
					onTogglePlay={this.togglePlay}
					currentTime={currentTime}
					currentLiveReplayTime={currentLiveReplayTime}
					duration={duration}
					onStartHandleDrag={this.onStartHandleDrag}
					volume={volume}
					onVolumeChanged={this.onVolumeChanged}
					onStartVolumeDrag={this.onStartVolumeDrag}
					isVolumeDragging={isVolumeDragging}
					onScrubberChanged={this.onScrubberChanged}
					onToggleFullScreen={this.onToggleFullScreen}
					onClickCCSettings={this.onClickCCSettings}
					videoSrc={videoSrc}
					nextPlaylistItem={nextPlaylistItem}
					goToNextPlaylistItem={this.goToNextPlaylistItem}
					playerMode={this.props.playerMode}
					isPlayingAdRoll={isPlayingAdRoll}
				/>
			</div>
		)
	}
}