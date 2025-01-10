"use strict";

export default class Game {
    constructor() {
        // 게임 초기화 코드
        this.answer = this.getRandomAnswer();
        this.attempts = 0;
    }

    getRandomAnswer() {
        const answers = [
            'Elice',
            'Tesla',
            'Destiny tech',
            'Javascript',
            'Ecmascript',
            'Literal',
            'Boolean',
            'Undefined',
            'Scope chain',
            'Closure',
            'Hoisting',
            'Event loop',
            'Call stack',
            'Promise',
            'Async',
            'Await',
            'Fetch',
            'Axios',
            'Rest api',
            'Execution context',
            'Lexical environment',
            'Constructor',
            'Extends',
            'Iterable',
        ];
        return answers[Math.floor(Math.random() * answers.length)];
    }

    // 게임 로직 관련 메서드 추가
    checkAnswer(userAnswer) {
        this.attempts++;
        return userAnswer.toUpperCase() === this.answer;
    }
}
