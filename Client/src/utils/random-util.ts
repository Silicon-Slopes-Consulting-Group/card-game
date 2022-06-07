export class RandomUtils {
    static randomizeArray<T>(array: T[]): T[] {
        let index = array.length;
        let randomIndex;

        while (index !== 0) {
            randomIndex = Math.floor(Math.random() * index);
            index--;

            [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
        }

        return array;
    }
}