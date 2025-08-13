# ProCollab

A **Task Manager Web App** built with **Node.js**, **Express**, and **MySQL**, following the **MVC (Model-View-Controller)** architecture.  
This project is developed as part of the **CSE327** course.

---

## 📌 Features
- **User Authentication** – Signup, login, and session-based authentication.
- **Task Management** – Create, view, update, and delete tasks.
- **Project Management** – Organize tasks under projects.
- **Email Notifications** – Using Nodemailer for verification and alerts.
- **Password Security** – Encrypted storage using bcrypt.
- **Responsive UI** – Built with EJS templates and Bootstrap.
- **MVC Structure** – Clean separation of concerns.

---

## 📂 Project Structure
```text
CSE327_NSU/
│
├── app.js                 # Entry point
├── configs/               # Database and config files
├── controllers/           # Controller logic
├── models/                # Database models
├── routes/                # Express route definitions
├── views/                 # EJS templates for UI
├── tests/                 # Jest test files
├── docs/                  # Auto-generated documentation
├── jsdoc.json             # JSDoc configuration
└── package.json           # Project dependencies and scripts
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
Make sure you have installed:
- **Node.js** (v18 or later recommended)
- **MySQL** (running locally or on a server)
- **npm** (comes with Node.js)

---

### 2️⃣ Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/omarsadat123/CSE327_NSU.git
cd CSE327_NSU
npm install

npm install express
npm install mysql2
npm install ejs
npm install dotenv
npm install body-parser
npm install express-session
npm install bcryptjs
npm install nodemailer

npm install --save-dev jest
npm install --save-dev supertest
npm install --save-dev jsdoc
npm install --save-dev better-docs
```
## 🚀 Scripts

### Start the Server
Run the app locally:
```bash
npm start
```
### Documentation
Run the documentation locally:
```bash
npm run docs
```
### Testing
Run the testing locally:
```bash
npm test
```

## 👤 Contributors

- **Omar Sadat** – ([GitHub](https://github.com/omarsadat123))  
- **Md. Alif Bin Turjo** – ([GitHub](https://github.com/alifbinturjo))
- **Quazi Sakib Ahmed** – ([GitHub](https://github.com/QSakib))
- **Mahfuzur Rahman** – ([GitHub](https://github.com/mahfuzur594))
- **Hossain Ahammed** – ([GitHub](https://github.com/hossain56))

## User Interface
Login 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20230507.png)
Signup 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20230526.png)
Change password 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20231143.png)
OTP submission
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20231926.png)
Dashboard 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20230833.png)
Task 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20230755.png)
Create project 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20230908.png)
Invite collaborator 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20231639.png)
View invitation 
![](https://github.com/omarsadat123/CSE327_NSU/blob/main/resources/UI%20Screenshot/Screenshot%202025-08-13%20231723.png)
