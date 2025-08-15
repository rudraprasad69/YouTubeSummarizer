# AI-Powered YouTube Video Summarizer

<img width="960" height="418" alt="{D9312558-2729-4496-AA84-B44763220513}" src="https://github.com/user-attachments/assets/a956c426-60af-42da-a0bb-5991d16ac45b" />


<p align="center">
  <img src="https://img.shields.io/github/license/rudraprasad69/YouTubeSummarizer" alt="License">
  <img src="https://img.shields.io/github/stars/rudraprasad69/YouTubeSummarizer" alt="Stars">
  <img src="https://img.shields.io/github/forks/rudraprasad69/YouTubeSummarizer" alt="Forks">
  <img src="https://img.shields.io/github/issues/rudraprasad69/YouTubeSummarizer" alt="Issues">
</p>

> An intelligent web application that uses AI to summarize lengthy YouTube videos into concise, easy-to-read text. Simply paste a YouTube video URL to get its summary in seconds.

This project leverages a powerful AI API for natural language processing to extract the key points from video transcripts. The frontend is built with React.js for a fast and responsive user experience.

## 🚀 Live Demo

Try the live application here:
**[https://your-live-demo-url.com](https://your-live-demo-url.com)**

## ✨ Features

-   **Instant Summaries:** Get the gist of any YouTube video without watching the whole thing.
-   **Simple Interface:** A clean and minimalist UI. Just paste the URL and click summarize.
-   **Responsive Design:** Works seamlessly on both desktop and mobile devices.
-   **AI-Powered:** Utilizes a state-of-the-art AI model for high-quality text summarization.

## 📸 Screenshots

| Home Page                                      | Summary Result                                  |
| ---------------------------------------------- | ----------------------------------------------- |
| ![Home Page](path/to/homepage_screenshot.png) | ![Summary Result](path/to/summary_screenshot.png) |

*(Action: Add screenshots of your application's interface and a sample result.)*

## 🛠️ Technologies Used

<p align="left">
  <strong>Frontend:</strong>
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
  <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a>
</p>
<p align="left">
  <strong>Backend & AI:</strong>
  <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a>
  <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a>
  </p>


## ⚙️ Installation & Setup

To get a local copy up and running, follow these steps.

### Prerequisites

You must have [Node.js](https://nodejs.org/en/) (which includes npm) installed.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/rudraprasad69/YouTubeSummarizer.git](https://github.com/rudraprasad69/YouTubeSummarizer.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd YouTubeSummarizer
    ```

3.  **Install dependencies:**
    This will install dependencies for both the server and the client.
    ```bash
    npm install
    ```
    *(Note: If your frontend and backend have separate `package.json` files, you'll need to run `npm install` in each respective directory.)*

4.  **Set up environment variables:**
    Create a file named `.env` in your backend directory and add your API keys:
    ```
    YOUTUBE_API_KEY=your_youtube_api_key
    AI_SUMMARY_API_KEY=your_ai_provider_api_key
    ```

5.  **Start the application:**
    ```bash
    npm start
    ```
    This should run both your React development server and your Node.js backend concurrently.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

*(Action: Create a file named `LICENSE` and add the MIT License text.)*
