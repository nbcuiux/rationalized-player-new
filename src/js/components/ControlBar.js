import React, { Component, PropTypes } from 'react';
import ProgressBar from './ProgressBar';
import HoverDialog from './HoverDialog';
import VolumeControl from './VolumeControl';
import NextDialog from './NextDialog';
import CCDialog from './CCDialog';
import QualityDialog from './QualityDialog';
import AdRollOverlay from './AdRollOverlay';
import { formatTime } from '../client/utils';
import { vpModeLive, vpModeVOD, maxLiveReplayTime } from '../constants';

export default class ControlBar extends Component {

	static propTypes = {
		isScrubbing: PropTypes.bool,
		isPlaying: PropTypes.bool,
		onTogglePlay: PropTypes.func,
		onStartHandleDrag: PropTypes.func,
		currentTime: PropTypes.number,
		duration: PropTypes.number,
		volume: PropTypes.number,
		onVolumeChanged: PropTypes.func,
		onStartVolumeDrag: PropTypes.func,
		isVolumeDragging: PropTypes.bool,
		onToggleFullScreen: PropTypes.func,
		onClickCCSettings: PropTypes.func,
		videoSrc: PropTypes.string,
		nextPlaylistItem: PropTypes.object,
		goToNextPlaylistItem: PropTypes.func,
		showNextTrigger : PropTypes.bool,
		showCCTrigger : PropTypes.bool,
		isPlayingAdRoll: PropTypes.bool
	}

	constructor(props) {
		super(props);
	}

	onTogglePlay = (e) => {
		e.stopPropagation();
		this.props.onTogglePlay();
	}

	onToggleVolume = (e) => {
		e.stopPropagation();
		if (this.props.volume > 0.02) {
			this.props.onVolumeChanged(0, false);
		}
		else {
			this.props.onVolumeChanged(1, false);
		}
	}

	jumpToLive = (e) => {
		this.props.onScrubberChanged(maxLiveReplayTime, false);
	}

	render() {

		const { 
			onTogglePlay, 
			currentTime, 
			duration, 
			volume, 
			isVolumeDragging, 
			onScrubberChanged, 
			onVolumeChanged, 
			isScrubbing,
			onClickCCSettings,
			videoSrc,
			nextPlaylistItem,
			goToNextPlaylistItem,
			isPlayingAdRoll,
			theme,
			playerMode,
			currentLiveReplayTime
		} = this.props;

		const volumeDialog = <VolumeControl
			onChange={onVolumeChanged}
			value={volume}
			onStartHandleDrag={this.props.onStartVolumeDrag}
		/>;

		const nextDialog = <NextDialog item={nextPlaylistItem} goToNextPlaylistItem={goToNextPlaylistItem}/>
		const ccDialog = <CCDialog onClickSettings={onClickCCSettings} />;
		const qualityDialog = <QualityDialog />;

		let volIconClass;
		if (volume <= 0) {
			volIconClass = "muted";
		}
		else if (volume < 0.3) {
			volIconClass = "small";
		}
		else if (volume < 0.7) {
			volIconClass = "medium";
		}
		else {
			volIconClass = "max";
		}

		return (
			<div className="control-bar">
				{
					playerMode === vpModeVOD ?
						<ProgressBar 
							currentTime={currentTime}
							duration={duration}
							onChange={onScrubberChanged}
							isScrubbing={isScrubbing}
							videoSrc={videoSrc}
						/>
					:
						<ProgressBar 
							currentTime={maxLiveReplayTime - currentLiveReplayTime}
							duration={maxLiveReplayTime}
							onChange={onScrubberChanged}
							isScrubbing={isScrubbing}
							videoSrc={videoSrc}
							isLive={true}
						/>
				}
				<div className="control-bar__left">
					<div className="play-control" onClick={this.onTogglePlay}>
						<i className="iconcss icon-play"></i>
						<i className="iconcss icon-pause"></i>
					</div>
					{
						playerMode === vpModeVOD ?
							<div className="control-bar__time">
								{ formatTime(currentTime) } / { formatTime(duration) }
							</div>
						:
							<div className={"control-bar__live" + (currentLiveReplayTime === 0 ? " control-bar__live-active" : "")}>
								<div className="control-bar__live-indicator">LIVE<span className="control-bar__live-time">{ "-" + formatTime(currentLiveReplayTime) } behind</span></div>
								<button className="control-bar__live-button" onClick={this.jumpToLive}>
									Go live
									<i className="fa fa-fast-forward"></i>
								</button>
							</div>
					}
				</div>
				<div className="control-bar__right">
					{
						nextPlaylistItem !== undefined ?
							<HoverDialog className="hover-dialog--next" dialog={nextDialog}> 
								<div className="control-bar__icon control-bar__icon--next">
									<i className="iconcss icon-next" onClick={goToNextPlaylistItem}></i>
								</div>
							</HoverDialog>
						:
							null
					}
					<HoverDialog className="hover-dialog--quality" dialog={qualityDialog}>
						<div className="control-bar__icon">
							<i className="iconcss icon-gear"></i>
						</div>
					</HoverDialog>
					<HoverDialog className="hover-dialog--cc" dialog={ccDialog} disabled={isPlayingAdRoll}>
						<div className="control-bar__icon">
							<i className="iconcss icon-cc"></i>
						</div>
					</HoverDialog>
					<HoverDialog className="hover-dialog--volume" dialog={volumeDialog} alwaysShowIf={isVolumeDragging}>
						<div className="control-bar__icon">
							<i className={"iconcss icon-volume-" + volIconClass } onClick={this.onToggleVolume}></i>
						</div>
					</HoverDialog>

					<div className="control-bar__icon" onClick={this.props.onToggleFullScreen}>
						<i className="control-bar__icon-fullscreen"></i>
					</div>
				</div>
			</div>
		)
	}
}