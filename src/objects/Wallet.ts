export interface QueuedKaching {
    amount: number;
    reason: string;
    gain: boolean;
}

export default class Wallet {
    private money: number;
    private queue: QueuedKaching[];
    constructor(amount: number) {
        this.money = amount;
        this.queue = [];
    }

    public get() {
        return this.money;
    }

    public add(amount: number, reason: string) {
        this.money += amount;
        this.queueKaching({amount: amount, reason: reason, gain: true});
    }

    public subtract(amount: number, reason: string) {
        this.money -= amount;
        this.queueKaching({amount: amount, reason: reason, gain: false});
    }

    public queueKaching(kaching: QueuedKaching) {
        this.queue.push(kaching);
    }
    
    public getNextQueue() {
        return this.queue && this.queue.length && this.queue.pop();
    }
}
