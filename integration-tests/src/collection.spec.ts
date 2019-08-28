import * as faker from 'faker';
import {get, post, authenticate, authenticateAdmin, newUser, del} from "./utils";
import collectionFixture from "./fixtures/collection";
import api from "./api";

describe('List collections for a specific user or organization', () => {
    let adminToken;
    let user1InOrg1;
    let user2InOrg1;
    let user3NotInOrg1;
    let org1;
    let privateCollectionOwnedByUser1;
    let privateCollectionOwnedByOrg1;
    let publicCollectionOwnedByUser1;
    let publicCollectionOwnedByOrg1;

    beforeAll(async () => {
        adminToken = await authenticateAdmin();
        // making this as random as possible since we can't delete users
        const generateRandomName = () => faker.name.firstName() + faker.name.lastName();
        const username1 = generateRandomName();
        const username2 = generateRandomName();
        const username3 = generateRandomName();
        const orgId1 = faker.company.bsNoun();

        user1InOrg1 = await newUser(username1, username1, adminToken);
        user2InOrg1 = await newUser(username2, username2, adminToken);
        user3NotInOrg1 = await newUser(username3, username3, adminToken);
        user1InOrg1.token = await authenticate(username1, username1);
        user2InOrg1.token = await authenticate(username2, username2);
        user3NotInOrg1.token = await authenticate(username3, username3);

        org1 = await (await api.organizations.new(orgId1, adminToken)).json();
        await api.organizations.addNewMember(org1.members_url, user1InOrg1.username, adminToken);
        await api.organizations.addNewMember(org1.members_url, user2InOrg1.username, adminToken);

        privateCollectionOwnedByUser1 = await api.collections.new(user1InOrg1.url, collectionFixture(), user1InOrg1.token);
        privateCollectionOwnedByOrg1 = await api.collections.new(org1.url, collectionFixture(), user1InOrg1.token);
        publicCollectionOwnedByUser1 = await api.collections.new(user1InOrg1.url, collectionFixture('View'), user1InOrg1.token);
        publicCollectionOwnedByOrg1 = await api.collections.new(org1.url, collectionFixture('View'), user1InOrg1.token);
    });

    afterAll(async () => {
        const items = [
            publicCollectionOwnedByOrg1,
            publicCollectionOwnedByUser1,
            privateCollectionOwnedByOrg1,
            privateCollectionOwnedByUser1,
            org1,
            user3NotInOrg1,
            user2InOrg1,
            user1InOrg1,
        ];
        for(let i in items) await del(items[i].url, adminToken);
    });

    test('user can retrieve own collections', async () => {
        expect(await api.collections.list(`${user1InOrg1.url}`, user1InOrg1.token)).toEqual([
            publicCollectionOwnedByUser1,
            privateCollectionOwnedByUser1,
        ])
    });
});
