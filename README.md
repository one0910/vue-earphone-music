# Intruction

This is an experimental music platform that combines music streaming and crowdfunding. Users can listen to music online and support independent musicians. This website is for non-commercial purposes only, and all features and content are for developers to learn and practice. The music, images, and other content on this website are for technical testing purposes only and should not be reproduced or shared.

## Demo Site

> https://one0910.github.io/vue-earphone-music/#/

#### Online Music:

![圖片](https://github.com/user-attachments/assets/48ae4649-674b-4b80-8221-b7c66b42f3ff)

#### Make Your Album

![圖片](https://github.com/user-attachments/assets/5cbba2ba-3962-4b4d-8794-6d1a787c746f)

## Website Features

1. Online music streaming
2. Create your own music album
3. Music playlist
4. Member management
5. Multi-language support

### Technologies Used (Frontend)

- Frontend - Vite + Vue3.0(Option API) + pinia + tailwindcss + vee-validate + Internationalization + PWA
- Backend - Firebase Authentication + Firestore Database
- Proformance : PWA(Progressive Web Application)

## Directory Structure

- `public`: Houses static assets like images (icons, logos) that are directly served to the client.
- `plguins`: Customizes Tailwind CSS for project-specific styles.
- `src`: Contains the main source code for the application.
  - `assets`: Stores various assets including Font Awesome icons, images, and SCSS stylesheets.
  - `components`: Encapsulates reusable UI components such as headers, alerts, and more.
  - `helper`: Provides utility functions for language translation and other common tasks.
  - `includes`: Contains initialization scripts and configuration files for setting up the project, including Firebase integration, form validation, and multilingual support.
  - `locales`: Stores localization files in JSON format for different languages (e.g., en.json).
  - `router`: Defines the application's routing configuration.
  - `stores`: Manages application state using Pinia
  - `views`: Manages application state using Pinia.
- `App.vue`: The root component of the Vue application.
- `main.js`: The starting point for the application's JavaScript execution.
- `.vite.config`: Configures the Vite build tool for development and production.
- `.eslintrc`: Enforces code style and quality with ESLint.
- `.tailwind.config`: Customizes Tailwind CSS for the project.
- `.package-lock.json`: Locks down the exact versions of installed dependencies.
- `.package.json`: Defines project metadata, dependencies, and scripts

## Project Setup

- Enter node -v in the terminal to ensure the Node version is v14.x or above.
- Enter npm install in the terminal to install the dependencies.
