"use strict";

export const makeElementVisible = (element) => {
    if (element) {
        element.classList.remove('invisible');
    }
};

export const makeElementInvisible = (element) => {
    if (element) {
        element.classList.add('invisible');
    }
};
