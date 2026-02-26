# from sqlalchemy.orm import Session
# from app.models.chat_history import ChatHistory
# from typing import List

import os
from sqlalchemy.orm import Session
from app.models.chat_history import ChatHistory
from typing import List
from huggingface_hub import InferenceClient # Make sure this is imported
from app.core.config import settings # Use your settings object

# Initialize the client using the key from your central config
client = InferenceClient(api_key=settings.HF_API_KEY)

def save_chat(db: Session, user_id: int, question: str, answer: str, 
             course_id: int = None, context: str = "general") -> ChatHistory:
    """Save chat interaction to the database"""
    chat = ChatHistory(
        user_id=user_id,
        course_id=course_id,
        question=question,
        answer=answer,
        context=context
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

# ... get_user_chat_history and get_course_chat_history stay the same ...

def generate_ai_response(question: str, context: str = "general") -> str:
    """Generate AI response using Hugging Face Inference API"""
    
    system_prompts = {
        "general": "You are a helpful coding assistant. Provide concise and accurate programming help.",
        "course-specific": "You are a teaching assistant. Help the student understand the code concepts in their course.",
        "quiz-help": "Provide hints for the quiz without giving away the direct answer immediately unless asked."
    }
    
    system_message = system_prompts.get(context, system_prompts["general"])

    try:
        response = client.chat.completions.create(
            model="Qwen/Qwen2.5-Coder-32B-Instruct", 
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": question}
            ],
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to AI service: {str(e)}"




        # def generate_ai_response(question: str, context: str = "general") -> str:
#     """Generate AI response (placeholder - integrate with actual AI service)"""
#     # TODO: Integrate with OpenAI, Claude, or custom LLM
#     responses = {
#         "general": "I'm here to help you with your coding journey! This is a placeholder response. In production, this would connect to an AI service.",
#         "course-specific": "This course covers important programming concepts. Please refer to the course modules for detailed information.",
#         "quiz-help": "Take your time with the quiz. Review the course materials if needed. You can retake quizzes to improve your score."
#     }
#     return responses.get(context, "I'm here to help! Ask me anything about your learning journey.")