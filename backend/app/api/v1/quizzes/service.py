# from sqlalchemy.orm import Session
# from app.models.quiz import Quiz, QuizQuestion, QuizResult
# from typing import List, Optional, Dict

# def create_quiz(db: Session, course_id: int, title: str, description: str = None,
#                passing_score: float = 70.0, module_id: int = None) -> Quiz:
#     """Create a new quiz"""
#     quiz = Quiz(
#         course_id=course_id,
#         module_id=module_id,
#         title=title,
#         description=description,
#         passing_score=passing_score
#     )
#     db.add(quiz)
#     db.commit()
#     db.refresh(quiz)
#     return quiz

# def add_question_to_quiz(db: Session, quiz_id: int, question_text: str, 
#                         correct_answer: str, question_type: str = "multiple_choice",
#                         options: List[str] = None, points: int = 1, order: int = 0) -> QuizQuestion:
#     """Add a question to a quiz"""
#     question = QuizQuestion(
#         quiz_id=quiz_id,
#         question_text=question_text,
#         question_type=question_type,
#         options=options,
#         correct_answer=correct_answer,
#         points=points,
#         order=order
#     )
#     db.add(question)
#     db.commit()
#     db.refresh(question)
#     return question

# # def get_quiz(db: Session, quiz_id: int) -> Optional[Quiz]:
# #     """Get quiz by ID with questions"""
# #     return db.query(Quiz).filter(Quiz.id == quiz_id).first()

# def get_quiz(db: Session, quiz_id: int):
#     # The .options(joinedload(...)) is the key fix here
#     return db.query(Quiz).options(
#         joinedload(Quiz.questions) 
#     ).filter(Quiz.id == quiz_id).first()


# def get_course_quizzes(db: Session, course_id: int) -> List[Quiz]:
#     """Get all quizzes for a course"""
#     return db.query(Quiz).filter(
#         Quiz.course_id == course_id,
#         Quiz.is_active == True
#     ).all()

# # def submit_quiz(db: Session, user_id: int, quiz_id: int, answers: Dict[int, str]) -> QuizResult:
# #     """Submit quiz and calculate score"""
# #     quiz = get_quiz(db, quiz_id)
# #     if not quiz:
# #         raise ValueError("Quiz not found")
    
# #     total_points = 0
# #     earned_points = 0
    
# #     # Calculate score
# #     for question in quiz.questions:
# #         total_points += question.points
# #         user_answer = answers.get(question.id, "").strip().lower()
# #         correct_answer = question.correct_answer.strip().lower()
        
# #         if user_answer == correct_answer:
# #             earned_points += question.points
    
# #     score = (earned_points / total_points * 100) if total_points > 0 else 0
# #     passed = score >= quiz.passing_score
    
# #     # Store result
# #     result = QuizResult(
# #         user_id=user_id,
# #         quiz_id=quiz_id,
# #         course_id=quiz.course_id,
# #         score=score,
# #         total_points=total_points,
# #         earned_points=earned_points,
# #         passed=passed,
# #         answers=answers
# #     )
# #     db.add(result)
# #     db.commit()
# #     db.refresh(result)
# #     return result


# def submit_quiz(db: Session, user_id: int, quiz_id: int, answers: List) -> QuizResult:
#     quiz = get_quiz(db, quiz_id)
#     if not quiz:
#         raise ValueError("Quiz not found")
    
#     total_points = 0
#     earned_points = 0
    
#     # Create a lookup map that handles both Dicts and Pydantic Objects
#     user_answer_map = {}
#     for item in answers:
#         # This handles item["question_id"] OR item.question_id
#         qid = item.get("question_id") if isinstance(item, dict) else getattr(item, "question_id", None)
#         ans = item.get("answer") if isinstance(item, dict) else getattr(item, "answer", None)
#         if qid is not None:
#             user_answer_map[qid] = ans

#     for question in quiz.questions:
#         total_points += question.points
#         user_raw_answer = user_answer_map.get(question.id)
        
#         if user_raw_answer is not None:
#             # Clean strings for comparison
#             u_ans = str(user_raw_answer).strip().lower()
#             c_ans = str(question.correct_answer).strip().lower()
#             if u_ans == c_ans:
#                 earned_points += question.points

#     score = (earned_points / total_points * 100) if total_points > 0 else 0
#     passed = score >= quiz.passing_score

#     # Ensure your QuizResult model can accept the 'answers' list
#     result = QuizResult(
#         user_id=user_id,
#         quiz_id=quiz_id,
#         course_id=quiz.course_id,
#         score=score,
#         total_points=total_points,
#         earned_points=earned_points,
#         passed=passed,
#         answers=answers 
#     )
#     db.add(result)
#     db.commit()
#     db.refresh(result)
#     return result


# def get_user_quiz_results(db: Session, user_id: int, course_id: int = None) -> List[QuizResult]:
#     """Get all quiz results for a user"""
#     query = db.query(QuizResult).filter(QuizResult.user_id == user_id)
#     if course_id:
#         query = query.filter(QuizResult.course_id == course_id)
#     return query.order_by(QuizResult.taken_at.desc()).all()

