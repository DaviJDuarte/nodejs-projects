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

//  Only using any type here to test the parameterized test
export function getUser(username: any): {id: number, username: any}{
    if(!username) throw new Error('Username is required');

    return {id: new Date().getTime(), username};
}

export function fizzBuzz(input: number): "Fizz" | "Buzz" | "FizzBuzz" | number{
    if((input % 3  === 0) && (input % 5 === 0)) return "FizzBuzz";
    if(input % 3  === 0) return "Fizz";
    if(input % 5 === 0) return "Buzz";

    return input;
}