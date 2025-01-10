export function makeElementVisible(e: HTMLElement) {
    e.classList.add('flex-visible');
    e.classList.remove('invisible');
}

export function makeElementInvisible(e: HTMLElement) {
    e.classList.remove('flex-visible');
    e.classList.add('invisible');
}