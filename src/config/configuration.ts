export default () => ({
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    entities: [`../../dist/**/*.entity.{js,ts}`],
    synchronize: true,
  },
});
