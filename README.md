# developer-bank
A web app, where registered and signed-in developers can upload their project portfolio. Projects can be added, edited and deleted. Also profile information can be edited. Non-signed-in users can browse developer profiles. In addition to log in, also new users can be created.

This is a final project for Software Programming 2 class. The project combines API with client, and uses React, TypeScript, API and sqlite with Prisma. Project will be developed further.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Step 1: Installation

Install both root and client dependencies with npm install. Make sure that you have Prisma-compatible Node version (at this point Prisma 5.7 requires Node 16.13). The project already contains Prisma and database to ease you into checking out the functionalities of the app.

### Step 2: Set up .env

Set up a .env-file containing port and access token key. You can use CreateSecrects.js-file to create a access token key.

### Step 3: Generate Prisma client

Generate prisma client with 'npx prisma generate'.

### Step 4: Start exploring

Start both your server with 'npm start' in your root and client with 'npm start' in your client. 

