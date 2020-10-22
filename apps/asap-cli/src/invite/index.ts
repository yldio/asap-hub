/* eslint-disable no-console */
import Intercept from 'apr-intercept';
import { Squidex } from '@asap-hub/services-common';
import { RateLimit } from 'async-sema';
import { v4 as uuidV4 } from 'uuid';

interface HTTPError extends Error {
    response?: {
        statusCode: number;
        body: string;
    };
}

const users: Squidex<{
    id: string,
    data: {
        email: { iv: string };
        role: { iv: string };
        connections: { iv: { code: string }[] };
    }
}> = new Squidex('users');

const limiter = RateLimit(10);
export const inviteUsers = async (role: string): Promise<void> => {
    const take = 20;
    const { items } = await users.fetch({
        skip: 0,
        take,
        filter: {
            path: "data.role.iv",
            op: "eq",
            value: role
        },
        sort: [{ path: 'data.connections.iv', order: 'ascending' }],
    });

    const usersWithoutConnections = items.filter(u => !u.data.connections || !u.data.connections.iv.length);
    await Promise.all(usersWithoutConnections.map(async u => {
        await limiter();

        console.log(`invite user ${u.data.email}`);
        const newUser = {
            email: u.data.email,
            connections: {
                iv: [{ code: `asap|${uuidV4()}` }]
            }
        };

        const [e1] = await Intercept(users.patch(u.id, newUser));
        const err1 = e1 as HTTPError
        if (err1) {
            console.error({
                op: `patch '${u.id}'`,
                message: err1.message,
                statusCode: err1.response?.statusCode,
                body: err1.response?.body,
            });
        }

        console.log("send email")
    }))

    if (usersWithoutConnections.length < take) {
        return inviteUsers(role);
    }
};