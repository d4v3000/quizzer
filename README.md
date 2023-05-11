# Quizzer

Quizzer is a web app created using the [t3-stack](https://create.t3.gg/) where people can create quizzes with different question categories and let their friends test their knowledge.

You can try a live demo [here](https://quizzer-eight.vercel.app/).

## Technologies used

- [tailwind css](https://tailwindcss.com/)
- [nextjs](https://nextjs.org/)
- [nextauth](https://next-auth.js.org/)
- [trpc](https://trpc.io/)
- [prisma](https://www.prisma.io/)
- [dnd-kit](https://dndkit.com/)
- [radix ui](https://www.radix-ui.com/)
- [zustand](https://github.com/pmndrs/zustand)
- mysql
- [uploadthing](https://uploadthing.com/)
- [socket.io](https://socket.io/)
- [react-hook-form](https://react-hook-form.com/)
- [react-simple-maps](https://www.react-simple-maps.io/)

The site is hosted using [Vercel](https://vercel.com/) and uses [Planetscale](https://planetscale.com/) as the database provider. You can find the code for the nodejs server [here](https://github.com/d4v3000/quizzer-server)

## Features

- Authentication using google
- Create/edit/delete quizzes with 3 different question types and image upload
  - Multiple choice questions
  - Location questions with multiple map options
  - Guessing questions
- View all your quizzes with different sorting options
- Completely responsive
- Host lobbies using socket.io
  - Choose between 2 and 5 teams
  - Quiz master can kick players and randomize teams
  - Global chat and seperated team chats  

## Coming soon

- Tooltips
- Hotkey support
- More question types (audio, video, sorting, etc)
- Add music

## Screenshots

![homepage](https://github.com/d4v3000/quizzer/assets/24357816/9f29c092-09fd-4589-88d5-a0a5fdf56050)

![overview](https://github.com/d4v3000/quizzer/assets/24357816/2c6bef62-47e5-4cbc-a29a-32f8f92e22ef)

![editor](https://github.com/d4v3000/quizzer/assets/24357816/431a8f6e-d801-4d7e-98d6-344b93ecb568)

![mobile_editor](https://github.com/d4v3000/quizzer/assets/24357816/6b73d723-af9b-4484-9ea9-198d7d2d3914)

![lobby](https://github.com/d4v3000/quizzer/assets/24357816/5a412f25-b125-4f94-8951-fd9c730d728a)
