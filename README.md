# AI Meeting Notes Summarizer

An AI-powered full-stack web app that:

📄 Takes meeting transcripts (upload `.txt` file or paste text)  
🤖 Generates a structured summary using **Groq Llama-3.1 models**  
📧 Shares the summary via email using **Resend API**  
🌐 **Live Demo:** [AI Summarized Meeting Notes](https://ai-summarized-meeting-notes.onrender.com)

---

## 🚀 Features
- Upload or paste meeting transcript  
- Custom summarization prompt  
- Crisp, structured AI summary (Executive Summary, Key Decisions, Action Items, Next Steps)  
- Edit summary before sending  
- Send via email to one or more recipients  

---

## ⚙ Tech Stack
- **Backend**: Node.js, Express, dotenv  
- **AI**: Groq SDK (`llama-3.1-8b-instant`)  
- **Email**: Resend API  
- **Frontend**: Vanilla HTML/CSS/JS (polished UI)  

---

## ⚡ Environment Variables
Create a `.env` file in the project root with the following keys (**do not commit actual keys**):

| Variable Name    | Description                               |
|-----------------|-------------------------------------------|
| `GROQ_API_KEY`   | API key for Groq Llama model               |
| `RESEND_API_KEY` | API key for Resend email service           |
| `FROM_EMAIL`     | Email address used to send summaries       |

Example `.env` file:

