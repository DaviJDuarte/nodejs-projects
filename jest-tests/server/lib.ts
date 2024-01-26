export function absolute(number: number): number {
    return number >= 0 ? number : -number;
}

export function greet(name: string): string {
    return `Welcome, ${name}`;
}

export function getCurrencies(): string[] {
    return ['USD', 'BRL', 'AUD'];
}

export function getProduct(id: number): { id: number, price: number } {
    return {id, price: id * 2};
}