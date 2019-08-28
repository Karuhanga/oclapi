import {put, get, post} from "./utils"

const api = {
    organizations: {
        new: async (orgId: string, token: string, publicAccess: boolean= true): Promise<Response> => publicAccess ?
            post('orgs/', {id: orgId, name: orgId}, token) :
            post('orgs/', {id: orgId, name: orgId, public_access: 'None'}, token),
        addNewMember: async (membersUrl, user, token) => put(`${membersUrl}${user}/`, undefined, token),
    },
    collections: {
        list: async (ownerUrl, token, verbose=true) => (await get(`${ownerUrl}collections/?verbose=${verbose}`, token)).json(),
        new: async (ownerUrl, body, token) => (await post(`${ownerUrl}collections/`, body, token)).json(),
    },
};

export default api;
