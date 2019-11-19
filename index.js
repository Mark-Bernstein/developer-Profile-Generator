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

            // const queryUrl = `https://api.github.com/users/${githubName}/repos?per_page=100`;

            axios.get(queryUrl).then(function (response) {

                console.log(response);
                console.log(response.data.avatar_url);
                console.log(response.data.html_url);
                console.log(response.data.bio);
                console.log(response.data.public_repos);
                console.log(response.data.followers);
                console.log(response.data.following);
                console.log(response.data.location);
                console.log(response.data.login);

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
<img src="${avatar}" class="rounded mx-auto d-block" alt="...">
    <h1 class="display-4">Hi! My name is ${name}!</h1>
    <p class="lead">I am from ${location}.</p>
    <hr>
    <h3> <a href="${githubLink}" class="badge badge-primary">Github</a> </h6>
    <h3> <a href="${blog}" class="badge badge-primary">Blog</a> </h6>
    <hr>
    <ul class="list-group">
     <li class="list-group-item">Bio: ${bio}</li>
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

// const colors = {
//     green: {
//         wrapperBackground: "#E6E1C3",
//         headerBackground: "#C1C72C",
//         headerColor: "black",
//         photoBorderColor: "#black"
//     },
//     blue: {
//         wrapperBackground: "#5F64D3",
//         headerBackground: "#26175A",
//         headerColor: "white",
//         photoBorderColor: "#73448C"
//     },
//     pink: {
//         wrapperBackground: "#879CDF",
//         headerBackground: "#FF8374",
//         headerColor: "white",
//         photoBorderColor: "#FEE24C"
//     },
//     red: {
//         wrapperBackground: "#DE9967",
//         headerBackground: "#870603",
//         headerColor: "white",
//         photoBorderColor: "white"
//     }
// };

// function generateHTML(answers) {
//     return `
//         <!DOCTYPE html>
//       <html lang="en">
//          <head>
//             <meta charset="UTF-8" />
//             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//             <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//             <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
//             <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
//             <title>Document</title>
//             <style>
//                 @page {
//                   margin: 0;
//                 }
//                *,
//                *::after,
//                *::before {
//                box-sizing: border-box;
//                }
//                html, body {
//                padding: 0;
//                margin: 0;
//                }
//                html, body, .wrapper {
//                height: 100%;
//                }
//                .wrapper {
//                background-color: ${colors[answers.color].wrapperBackground};
//                padding-top: 100px;
//                }
//                body {
//                background-color: white;
//                -webkit-print-color-adjust: exact !important;
//                font-family: 'Cabin', sans-serif;
//                }
//                main {
//                background-color: #E9EDEE;
//                height: auto;
//                padding-top: 30px;
//                }
//                h1, h2, h3, h4, h5, h6 {
//                font-family: 'BioRhyme', serif;
//                margin: 0;
//                }
//                h1 {
//                font-size: 3em;
//                }
//                h2 {
//                font-size: 2.5em;
//                }
//                h3 {
//                font-size: 2em;
//                }
//                h4 {
//                font-size: 1.5em;
//                }
//                h5 {
//                font-size: 1.3em;
//                }
//                h6 {
//                font-size: 1.2em;
//                }
//                .photo-header {
//                position: relative;
//                margin: 0 auto;
//                margin-bottom: -50px;
//                display: flex;
//                justify-content: center;
//                flex-wrap: wrap;
//                background-color: ${colors[answers.color].headerBackground};
//                color: ${colors[answers.color].headerColor};
//                padding: 10px;
//                width: 95%;
//                border-radius: 6px;
//                }
//                .photo-header img {
//                width: 250px;
//                height: 250px;
//                border-radius: 50%;
//                object-fit: cover;
//                margin-top: -75px;
//                border: 6px solid ${colors[answers.color].photoBorderColor};
//                box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
//                }
//                .photo-header h1, .photo-header h2 {
//                width: 100%;
//                text-align: center;
//                }
//                .photo-header h1 {
//                margin-top: 10px;
//                }
//                .links-nav {
//                width: 100%;
//                text-align: center;
//                padding: 20px 0;
//                font-size: 1.1em;
//                }
//                .nav-link {
//                display: inline-block;
//                margin: 5px 10px;
//                }
//                .workExp-date {
//                font-style: italic;
//                font-size: .7em;
//                text-align: right;
//                margin-top: 10px;
//                }
//                .container {
//                padding: 50px;
//                padding-left: 100px;
//                padding-right: 100px;
//                }

//                .row {
//                  display: flex;
//                  flex-wrap: wrap;
//                  justify-content: space-between;
//                  margin-top: 20px;
//                  margin-bottom: 20px;
//                }

//                .card {
//                  padding: 20px;
//                  border-radius: 6px;
//                  background-color: ${colors[answers.color].headerBackground};
//                  color: ${colors[answers.color].headerColor};
//                  margin: 20px;
//                }

//                .col {
//                flex: 1;
//                text-align: center;
//                }

//                a, a:hover {
//                text-decoration: none;
//                color: inherit;
//                font-weight: bold;
//                }

//                @media print { 
//                 body { 
//                   zoom: .75; 
//                 } 
//                }
//             </style>`
// }



// var fonts = {
//     Roboto: {
//         normal: 'fonts/Roboto-Regular.ttf',
//         bold: 'fonts/Roboto-Medium.ttf',
//         italics: 'fonts/Roboto-Italic.ttf',
//         bolditalics: 'fonts/Roboto-MediumItalic.ttf'
//     }
// };

// var PdfPrinter = require('pdfmake');
// var printer = new PdfPrinter(fonts);


// var docDefinition = {
//     content: [
//         {
//             text: [
//                 'Link to ',
//                 { text: 'pdfmake website', link: 'http://pdfmake.org', decoration: 'underline' },
//                 ' and ',
//                 { text: 'documentation', link: 'https://pdfmake.github.io/docs/', decoration: 'underline' },
//                 '.'
//             ]
//         },
//         { text: 'Go to page 2', linkToPage: 2, decoration: 'underline' },
//         { text: 'Link to header 2', linkToDestination: 'header2', decoration: 'underline' },
//         'Links are also supported with images:',
//         { image: 'fonts/sampleImage.jpg', width: 150, link: 'http://pdfmake.org' },
//         { text: 'Header on page 2', fontSize: 18, bold: true, pageBreak: 'before' },
//         { text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sollicitudin. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Suspendisse nisl. Mauris elementum mauris vitae tortor. Phasellus et lorem id felis nonummy placerat. Aliquam erat volutpat. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Etiam bibendum elit eget erat. Nullam rhoncus aliquam metus. Proin mattis lacinia justo. Nullam sit amet magna in magna gravida vehicula. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Integer lacinia. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor.' },
//         '\n\n',
//         { text: 'Header 2', id: 'header2', fontSize: 18, bold: true },
//         { text: 'Go to page 1', linkToPage: 1, decoration: 'underline' },
//     ]
// };


// var pdfDoc = printer.createPdfKitDocument(docDefinition);
// pdfDoc.pipe(fs.createWriteStream('./document.pdf'));
// pdfDoc.end();