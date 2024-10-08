Here's a better-organized setup guide using Markdown:

## Setup Instructions

Follow these steps to set up your Electron project:
- Download npm and node.js first.
- If you only want to be able to run it and not build it you can skip step 1-3. [Download](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

1. **Initialize the Project** *(optional)*:
   - Create a `package.json` file.
   ```bash
   npm init -y
   ```
   - *Note*: This step is not necessary if you already have a `package.json` file.

2. **Install Electron**:
   - Install Electron as a development dependency.
   ```bash
   npm install -D electron
   ```
   - This installs the necessary Node modules for Electron.

3. **Install Dependencies**:
   - Download all dependencies listed in your `package.json` file.
   ```bash
   npm install
   ```

4. **Start the Project Locally**:
   - Run the application in a local development environment.
   ```bash
   npm start
   ```

5. **Build the Application**:
   - Compile the application for distribution.
   ```bash
   npm run build
   ```
