import { ATTEMPTS } from './constants.ts';
import { makeElementVisible, makeElementInvisible } from './utils.ts';
import Game from './game.ts';
import { playBackgroundSound, playLoseSound, playWindSound, stopBackgroundSound } from './sound.ts';

class System {
    // 게임 시스템 상태 프로퍼티
    #count: number;

    // DOM 요소 프로퍼티
    triesElement = document.getElementById('tries');
    startTextElement = document.getElementById('startText');
    failTextElement = document.getElementById('failText');
    successTextElement = document.getElementById('successText');
    overTextElement = document.getElementById('overText');
    startBtnElement = document.getElementById('startBtn');
    restartBtnElement = document.getElementById('restartBtn');
    resetBtnElement = document.getElementById('resetBtn');

    constructor() {
        // 시스템 시작 프로퍼티 세팅
        this.#count = ATTEMPTS;

        // 시스템 시작 DOM 세팅
        if (this.triesElement) this.triesElement.innerText = this.#count.toString();
        if (this.startTextElement) makeElementInvisible(this.startTextElement);
        if (this.startBtnElement) this.startBtnElement.addEventListener("click", this.#start);
        if (this.restartBtnElement) this.restartBtnElement.addEventListener("click", this.#restart);
    }

    // 시도 횟수 1회 차감 및 DOM 업데이트
    #decreaseCount = () => { 
        this.#count -= 1;
        if(this.triesElement) this.triesElement.innerText = this.#count.toString();
    }

    // 시도 횟수 남아있는 경우 새 게임 시작
    #gameStart = async () => {
        this.#decreaseCount();
        const result = await new Game();

        stopBackgroundSound();
        
        if (result) {
            playWindSound();
            if (this.successTextElement) makeElementVisible(this.successTextElement);
        } else {
            playLoseSound();
            if (this.#count > 0) {
                if (this.failTextElement) makeElementVisible(this.failTextElement);
            } else {
                if (this.overTextElement) makeElementVisible(this.overTextElement);
            }
        }
    }

    // 시작하기 버튼 이벤트
    #start = () => {
        if (this.startTextElement) makeElementInvisible(this.startTextElement);
        playBackgroundSound();
        this.#gameStart();
    }

    // 다시 시작 버튼 이벤트
    #restart = () => {
        if (this.failTextElement) makeElementInvisible(this.failTextElement);
        playBackgroundSound();
        this.#gameStart();
    }

    // 시스템 clean up
    cleanup() {
        if (this.triesElement) this.triesElement.innerText = ATTEMPTS.toString();
        if (this.startBtnElement) this.startBtnElement.removeEventListener("click", this.#start);
        if (this.restartBtnElement) this.restartBtnElement.removeEventListener('click', this.#restart);
        if (this.successTextElement) makeElementInvisible(this.successTextElement);
        if (this.overTextElement) makeElementInvisible(this.overTextElement);
    }
}

export default System;