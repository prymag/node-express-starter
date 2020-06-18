import UserService from "@modules/user/services/user.service";
import { Error } from "mongoose";
import UserModel from "@core/models/user.model";
import { MongooseDB } from "@db/mongoose";
import Faker from "faker";

describe('Modules/User/Services/UserService', () => {
    //
    const service = new UserService();

    let mongoose;
    beforeAll(async () => {
        //
        //jest.useFakeTimers();

        mongoose = new MongooseDB(process.env.MONGO_CONNECTION_STR, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        await mongoose.start();        
    });

    afterEach((done) => {
        UserModel.collection
            .drop()
            .then(success => done())
            .catch(err => {
                //
                if (err.constructor && err.constructor.name != 'MongoError') {
                    console.log(err);
                }
                done();
            });
    });

    afterAll((done) => {
        mongoose.stop(done);
    });

    it('Should throw an error when invalid password length', () => {
        //
        expect.assertions(1);
        const body = {
            username:'username',
            email: 'test@mail.com',
            password: 'abc'
        };

        return expect(service.encryptPassword(body)).rejects.toBeInstanceOf(Error.ValidationError);      
    });

    it('should return an encrpyted password', async () => {
        //
        expect.assertions(3);

        const body = {
            username:'username',
            email: 'test@mail.com',
            password: 'abc123456'
        };
        
        const result = await service.encryptPassword(body);
        expect(result.password).not.toBe(body.password);
        expect(result.password).not.toBe(null);
        expect(result.password.length).toBeGreaterThan(20);
    });

    it('CREATE AND READ', async () => {
        //
        expect.assertions(4);

        const body = {
            username: 'perry',
            password: 'test@pass',
            email: 'mail@mail.com'
        };
        const result = await service.save(body);
        //
        expect(result.username).toBeTruthy();
        expect(result._id).toBeTruthy();

        const user = await service.get(result._id);
        expect(user).toBeInstanceOf(UserModel);
        expect(user.username).toBe(body.username);
    });

    it('UPDATE', async () => {
        //
        expect.assertions(3);

        const body = {
            username: 'perry',
            password: '1234567',
            email: 'eamil@mail.com',
            firstname: 'firstname',
            lastname: 'lastname'
        };

        const user = await service.save(body);
        //
        const update = {
            email: 'email@changed.com',
            firstname: 'john',
            lastname: 'doe'
        };

        const result = await service.update(user._id, update);

        expect(result.firstname).toEqual(update.firstname);
        expect(result.lastname).toEqual(update.lastname);
        expect(result.email).toEqual(update.email);
    });

    it('DELETE', async () => {
        //
        expect.assertions(2);
        const body = {
            username: 'perry',
            password: '1234567',
            email: 'eamil@mail.com',
            firstname: 'firstname',
            lastname: 'lastname'
        };

        const user = await service.save(body);
        
        const {deletedCount} = await service.delete(user._id);
        const result = await UserModel.findById(user._id);
        
        expect(deletedCount).toBe(1);
        expect(result).toBeNull();
    });

    it('GET ALL, PAGE, LIMIT', async () => {
        //
        expect.assertions(7);
        const bodies = [];
        for(let x = 0; x < 30; x++) {
            //
            try {
                await service.save({
                    username: Faker.internet.userName(),
                    password: Faker.internet.password(),
                    email: Faker.internet.email(),
                    firstname: Faker.name.firstName(),
                    lastname: Faker.name.lastName()
                }); 
            } catch (e) {
                console.log(e);
            }
        }
        //
        try {
            let result = await service.all();

            expect(result).toHaveProperty('docs', 'totalDocs', 'limit', 'totalPages', 'page');
            expect(result.totalDocs).toBe(30);
            expect(result.limit).toBe(10);
            expect(result.page).toBe(1);

            result = await service.all({page: 2, limit: 5});
            
            expect(result.page).toBe(2);
            expect(result.limit).toBe(5);
            expect(result.totalPages).toBe(6);
            //
        } catch (e) {
            console.log(e);
        }
        //
    });

    it('SEARCH ALL', async () => {
        //
        expect.assertions(3);
        
        for(let x = 0; x <= 30; x++) {
            //
            try {
                await service.save({
                    username: Faker.internet.userName(),
                    password: Faker.internet.password(),
                    email: Faker.internet.email(),
                    firstname: Faker.name.firstName(),
                    lastname: Faker.name.lastName()
                }); 
            } catch (e) {
                console.log(e);
            }
        }

        await service.save({
            username: 'myspecialuser',
            password: 'password12312',
            email: 'myemail@mail.com',
            firstname: 'john mann',
            lastname: 'doe'
        });

        await service.save({
            username: 'codenam312',
            password: '213paswie',
            email: 'someon21@mail.com',
            firstanme: 'jane lex',
            lastname: 'johnsdottir'
        });

        let result = await service.all({s: 'code'});

        expect(result.totalDocs).toBe(1);
        
        result = await service.all({s: 'john'});

        expect(result.totalDocs).toBe(2);

        result = await service.all({s: 'unsearchable'});

        expect(result.totalDocs).toBe(0);
    });
});