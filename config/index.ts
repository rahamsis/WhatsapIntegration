import { DatabaseType } from "typeorm";

const defaultOptions = {
    type: 'postgres' as DatabaseType,
    port: 5432,//5443
    logging: false,
    synchronize: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
};

const development = {
    customer: {
        ...defaultOptions,
        name: 'customer',
        port: 5488,//5443
        host: 'localhost',
        username: 'postgres',
        password: 'u_copernico_rootDev01*.,',
        database: 'customer_order'
    },
    picking: {
        ...defaultOptions,
        name: 'picking',
        host: 'localhost',
        port: 5433,//5443
        username: 'postgres',
        password: 'u_copernico_rootDev01*.,',
        database: 'picking'
    }
};

const dev = {
    customer: {
        ...defaultOptions,
        name: 'customer',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_CUSTOMER_USERNAME,
        password: process.env.DATABASE_CUSTOMER_PASSWORD,
        database: 'customer_order',
    },
    picking: {
        ...defaultOptions,
        name: 'picking',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_PICKING_USERNAME,
        password: process.env.DATABASE_PICKING_PASSWORD,
        database: 'picking',
    }
};

const qa = {
    customer: {
        ...defaultOptions,
        name: 'customer',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_CUSTOMER_USERNAME,
        password: process.env.DATABASE_CUSTOMER_PASSWORD,
        database: 'customer_order',
    },
    picking: {
        ...defaultOptions,
        name: 'picking',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_PICKING_USERNAME,
        password: process.env.DATABASE_PICKING_PASSWORD,
        database: 'picking',
    }
};

const stg = {
    customer: {
        ...defaultOptions,
        name: 'customer',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_CUSTOMER_USERNAME,
        password: process.env.DATABASE_CUSTOMER_PASSWORD,
        database: 'customer_order',
    },
    picking: {
        ...defaultOptions,
        name: 'picking',
        host: process.env.DATABASE_PICKING_URI,
        username: process.env.DATABASE_PICKING_USERNAME,
        password: process.env.DATABASE_PICKING_PASSWORD,
        database: 'picking',
    }
};

const prod = {
    customer: {
        ...defaultOptions,
        name: 'customer',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_CUSTOMER_USERNAME,
        password: process.env.DATABASE_CUSTOMER_PASSWORD,
        database: 'customer_order',
    },
    picking: {
        ...defaultOptions,
        name: 'picking',
        host: process.env.DATABASE_PICKING_URI,
        username: process.env.DATABASE_PICKING_USERNAME,
        password: process.env.DATABASE_PICKING_PASSWORD,
        database: 'picking',
    }
};

const database = {
    development,
    dev,
    qa,
    stg,  
    prod
};

const environment = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'development';

const listenPort  = process.env.APPLICATION_PORT? parseInt(process.env.APPLICATION_PORT) : 8000;

const applicationSettings = {
    listenPort,
    environment
}

const rabbitUSER = process.env.RABBIT_USERNAME || 'rabbit'
const rabbitPWD = process.env.RABBIT_PASSWORD  || 'Dariusteemo.10'

const rabbitHosts = process.env.AMQP_URI || 'localhost'

const rabbitmq = {
    protocol: 'amqp',
    hostname: rabbitHosts,
    port: 5672,
    username: rabbitUSER,
    password: rabbitPWD,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/dad_inretail',
};

export { database, rabbitmq, applicationSettings};