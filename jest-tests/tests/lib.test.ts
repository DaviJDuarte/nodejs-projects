import {absolute, getCurrencies, getProduct, greet} from '../server/lib'

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
        const result = getProduct(1);

        expect(result).toMatchObject({
            id: expect.any(Number),
            price: expect.any(Number)
        });
    });
});