# def delete_quiz(db: Session, quiz_id: int) -> bool:
#     """Delete a quiz"""
#     quiz = get_quiz(db, quiz_id)
#     if not quiz:
#         return False
    
#     db.delete(quiz)
#     db.commit()
#     return True

# def update_quiz(db: Session, quiz_id: int, **kwargs) -> Optional[Quiz]:
#     """Update quiz details"""
#     quiz = get_quiz(db, quiz_id)
#     if not quiz:
#         return None
    
#     for key, value in kwargs.items():
#         if value is not None and hasattr(quiz, key):
#             setattr(quiz, key, value)
    
#     db.commit()
#     db.refresh(quiz)
#     return quiz









from sqlalchemy.orm import Session, joinedload  # Added joinedload here
from app.models.quiz import Quiz, QuizQuestion, QuizResult
from typing import List, Optional, Dict, Any

def create_quiz(db: Session, course_id: int, title: str, description: str = None,
                passing_score: float = 70.0, module_id: int = None) -> Quiz:
    """Create a new quiz"""
    quiz = Quiz(
        course_id=course_id,
        module_id=module_id,
        title=title,
        description=description,
        passing_score=passing_score
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz

def add_question_to_quiz(db: Session, quiz_id: int, question_text: str, 
                        correct_answer: str, question_type: str = "multiple_choice",
                        options: List[str] = None, points: int = 1, order: int = 0) -> QuizQuestion:
    """Add a question to a quiz"""
    question = QuizQuestion(
        quiz_id=quiz_id,
        question_text=question_text,
        question_type=question_type,
        options=options,
        correct_answer=correct_answer,
        points=points,
        order=order
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def get_quiz(db: Session, quiz_id: int) -> Optional[Quiz]:
    """Get quiz by ID with questions pre-loaded for the frontend"""
    return db.query(Quiz).options(
        joinedload(Quiz.questions) 
    ).filter(Quiz.id == quiz_id).first()

def get_course_quizzes(db: Session, course_id: int) -> List[Quiz]:
    """Get all quizzes for a course"""
    return db.query(Quiz).filter(
        Quiz.course_id == course_id,
        Quiz.is_active == True
    ).all()

def submit_quiz(db: Session, user_id: int, quiz_id: int, answers: List[Any]) -> QuizResult:
    """Submit quiz and calculate score handling list of objects from frontend/postman"""
    # 1. Load the quiz with questions
    quiz = get_quiz(db, quiz_id)
    if not quiz:
        raise ValueError("Quiz not found")
    
    # 2. Initialize variables at the top to avoid NameError
    total_points = 0
    earned_points = 0
    score = 0.0
    passed = False
    
    # 3. Create lookup map for user answers
    user_answer_map = {}
    serializable_answers = [] # To ensure we save clean data to the DB
    
    for item in answers:
        # Extract data safely whether it's a dict or a Pydantic object
        qid = item.get("question_id") if isinstance(item, dict) else getattr(item, "question_id", None)
        ans = item.get("answer") if isinstance(item, dict) else getattr(item, "answer", None)
        
        if qid is not None:
            user_answer_map[str(qid)] = ans
            # Store a clean version for the database
            serializable_answers.append({"question_id": qid, "answer": ans})

    # 4. Calculate score
    if quiz.questions:
        for question in quiz.questions:
            total_points += question.points
            user_raw_answer = user_answer_map.get(str(question.id))
            
            if user_raw_answer is not None:
                # Clean strings for comparison
                u_ans = str(user_raw_answer).strip().lower()
                c_ans = str(question.correct_answer).strip().lower()
                if u_ans == c_ans:
                    earned_points += question.points

        # Calculate final percentage
        if total_points > 0:
            score = (earned_points / total_points) * 100
            passed = score >= quiz.passing_score

    # 5. Save the result
    result = QuizResult(
        user_id=user_id,
        quiz_id=quiz_id,
        course_id=quiz.course_id,
        score=score,           # Now guaranteed to be defined
        total_points=total_points,
        earned_points=earned_points,
        passed=passed,         # Now guaranteed to be defined
        answers=serializable_answers 
    )
    
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def get_user_quiz_results(db: Session, user_id: int, course_id: int = None) -> List[QuizResult]:
    query = db.query(QuizResult).filter(QuizResult.user_id == user_id)
    if course_id:
        query = query.filter(QuizResult.course_id == course_id)
    return query.order_by(QuizResult.taken_at.desc()).all()

def delete_quiz(db: Session, quiz_id: int) -> bool:
    quiz = get_quiz(db, quiz_id)
    if not quiz:
        return False
    db.delete(quiz)
    db.commit()
    return True

def update_quiz(db: Session, quiz_id: int, **kwargs) -> Optional[Quiz]:
    quiz = get_quiz(db, quiz_id)
    if not quiz:
        return None
    for key, value in kwargs.items():
        if value is not None and hasattr(quiz, key):
            setattr(quiz, key, value)
    db.commit()
    db.refresh(quiz)
    return quiz
