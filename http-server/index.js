// const fs = require("fs");
// const http = require("http");

//This code works only for one page
// fs.readFile(
//     "home.html",
//     (err, home) => {
//         if (err) {
//             throw err;
//         }
//         http
//             .createServer((Request, Response) => {
//                 Response.writeHeader(200, { "Content-Type": "Text/html" });
//                 Response.write(home);
//                 Response.end();
//             })
//             .listen(3000);
//     }
// );


//To make link works wee will need this code

const fs = require("fs");
const http = require("http");

let homepage;
let registrationform;
let projectpage;
//to read home.html
fs.readFile(
    "home.html",
    (err, home) => {
        if (err) { throw err; }
        homepage = home;
    }
)

//to read project.html
fs.readFile(
    "project.html",
    (err, project) => {
        if (err) { throw err; }
        projectpage = project;
    }
)

//to read registrationform.html
fs.readFile(
    "registration.html",
    (err, registration) => {
        if (err) { throw err; }
        registrationform = registration;
    })

const args = require("minimist")(process.argv.slice(2));
const portinput = args.port;

//To check If Number is Provided or not
if (portinput === undefined) {
    console.log("Enter A Valid Port Number");
} else {
    const port = parseInt(portinput, 10);


    http
        .createServer((request, response) => {
            const url = request.url;
            response.writeHeader(200, { "Content-Type": "Text/html" });

            switch (url) {
                case "/project.html":
                    response.write(projectpage);
                    response.end();
                    break;
                case "/registration.html":
                    response.write(registrationform);
                    response.end();
                    break;
                default:
                    response.write(homepage);
                    response.end();
                    break
            }
        })
        .listen(port, () => { console.log(`Server is listening on port ${port}`); });

}
