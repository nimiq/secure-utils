export class Random {
    static getRandomId() {
        let array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }

    static pickRandom(array = []) {
        if (array.length < 1) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
}
