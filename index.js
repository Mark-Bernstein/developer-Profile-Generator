const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            message: "Enter your GitHub Username",
            name: "githubName",
            type: "input"
        },
        {
            message: "Choose a color (green, blue, pink, or red):",
            name: "favColor",
            type: "list",
            choices: [
                "blue",
                "red",
                "green",
                "pink"
            ]
        }
    ])
        .then(function ({ githubName, favColor }) {
            const queryUrl = `https://api.github.com/users/${githubName}`;

            axios.get(queryUrl).then(function (response) {

                const name = response.data.login;
                const avatar = response.data.avatar_url;
                const githubLink = response.data.html_url;
                const bio = response.data.bio;
                const repositories = response.data.public_repos;
                const followers = response.data.followers;
                const following = response.data.following;
                const location = response.data.location;
                const blog = response.data.blog;

                function generateHTML(githubName) {
                    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<title>Document</title>
</head>
<body>
<div class="jumbotron jumbotron-fluid">
<div style="background-color:${favColor}" class="container">
<img src="${avatar}" class="rounded mx-auto d-block" style="width:275px;height:275px;" alt="profile picture">
    <h1 class="display-4">Hi! My name is ${name}!</h1>
    <p class="lead">I am currently living in ${location}.</p>
    <hr>
    <h3> <a href="${githubLink}" class="badge badge-primary">Github</a> </h6>
    <h3> <a href="${blog}" class="badge badge-primary">Blog</a> </h6>
    <hr>
    <ul class="list-group">
     <li class="list-group-item">${bio}</li>
     <li class="list-group-item">Repositories: ${repositories}</li> 
     <li class="list-group-item">Followers: ${followers}</li>
     <li class="list-group-item">Following: ${following}</li>
    </ul>
    </div>
</div>
</body>
</html>`;
                }
                const html = generateHTML(githubName);
                writeFileAsync("index.html", html);
            }
            )
        }
        )
};


async function init() {
    console.log("hi")
    try {
        const githubName = await promptUser();

        console.log("Successfully wrote to index.html");
    } catch (err) {
        console.log(err);
    }
}

init();
