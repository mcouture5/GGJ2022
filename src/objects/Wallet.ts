export default class Wallet {
    private money: number;
    constructor(amount: number) {
        this.money = amount;
    }
    public get() {
        return this.money;
    }
    public add(amount: number) {
        this.money += amount;
    }
    public subtract(amount: number) {
        this.money -= amount;
    }
}
