# Ruby Track Hackathon for Headstarter AI

## Introduction
This project is built for the Ruby Track of the Headstarter AI Hackathon. The project demonstrates skills in AI Engineering and Full Stack Development by building a multi-modal complaint management system for Ruby, a financial technology company. The system leverages AI to analyze and categorize customer complaints, integrates with a relational database, and employs a Retrieval-Augmented Generation (RAG) pipeline with a vector database for advanced complaint retrieval.

## Project Levels

### Level 1
**Task**: Use an LLM API to determine if a call is a complaint and create a summary of the complaint.

**Implementation**:
- Use an LLM API (e.g., OpenAI's GPT-4) to analyze text data.
- Identify if the text is a complaint.
- Generate a summary of the complaint.

### Level 2
**Task**: Assign a product category and a sub-product category similar to the sample data to the new complaint and save it to the database of complaints.

**Implementation**:
- Use the LLM API to categorize the complaint.
- Map the complaint to predefined product and sub-product categories.
- Save the categorized complaint to a relational database.

### Level 3
**Task**: Build a RAG pipeline using a vector database. Given a voice recording, find the most relevant complaints based on what is said in the voice recording.

**Implementation**:
- Convert voice recordings to text using a speech-to-text API.
- Use a vector database (e.g., Pinecone, Faiss) to store and retrieve complaint vectors.
- Implement a RAG pipeline to find the most relevant complaints.

### Level 4
**Task**: Make the inputs multi-modal. Handle voice, text, video, and text+picture inputs to identify and categorize complaints.

**Implementation**:
- Extend the system to handle multiple input modes:
  - **Voice**: Analyze voice recordings.
  - **Text**: Analyze screenshots of social media posts.
  - **Video**: Analyze video content for complaints.
  - **Text + Picture**: Analyze text and accompanying images (e.g., email with a screenshot).

## Technologies Used
- **Programming Language**: TypeScript
- **Frameworks**: Next.js (React), LangChain
- **APIs**: OpenAI GPT-4, AssemblyAI Speech-to-Text API, Google Vision API
- **Databases**: PostgreSQL (Relational Database), Pinecone (Vector Database)

## Getting Started

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Create a copy of the `.env.local.example` file and rename it to `.env.local`. Fill in the environment variables with your Firebase project configuration.
4. Run the development server by running `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Migrations

To generate a new migration, run the following command:

```bash
npm run db:generate
```

To run the migrations, use the following command:

```bash
npm run db:migrate
```

To check the consistency of the migrations, run the following command:

```bash
npm run db:check
```

> For more information, see the [Drizzle Kit documentation](https://orm.drizzle.team/learn/tutorials/drizzle-with-supabase).
