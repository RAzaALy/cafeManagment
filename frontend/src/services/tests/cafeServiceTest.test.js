// src/services/__tests__/cafeServices.test.js
import axiosInstance from '../api/axiosInstance';
import {
    fetchCafes,
    addCafe,
    updateCafe,
    deleteCafe,
    fetchCafesByLocation,
} from '../cafeServices';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockAxios = new AxiosMockAdapter(axiosInstance);

describe('Cafe Services', () => {
    afterEach(() => {
        mockAxios.reset(); // Reset the mock adapter after each test
    });

    test('fetchCafes should return list of cafes', async () => {
        const cafes = [{ id: 1, name: 'Cafe 1' }, { id: 2, name: 'Cafe 2' }];
        mockAxios.onGet('/cafe').reply(200, cafes);

        const result = await fetchCafes();
        expect(result).toEqual(cafes);
    });

    test('addCafe should create a new cafe', async () => {
        const newCafe = { name: 'New Cafe' };
        const createdCafe = { id: 3, ...newCafe };
        mockAxios.onPost('/cafe', newCafe).reply(201, createdCafe);

        const result = await addCafe(newCafe);
        expect(result).toEqual(createdCafe);
    });

    test('updateCafe should update an existing cafe', async () => {
        const cafeId = 1;
        const updatedCafeData = { name: 'Updated Cafe' };
        const updatedCafe = { id: cafeId, ...updatedCafeData };
        mockAxios.onPut(`/cafe/${cafeId}`, updatedCafeData).reply(200, updatedCafe);

        const result = await updateCafe(cafeId, updatedCafeData);
        expect(result).toEqual(updatedCafe);
    });

    test('deleteCafe should remove a cafe', async () => {
        const cafeId = 1;
        mockAxios.onDelete(`/cafe/${cafeId}`).reply(204);

        await expect(deleteCafe(cafeId)).resolves.not.toThrow();
    });

    test('fetchCafesByLocation should return cafes by location', async () => {
        const location = 'Downtown';
        const cafes = [{ id: 1, name: 'Cafe 1' }];
        mockAxios.onGet(`/cafe?location=${location}`).reply(200, cafes);

        const result = await fetchCafesByLocation(location);
        expect(result).toEqual(cafes);
    });
});
