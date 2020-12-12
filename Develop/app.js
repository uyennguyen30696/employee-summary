const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

const init = async () => {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Hello! What\'s your name?'
        }
    ]).then(resp => {
        console.log("Hello " + `${resp.name}` + "!");
        console.log("Ready to create your team's profile? Let's get started!");
    });

    await promptAddEmployee();

    await promptAddNewEmployee();
};

init();

const promptAddEmployee = async () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Employee\'s name: '
        },
        {
            type: 'input',
            name: 'id',
            message: 'Employee\'s id: '
        },
        {
            type: 'input',
            name: 'email',
            message: 'Employee\'s email: '
        },
        {
            type: 'list',
            name: 'role',
            message: 'Employee\'s role: ',
            choices: [
                'Manager',
                'Engineer',
                'Intern'
            ]
        }
    ]).then(async roleResp => {

        if (roleResp.role === "Manager") {
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'officeNumber',
                    message: 'Manager\'s office number: '
                }
            ]).then(resp => {
                const manager = new Manager(
                    roleResp.name,
                    roleResp.id,
                    roleResp.email,
                    resp.officeNumber
                );
                employees.push(manager);
            });
        }
        else if (roleResp.role === "Engineer") {
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'github',
                    message: 'Engineer\'s GitHub username: '
                }
            ]).then(resp => {
                const engineer = new Engineer(
                    roleResp.name,
                    roleResp.id,
                    roleResp.email,
                    resp.github
                );
                employees.push(engineer);
            });
        }
        else if (roleResp.role === "Intern") {
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'school',
                    message: 'What school is the intern attending?'
                }
            ]).then(resp => {
                const intern = new Intern(
                    roleResp.name,
                    roleResp.id,
                    roleResp.email,
                    resp.school
                );
                employees.push(intern);
            });
        };
    });
};

const promptAddNewEmployee = async () => {

    return inquirer.prompt([
        {
            type: 'list',
            name: 'addEmployee',
            message: 'Is there another team member that you want to add?',
            choices: [
                'Yes',
                'No'
            ]
        }
    ]).then(async resp => {
        if (resp.addEmployee === 'Yes') {
            await promptAddEmployee();
            await promptAddNewEmployee();
        }
        else if (resp.addEmployee === 'No') {
            console.log("Generating your team's profile...");
            await genTeam();
        };
    });
};

const genTeam = async () => {
    fs.writeFile(outputPath, render(employees),
        (err) => err ? console.log(err) : console.log('Success!'))
};
