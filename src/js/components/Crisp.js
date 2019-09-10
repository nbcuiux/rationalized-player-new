import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classNames from "classnames";
import App from "./App";
import { vpModeLive, vpModeVOD } from '../constants'




const defaultOptions = {
	playlist: [
		{
			videoSrc: "assets/img/sing.mp4",
			coverImgSrc: "assets/img/sing-movie-animals.jpg",
			title: "The Sing Movie",
			subtitle: "In Theaters August 19",
			description: "A group of animals that enter a singing competition, hosted by a koala hoping to save his theater."
		},
		{
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}
	],
	initialPlaylistIndex: 0,
	aspectRatio: 1280/692,
	endCardShowTime: 0,
	playNextDelay: 14,
	enableSquezeCardControls: false,
	controlBarHoverTimeout: 2,
	hasSkipButton: false,
	playerMode: "vp-mode-vod",
	endCardLinks: [
		{
			text: "Some link 1",
			url: "http://blah.com"
		},
		{
			text: "Some link 2",
			url: "http://blah.com"
		}
	],
	adRoll: false,
	sharePlatforms: ["facebook", "twitter", "googleplus"],
	allowEmbed: true,
	allowShare: true,
	theme: {
		colorHighlight: "#33b5d5"
	} 
}




export default class Crisp extends Component {

	static propTypes = {
	}


	constructor(props) {
		super(props);

		this.state = {
			jsonError: false,
			isChanged: false,
			playerOptionsJson: JSON.stringify(defaultOptions, null, 4),
			playerOptions: defaultOptions
		}


		this.generationIndex = 0;
	}

	updateJson = (e) => {
		let val=e.target.value;
		this.setState({
			playerOptionsJson: val,
			isChanged: true
		})
	}

