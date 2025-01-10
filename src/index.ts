import System from './system.ts';
import { makeElementInvisible } from './utils.ts';

window.addEventListener('DOMContentLoaded', function () {
    const resetBtnElements = document.getElementsByClassName('reset-btn');
    const answerTextElement = document.getElementById('answerText');
    let currentSystem = new System();

    Array.from(resetBtnElements).forEach(function (e) {
        e.addEventListener('click', function () {
            currentSystem.cleanup();
            if (answerTextElement) {
                makeElementInvisible(answerTextElement);
            }
            currentSystem = new System();
        });
    });
});