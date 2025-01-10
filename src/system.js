"use strict";
import { ATTEMPTS } from './constants.js';
import { makeElementVisible, makeElementInvisible } from './utils.js';
import Game from './game.js';
import { stopBackgroundSound, playWindSound, playLoseSound, playBackgroundSound } from './sound.js';

class System {ㅇ
    constructor() {
        // 게임 시스템 상태 프로퍼티
        this._count = ATTEMPTS; // 상태 초기화
        // DOM 요소 프로퍼티
        this.triesElement = document.getElementById('tries');
        this.startTextElement = document.getElementById('startText');
        this.failTextElement = document.getElementById('failText');
        this.successTextElement = document.getElementById('successText');
        this.overTextElement = document.getElementById('overText');
        this.startBtnElement = document.getElementById('startBtn');
        this.restartBtnElement = document.getElementById('restartBtn');
        this.resetBtnElement = document.getElementById('resetBtn');

        // 시도 횟수 1회 차감 및 DOM 업데이트
        this.decreaseCount = () => {
            this._count -= 1;
            if (this.triesElement) {
                this.triesElement.innerText = this._count.toString();
            }
        };

        // 시도 횟수 남아있는 경우 새 게임 시작
        this.gameStart = async () => {
            this.decreaseCount();
            const result = await new Game();
            stopBackgroundSound();
            if (result) {
                playWindSound();
                if (this.successTextElement) {
                    makeElementVisible(this.successTextElement);
                }
            } else {
                playLoseSound();
                if (this._count > 0) {
                    if (this.failTextElement) {
                        makeElementVisible(this.failTextElement);
                    }
                } else {
                    if (this.overTextElement) {
                        makeElementVisible(this.overTextElement);
                    }
                }
            }
        };

        // 시작하기 버튼 이벤트
        this.start = () => {
            if (this.startTextElement) {
                makeElementInvisible(this.startTextElement);
            }
            playBackgroundSound();
            this.gameStart();
        };

        // 다시 시작 버튼 이벤트
        this.restart = () => {
            if (this.failTextElement) {
                makeElementInvisible(this.failTextElement);
            }
            playBackgroundSound();
            this.gameStart();
        };

        // 시스템 시작 DOM 세팅
        if (this.triesElement) {
            this.triesElement.innerText = this._count.toString();
        }
        if (this.startTextElement) {
            makeElementInvisible(this.startTextElement);
        }
        if (this.startBtnElement) {
            this.startBtnElement.addEventListener("click", this.start);
        }
        if (this.restartBtnElement) {
            this.restartBtnElement.addEventListener("click", this.restart);
        }
    }

    // 시스템 clean up
    cleanup() {
        if (this.triesElement) {
            this.triesElement.innerText = ATTEMPTS.toString();
        }
        if (this.startBtnElement) {
            this.startBtnElement.removeEventListener("click", this.start);
        }
        if (this.restartBtnElement) {
            this.restartBtnElement.removeEventListener('click', this.restart);
        }
        if (this.successTextElement) {
            makeElementInvisible(this.successTextElement);
        }
        if (this.overTextElement) {
            makeElementInvisible(this.overTextElement);
        }
    }
}
export default System;
