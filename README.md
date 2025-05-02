# VV News 

Link: https://seeding-vv-news.onrender.com

This project provides a API to manage and access "Articles". User can add comments to an article and vote. 

Follow the steps below to test the project by creating your own version! 

A. Clone the project to you local environment

1. Get the repository link 

    •	Visit the GitHub repository: https://github.com/VivianeLVieira/Seeding-VV-News

    •	Click in the green "code" button-> select "Local" tab and copy/save the HTTPS link (repository-url)

2. Clone the project using Terminal

    •	Open your Terminal (you can also use the VS CODE integrated terminal)

    •	Create a folder for the project  

        command: mkdir folder_project_name

    •	Enter the folder 

        command: cd folder_project_name
 
    •	Clone the repository into this folder, replacing repository-url with th link you copied in the "step 2"

        command: git clone repository-url

B. Install Depedences -> use the follow commands to install necessary dependences 

3. Install all dependences from package.json 

        comand: npm install

Or, follow steps 4 - 12 to install them manually.

4. Add dotenv to manager the enviroment variables (development and test)

        comands: npm install dotenv

5. Add pg, pg is a non-blocking PostgreSQL client for Node.js

        command: npm install pg

6. Add pg-format, it is a library that formmats SQL queries

        command: npm install pg-format 

7. Add SuperTest, it is a Node.js testing library for HTTP APIs

        command: npm install --save-dev supertest

8. Add Jest, testing framework to run the test suite

        command: npm install --save-dev jest

9. Add jest-sorted, it is a custom Jest matcher to assert if a array is sorted

        command: npm install --save-dev jest-sorted

10. Add jest-extended, it adds additional matches for Jest

        command: npm install --save-dev jest-extended

11. Add husky, that will trigger actions like running tests before the code is commited

        command: npm install --save-dev husky

12. EXTRA - Add Stryker Mutator, it is a tool that measute the effectiveness of the tests

        command: npm install --save-dev @stryker-mutator/core

To run Stryker -> command: npx stryker init

C. Enviroment configuration

13. Create an .env files, use the provided .env.example file as reference  

    •	 Name the first file to ".env.development". 
    
    It must point to the database that will be used in the development environment

        Add content: PGDATABASE=your_developmente_database_name 

    •	Name the second file to ".env.test". 
    
    It must point to the database that will be used in the testing environment (note that the database's name must contain "_test" at the end)

        Add content: PGDATABASE=your_test_database_name


D. Verify setup and run tests

14. Run the following scripts and check the console logs ->

        command: npm runsetup-dbs

This runs the script to create the database.

        command: npm run seed-dev

This runs the run-seed script, which calls your seed function with development data.

        command: npm run test-seed

This runs tests for your seed function, which calls your seed function with test data

    command: npm test OR npm run test OR npm t 

Those commands run all tests from the project

E. Requiriments

To run this project, you must have the following software versions or later installed:

Node.js = v22.14.0

Postgres = 2.8.1 
