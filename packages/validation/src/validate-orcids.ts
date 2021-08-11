// This is a one-off script. It was run on prod on <date> and the results (invalid ORCIDs) were passed on to product
import Users from '../../../apps/asap-server/src/controllers/users';

export const VALID_ORCID = /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/;

const validateOrcids = async (): Promise<void> => {
    const users = new Users();
    console.log("---------------------------------------");
    console.log(users);

    // const maxNumberOfUsers = 999999;
    // const maxNumberOfUsers = 5;
    // const allUsers = (await users.fetch({take: maxNumberOfUsers})).items;

    // for (const user of allUsers) {
    //     console.log(user.id, user.orcid); // delete
    //     if (user.orcid && user.orcid?.match(VALID_ORCID) === null) {
    //         console.log(`Invalid orcid on user ${user.id}: ${user.orcid}`)
    //     }
    // }
};

validateOrcids();