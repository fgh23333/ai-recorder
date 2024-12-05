# AI Recorder

This project is an AI-powered voice recorder that transcribes speech in real-time using client-side and cloud-side AI.

<img width="625" alt="Screenshot 2024-12-05 at 18 46 02" src="https://github.com/user-attachments/assets/56404254-efbf-41e4-b4c9-65480e564d57">

## Features

- Real-time voice activity detection (VAD) using ONNX Web Runtime
- Speech transcription using Whisper via ONNX Web Runtime or Lepton serverless API
- Responsive UI with recording and processing indicators

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/vthinkxie/ai-recorder.git
    cd ai-recorder
    ```

2. Install dependencies:

    ```sh
    npm install
    ```
       
3. Setup workspace token

    Go to [Lepton dashboard](https://dashboard.lepton.ai/workspace-redirect/settings/api-tokens) to get your workspace token. Create a `.env` file in the root directory of the project and add the following:
    ```sh
    LEPTON_TOKEN=your_workspace_token
    ```
   Note: the price whisper provided by lepton ai can be found [here](https://www.lepton.ai/pricing#:~:text=/%20million%20tokens-,Whisper,-%240.00007%20/)

4. Start the development server:

    ```sh
    npm start
    ```

    This will start the development server and you can access the application at http://localhost:3000, the local whisper can be accessed via http://localhost:3000/local


## References
### Voice Activity Detection
The application uses voice activity detection (VAD) via ONNX Web Runtime to determine when the user is speaking. This is indicated by the red "Recording" text and icon.  

Get more detail at https://github.com/snakers4/silero-vad and https://github.com/DictationDaddy/VAD_WEB_DEMO

### Whisper tiny
The application integrates with openai/whisper-tiny.en for speech transcription via ONNX Web Runtime. When the user speaks, the transcribed text will appear in the designated area. 

## License

This project is licensed under the MIT License.
