import { ANSWERS, TIME_LIMIT } from './constants.ts';
import { playFailSound, playSuccessSound } from './sound.ts';
import { makeElementInvisible, makeElementVisible } from './utils.ts';

class Game {
    // 타이머 관련 프로퍼티
    #timerCount: number;
    #timerId: ReturnType<typeof setInterval> | undefined;

    // 정답 및 현재 정답 여부 관리
    #currentStage: number;
    #answer: string;
    #problemText: string;

    // DOM 요소 프로퍼티
    hangmanElements = document.querySelectorAll(".canvas > img");
    timerElement = document.getElementById('timer');
    problemTextElement = document.getElementById('problemText');
    answerTextElement = document.getElementById('answerText');
    alphabetBtnElements = document.querySelectorAll('.alphabets > button') as NodeListOf<HTMLButtonElement>;
    alphabetEventListeners: EventListener[] = [];

    // 새로 추가된 프로퍼티
    gamePromise: Promise<boolean>;

    constructor() {
        // 게임 시작 프로퍼티 세팅
        this.#timerCount = TIME_LIMIT;
        this.#currentStage = 0;
        this.#answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        console.log(this.#answer); 
        this.#problemText = this.#answer.split('').map(cur => (cur === " " ? " " : "_")).join('');

        // 게임 시작 DOM 세팅
        if (this.timerElement) this.timerElement.innerText = this.#timerCount.toString();
        if (this.problemTextElement) this.problemTextElement.innerText = this.#problemText;
        if (this.problemTextElement) makeElementInvisible(this.problemTextElement);
        if (this.answerTextElement) this.answerTextElement.innerText = `정답: ${this.#answer}`;
        if (this.answerTextElement) makeElementInvisible(this.answerTextElement);

        // 게임 결과 반환 프로미스 생성
        this.gamePromise = new Promise((resolve) => {
            // 타이머 설정, 0초 도달 시 game over, 프로미스는 false를 resolve
            this.#timerId = setInterval(() => {
                if (this.#timerCount <= 0) resolve(false);
                else this.#decreaseTimerCount();
            }, 1000);

            // 알파벳 버튼 입력 이벤트 등록
            this.alphabetBtnElements.forEach((e) => {
                const onClick = () => {
                    this.#clickAlphabet(e, resolve);
                    e.removeEventListener('click', onClick);
                }
                this.alphabetEventListeners.push(onClick);
                e.addEventListener('click', onClick);
            })
        });
        this.gamePromise.then(this.#gameOver);
    }

    #clickAlphabet = (e: HTMLButtonElement, resolve: (value: boolean | PromiseLike<boolean>) => void) => {
        e.classList.add('btn-invisible');
        e.removeEventListener('click', () => this.#clickAlphabet(e, resolve));

        if (this.#answer.includes(e.innerText)) {
            playSuccessSound();
            this.#updateProblemText(e.innerText);
            if (this.#problemText == this.#answer) resolve(true);
        } else {
            playFailSound();
            if (this.#currentStage < this.hangmanElements.length - 1) this.#nextStage();
            else resolve(false);
        }
    };

    // 타이머 1초 감소 및 DOM 업데이트
    #decreaseTimerCount() {
        this.#timerCount -= 1;
        if (this.timerElement) this.timerElement.innerText = this.#timerCount.toString();
    }

    // currentStage 1 증가 및 행맨 이미지 추가
    #nextStage() {
        this.#currentStage += 1;
        Array.from(this.hangmanElements).slice(0, this.#currentStage).forEach((e)=> e.classList.remove('invisible'))
    }

    // 알파벳 입력으로 인한 problemText 업데이트
    #updateProblemText(newAlphabet: string) {
        this.#problemText = this.#problemText.split('').map((cur, index) => {
            if (cur === ' ' || cur !== '_') return cur;
            return this.#answer[index] === newAlphabet ? newAlphabet : '_';
        }).join('');
        if (this.problemTextElement) this.problemTextElement.innerText = this.#problemText;
    }

    // 게임 오버, 게임 실패 시 false / 성공 시 true 반환
    #gameOver = (result:boolean) => {
        clearInterval(this.#timerId);
        if (this.answerTextElement) makeElementVisible(this.answerTextElement);

        this.hangmanElements.forEach((e) => e.classList.add('invisible'));
        if (this.problemTextElement) makeElementInvisible(this.problemTextElement);
        this.alphabetBtnElements.forEach((e, index) => {
            e.classList.remove("btn-invisible");
            e.removeEventListener('click', this.alphabetEventListeners[index]);
        });

        return result;
    }
}

export default Game;