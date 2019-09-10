import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classNames from "classnames";
import Circle from './Circle';
export default class SqueezeCard extends Component {
    static propTypes = {
        show: PropTypes.bool,
        onReplay: PropTypes.func,
        backgroundImgSrc: PropTypes.string,
        goToNextPlaylistItem: PropTypes.func,
        nextItem: PropTypes.object,
        endCardShowInfo: PropTypes.bool,
        links: PropTypes.array,
        mode: PropTypes.string,
        playNextDelay: PropTypes.number,
        timeToEnd: PropTypes.number,
        runTimer: PropTypes.bool,
        enableSquezeCardControls: PropTypes.bool
    }
    static defaultProps = {
        mode: "squeeze" // Can be "squeeze" or "end"
    }
    constructor(props) {
        super(props);
        this.state = {
            countdownToNext: 0,
            totalCountdownToNext: 0, 
            countdownStopped: false 
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.runTimer !== nextProps.runTimer) {
            if (nextProps.runTimer) {
                this.countdownTimer = setInterval(this.onCountdownInterval, 1000);
            }
            else {
                clearInterval(this.countdownTimer);
            }
        }
        if (!this.props.show && nextProps.show) {
            clearInterval(this.countdownTimer);
            const initialCountdown = Math.floor(this.props.timeToEnd + this.props.playNextDelay);
            this.setState({
                countdownToNext: initialCountdown,
                totalCountdownToNext: initialCountdown
            })
            this.countdownTimer = setInterval(this.onCountdownInterval, 1000);
        }
        else if (this.props.show && !nextProps.show) {
            clearInterval(this.countdownTimer);
        }
    }
    onCountdownInterval = () => {
        let countdown = this.state.countdownToNext - 1;
        if (countdown <= 0) {
            clearInterval(this.countdown);
            this.props.goToNextPlaylistItem();
            return;
        }
        if(!this.state.countdownStopped) {
                this.setState({
            countdownToNext: countdown
        })  
        }
            
    }
    onCountDownStopped = () => {
        this.setState({
            countdownStopped: !this.state.countdownStopped
        })  
    }
    componentWillUnmount() {
        clearInterval(this.countdownTimer);
    }
    getProgress = () => {
        return this.state.countdownToNext / this.state.totalCountdownToNext;
    }
    render() {
        
        const { goToNextPlaylistItem, nextItem, mode, links, endCardShowInfo, playNextDelay, timeToEnd, enableSquezeCardControls } = this.props;
        const classnamesIcon = classNames({
        'hidden': !this.props.enableSquezeCardControls,
        'iconcss icon-play': this.state.countdownStopped && this.props.enableSquezeCardControls,
        'iconcss icon-pause': !this.state.countdownStopped
    });
        const classnames = classNames({
            'squeeze-card': true,
        }, 'squeeze-card--' + mode);
        const { totalCountdownToNext, countdownToNext } = this.state;
        return (
            <div className="card-wrapper">
                <ReactCSSTransitionGroup transitionName="squeeze-card" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {
                        this.props.show ?
                            <div className={classnames} style={{ background: "url(" + this.props.backgroundImgSrc + ")" }}>
                                <div className="squeeze-card__inner">
                                    <div className="squeeze-card__info-1">
                                        
                                        <div className="squeeze-card-img-wrapper">
                                            <div className="squeeze-card__pause" onClick={this.onCountDownStopped}>
                                                <i className={classnamesIcon}></i>
                                            </div>
                                            <div onClick={goToNextPlaylistItem}>
                                                <div className="next-episode-counter">Playing in {countdownToNext} seconds</div>
                                                <div className="squeeze-card-img">
                                                    <img src={nextItem.coverImgSrc} />
                                                    <i className="iconcss icon-play">
                                                        <Circle progress={this.getProgress()} />
                                                    </i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="squeeze-card-text">
                                            <h4>Coming up next</h4>
                                            <h3>{nextItem.title}</h3>
                                            <h4>{nextItem.subtitle}</h4>
                                            <p>{nextItem.description}</p>
                                        </div>
                                    </div>
                                    <div className="squeeze-card__info-2">
                                        <div className="squeeze-card__buttons">                                         
                                        {
                                            links.map(link=> {
                                                return (
                                                    <a className="squeeze-card__button" href={link.url}>{link.text}</a>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : 
                            null
                    }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}