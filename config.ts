export const config = {
    endPoints: {
        userService: {
            hostname: process.env.USERS_API_HOST || 'http://localhost',
            port: process.env.APPLICATION_PORT || 5006,
            api: process.env.USERS_API || '/api/users',
            rpcPort: +(process.env.APPLICATION_RPC_PORT || 7004),
            rpcHostname: process.env.USERS_API_RPC_HOST || 'localhost',
        },
    },
};
