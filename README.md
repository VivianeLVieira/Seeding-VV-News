# NC News Seeding

Duplicate .env.example file to create an .env for testing and development enviroments:


1 - Rename the first file to ".env.development". It must point to the database that will be used in the development environment.
1.1 Add content: PGDATABASE=database_name 

2 - Rename the second file to ".env.test". It must point to the database  that will be used in the testing environment (note that the database must contain "_test" at the end).
2.1 Add content: PGDATABASE=database_name_test 

