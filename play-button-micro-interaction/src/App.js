import React, {Component} from 'react'
import {TimelineMax, TweenMax, Back, Linear} from 'gsap';

import './App.css'
export default class App extends Component {
    buttonSize = {
        width: 60,
        height: 60
    };

    explosionItems = [];
    waveItems = [];
    tweenStatus = true;

    createExplosionEffectItems() {
        let start = 0;
        let numberOfElements = 8;
        let slice = 360 * (1 / (numberOfElements));
        for(let i = 0; i < numberOfElements; i++) {
            let $self = document.createElement('span'),
                rotate = slice * i + start;
            this.explosionItems.push({
                $self, rotate
            });
            this.explosionEffect.appendChild($self);
        }
    }

    tweenExplosion() {
        this.explosionItems.forEach((item) => {
            this.tweenExplosionItem(item);
        });
    }

    tweenExplosionItem(item) {
        if (!!item.firstTween) {
            item.firstTween.time(0);
        }
        item.setTween = TweenMax.set(item.$self,
            { 'transform': 'rotate(' + item.rotate + 'deg) translate(0) rotate(90deg)' });
        item.firstTween = TweenMax.to(item.$self, .5,
            {
                'transform': 'rotate(' + item.rotate + 'deg) translate(120px) rotate(90deg)',
                height: 0,
                ease: Linear.easeNone
            });

    }

    createWaveEffectItems() {
        let numberOfElements = 11;
        for(let i = 0; i < numberOfElements; i++) {
            let $self = document.createElement('span');
            this.waveItems.push({
                $self,
                time: (Math.round(Math.random() * 300) / 1000)
            });
            this.waveEffect.appendChild($self);
        }
    }

    tweenWave() {
        this.timelineMaxWave.to(this.waveEffect, .3,
            {opacity: 1, ease: Linear.easeNone});
    }

    tweenWaveItems() {
        this.waveItems.forEach((item) => {
            this.tweenWaveEffectItem(item);
        });
    }

    tweenWaveEffectItem(item) {
        if (!!item.firstTween) {
            item.firstTween.pause();
            delete item.firstTween;
            return;
        }
        item.setTween = TweenMax.set(item.$self,
            { height: 10 });
        item.firstTween = TweenMax.to(item.$self, .2, {
            height: 24,
            ease: Linear.easeNone,
            repeat: -1,
            delay:item.time,
            yoyo: true
        }, 0.2);
    }

    tweenPlayIcon() {
        this.timelineMaxPlayIcon.set(this.playButtonInner,
            {opacity: 1, transform: 'rotateX(1deg)', ease: Linear.easeNone});
        this.timelineMaxPlayIcon.to(this.playButtonInner, .3,
            {opacity: 0,
                transform: 'rotateY(90deg)',
                transformOrigin: '50% 50%', ease: Linear.easeNone});
    }

	toggle() {
        if (this.tweenStatus) {
           this.tweenStatus = false;
            this.playButton.classList.toggle('active');
            this.tweenExplosion();

            this.timelineMax.reversed() || this.timelineMax.paused()
                ? this.timelineMax.play() : this.timelineMax.reverse();
            this.timelineMaxPlayIcon.reversed() || this.timelineMaxPlayIcon.paused()
                ? this.timelineMaxPlayIcon.play() : this.timelineMaxPlayIcon.reverse();
            this.timelineMaxWave.reversed() || this.timelineMaxWave.paused()
                ? this.timelineMaxWave.play() : this.timelineMaxWave.reverse();
            setTimeout(() => {
                this.tweenWaveItems();
                this.tweenStatus = true;
            }, .3)
        }
	}

	tweenButton() {
        this.timelineMax.to(this.playButton, .3,
            {width: 230, height: 60, ease: Back.easeOut.config(2.1)});
    }

    componentDidMount() {
        this.timelineMax = new TimelineMax({paused:true});
        this.timelineMaxPlayIcon = new TimelineMax({paused:true});
        this.timelineMaxWave = new TimelineMax({paused:true});
        this.tweenButton();
        this.createExplosionEffectItems();
        this.createWaveEffectItems();
        this.tweenPlayIcon();
        this.tweenWave();
    }

	render() {
		return (<div className={'content'}>
                <div
                    ref={self => this.explosionEffect = self}
                    className={'explosion-effect'}></div>
			<button className={'playButton'}
					ref={self => this.playButton = self}
				style={{
                    height: this.buttonSize.height,
                    width: this.buttonSize.width,
					borderRadius: this.buttonSize.height
                }}
				onClick={() => this.toggle()}
			>
				<i
					ref={self => this.playButtonInner = self}
					className="play-icon fa fa-play"
				/>
				<div
                    ref={self => this.waveEffect = self}
                    className={'wave-effect'}></div>

			</button>
			</div>)
	}
}
