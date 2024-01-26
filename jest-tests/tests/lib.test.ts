import {absolute, fizzBuzz, getCurrencies, getProduct, getUser, greet} from '../server/lib'

describe('absolute', () => {
    it('should be a positive number if input is positive', () => {
        const result: number = absolute(1);
        expect(result).toBe(1);
    });

    it('should be a positive number if input is negative', () => {
        const result: number = absolute(-1);
        expect(result).toBe(1);
    });

    it('should be 0 if input is 0', () => {
        const result: number = absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message with the user\'s name', () => {
        const result = greet('David');
        expect(result).toContain('David');
    });
});

describe('getCurrencies', () => {
    it('should return the supported currencies', () => {
        const result: string[] = getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['USD', 'BRL']));
    });
});

describe('getProduct', () => {
    it('should return a product with the given id and its price', () => {
        const result: {id: number, price: number} = getProduct(1);

        expect(result).toMatchObject({
            id: expect.any(Number),
            price: expect.any(Number)
        });
    });
});

describe('getUser', () => {
    it.each( ['', false, undefined, null])
    ('should throw an error if username is falsy', (falsyValue: any) => {
       expect(() => getUser(falsyValue)).toThrow();
    });

    it('should return a user if the username is truthy', () => {
        const result = getUser('David');
        expect(result).toMatchObject({
            id: expect.any(Number),
            username: expect.anything()
        });
    });
});

describe('fizzBuzz', () => {
   it('should return FizzBuzz if input is divisible by both 3 and 5', () => {
      const result = fizzBuzz(15);
      expect(result).toBe('FizzBuzz');
   });

   it('should return Fizz if input is divisible by 3', () => {
      const result = fizzBuzz(3);
      expect(result).toBe('Fizz');
   });

   it('should return Buzz if input is divisible by 5', () => {
      const result = fizzBuzz(5);
      expect(result).toBe('Buzz');
   });

   it('should return the input if it is not divisible by 3 nor 5', () => {
      const result = fizzBuzz(1);
      expect(result).toBe(1);
   });
});