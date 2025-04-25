<h1 align="center">🗓️ Events Platform</h1>
<p align="center">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff">
<img src="https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Prisma-0052CC?logo=prisma&logoColor=fff">
<img src="https://img.shields.io/badge/Docker-2088FF?logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/Netlify-97F2F0?logo=netlify&logoColor=white">
<img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white">
</p>

---

## ❓ What is this?

This is a freelance launchpad project commissioned by Northcoders. The idea is to create a platform for a community to create and view events in their local community.

## 🌍 Where can I see it?

You can see a live version of this website [here](https://events-platform-jeepies.netlify.app), hosted with Netlify and Supabase

## 🧪 I'm here to test

Okay! There are two ways you can login

1. I have placed two buttons on the login page that will automatically log you in to a test account. There is a staff and a normal account
2. You can manually log in with these details:
   1. Staff
      ```
      admin@events-platform.com
      eventsPlatformStaff!123
      ```
   2. User
      ```
      test@events-platform.com
      eventsPlatformTester!123
      ```

## 🖥️ I want a local copy

You can get a local copy up and running in just a few minutes!

### Minimum Requirements

Node: `22.0.0`
<br>
Docker: `27.4.1`
<br>
Bun: `1.1.42`

### Guide

1. Clone the project with `git clone https://github.com/jeepies/events-platform.git`
2. Move into the directory using `cd events-platform`
3. Install dependencies by running `bun i`
4. Create an `.env` file - You can copy-paste the `example.env`!
5. Setup the Docker containers with `bun docker:dev:up`
6. Set up the database with `bun db:setup`
7. Run the development server with `bun dev`

---

<p align="center">Made with <img height="14" src="https://emoji.lgbt/assets/svg/gay-heart.svg"/> by jeepies</p>