	generate = () => {

		if (!this.state.isChanged) {
			return;
		}

		let options;
		try {
			options = JSON.parse(this.state.playerOptionsJson);
		}
		catch (e) {
			this.setState({
				jsonError: true
			});
			return;
		}



		this.setState({
			playerOptions: options,
			jsonError: false,
			isChanged: false
		});

	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.playerOptions !== this.state.playerOptions) {
			this.generationIndex++;
		}
	}

	reset = () => {
		this.setState({
			jsonError: false,
			isChanged: false,
			playerOptionsJson: JSON.stringify(defaultOptions, null, 4),
			playerOptions: defaultOptions
		})
	}

	toggleAdRoll = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.adRoll = !options.adRoll;
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	toggleEnableSquezeCardControls = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.enableSquezeCardControls = !options.enableSquezeCardControls;
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	toggleLive = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.endCardShowTime = 0;
		options.playerMode = (options.playerMode === vpModeLive) ? vpModeVOD : vpModeLive;
		options.playlist = [{
			videoSrc: "assets/img/snl.mp4",
			coverImgSrc: "http://az616578.vo.msecnd.net/files/2016/10/22/636127531512802882-908543127_SNL.jpg",
			title: "Saturday Night Live",
			subtitle: "E04S20",
			description: "Weekend Update anchors Colin Jost and Michael Che tackle the week's biggest news, including President Donald Trump's accusation that President Obama wiretapped him and his address to Congress."
		}];
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	toggleSqueeze = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.endCardShowTime = (options.endCardShowTime > 0) ? 0 : 14;
		options.enableSquezeCardControls = false;
		options.playerMode = vpModeVOD;
		
		options.playlist = ([{
			videoSrc: "assets/img/sing.mp4",
			coverImgSrc: "assets/img/sing-movie-animals.jpg",
			title: "The Sing Movie",
			subtitle: "In Theaters August 19",
			description: "A group of animals that enter a singing competition, hosted by a koala hoping to save his theater."
		},
		{	
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}]);
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	toggleNextVideoContent = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.enableSquezeCardControls = (options.enableSquezeCardControls) ? false : false;
		options.playlist = (options.playlist.length > 1) ? ([{
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}]) : ([{
			videoSrc: "assets/img/sing.mp4",
			coverImgSrc: "assets/img/sing-movie-animals.jpg",
			title: "The Sing Movie",
			subtitle: "In Theaters August 19",
			description: "A group of animals that enter a singing competition, hosted by a koala hoping to save his theater."
		},
		{	
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}]);
		options.endCardShowTime = (options.playlist.length <= 1) ? 0 : options.endCardShowTime;
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	toggleSkipButton = () => {
		const options = Object.assign({}, this.state.playerOptions);
		options.hasSkipButton = !options.hasSkipButton;
		options.playlist = (options.playlist.length > 1) ? ([{
			videoSrc: "assets/img/svu.mp4",
			coverImgSrc: "assets/img/svu-cover.jpg",
			title: "Law and Order: Special Victims Unit",
			subtitle: "Season 20 Ep9 Mea Culpa",
			description: "Stone asks Benson to investigate a sexual encounter from his past that he feels guilt and uncertainty about; Rollins considers a proposal from Doctor Al."
		}]) : ([{
			videoSrc: "assets/img/sing.mp4",
			coverImgSrc: "assets/img/sing-movie-animals.jpg",
			title: "The Sing Movie",
			subtitle: "In Theaters August 19",
			description: "A group of animals that enter a singing competition, hosted by a koala hoping to save his theater."
		},
		{	
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}]);
		this.setState({
			playerOptionsJson: JSON.stringify(options, null, 4),
			playerOptions: options
		})
	}

	render() {
		const options = this.state.playerOptions;
		const optionsJson = this.state.playerOptionsJson;
		const { jsonError, isChanged } = this.state;
		const classnames = classNames({
			'crisp-container': true,
			'crisp--json-error': jsonError,
			'crisp--changed': isChanged,
		})
		const classnamesToggleAdRoll = classNames({
			'crisp-toggle': true,
			'crisp-toggle--disabled': options.hasSkipButton,
			'crisp-toggle--active': options.adRoll
		})
		const classnamesToggleSquezeCardControls = classNames({
			'crisp-toggle': true,
			'crisp-toggle--disabled': options.playlist.length <= 1 || options.hasSkipButton,
			'crisp-toggle--active': options.enableSquezeCardControls
		})
		const classnamesToggleLivePlayer = classNames({
			'crisp-toggle': true,
			'crisp-toggle--disabled': options.hasSkipButton,
			'crisp-toggle--active': options.playerMode === vpModeLive
		})
		const classnamesToggleSqueezeCard = classNames({
			'crisp-toggle': true,
			'crisp-toggle--disabled': options.hasSkipButton,
			'crisp-toggle--active': options.endCardShowTime > 0 && options.playerMode === vpModeVOD && options.playlist.length > 1
		})
		const classnamesToggleHasNext = classNames({
			'crisp-toggle': true,
			'crisp-toggle--disabled': options.hasSkipButton,
			'crisp-toggle--active': options.playlist.length > 1
		})

		const classnamesToggleHasSkip = classNames({
			'crisp-toggle': true,
			'crisp-toggle--active': options.hasSkipButton
		})
		return (
			<div className={classnames}>
				<h1>Player Config Sandbox</h1>

				<div className="crisp-editor__header">
					<h2>Player Options</h2>
					<button className="crisp-button" onClick={this.reset}>Reset to Default</button>
				</div>
				{
					jsonError ? 
						<div className="crisp__error-msg">
							Whoops, looks like there's a syntax error with your JSON! Please fix and try again.
						</div>
					:
					 	null
				}
				<textarea className="crisp-textarea" value={optionsJson} onChange={this.updateJson}></textarea>
				<div className="crisp-generate">
					<div className="crisp-toggles">
						<div className={classnamesToggleAdRoll} onClick={this.toggleAdRoll}>
							<div><i className="iconcss icon-tick"></i></div>
							Show Ad Roll
						</div>
						<div className={classnamesToggleLivePlayer} onClick={this.toggleLive}>
							<div><i className="iconcss icon-tick"></i></div>
							Show Live Player
						</div>
						<div className={classnamesToggleSqueezeCard} onClick={this.toggleSqueeze}>
							<div><i className="iconcss icon-tick"></i></div>
							Show Squeeze Card
						</div>
						<div className={classnamesToggleHasNext} onClick={this.toggleNextVideoContent}>
							<div><i className="iconcss icon-tick"></i></div>
							Has Next Video?
						</div>
						<div className={classnamesToggleSquezeCardControls} onClick={this.toggleEnableSquezeCardControls}>
							<div><i className="iconcss icon-tick"></i></div>
							Pause Timer
						</div>
						<div className={classnamesToggleHasSkip} onClick={this.toggleSkipButton}>
							<div><i className="iconcss icon-tick"></i></div>
							Skip Intro
						</div>
					</div>
					<button className="crisp-generate__button" onClick={this.generate}>Generate Player from JSON</button>
				</div>
				<div className="crisp-player-wrapper">
					<ReactCSSTransitionGroup transitionName="player" transitionEnterTimeout={1300} transitionLeaveTimeout={1300}> 
						<div className="player" key={this.generationIndex}>
							<div className="crisp-spinner">
								<div className="spinner">
					        <div></div>
					        <div></div>
					        <div></div>
					      </div>
							</div>
							<App {...options} />
						</div>
					</ReactCSSTransitionGroup>
				</div>
			</div>
		)
	}
}