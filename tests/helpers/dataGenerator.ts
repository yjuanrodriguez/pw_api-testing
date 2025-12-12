import { faker } from '@faker-js/faker';

export class DataGenerator {
    static generateUser() {
        return {
            id: faker.number.int({ min: 1, max: 1000 }),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
        };
    }
     
    static generateNewUser() {
        return {
            name: faker.person.firstName(),
            job: faker.person.jobTitle(),
        };
    }
}