export default function setup() {
  const environment = process.env.NODE_ENV;
  const dbName = process.env.DB_NAME;

  if (environment !== "test" || !dbName?.includes("test")) {
    console.log(environment, dbName);
    console.log("Nao vai rodar os testes");
    process.exit(1);
  }
}
