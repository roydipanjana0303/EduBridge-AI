
import requests
import time


URL = "http://127.0.0.1:8001/llm/chat"

tests = [
    ("AI TEACHER", "Explain DBMS normalization step by step."),
    ("DOUBT SOLVER", "What is a primary key?"),
    ("ADAPTIVE LEARNING", "Explain Python loops like I am a beginner."),
    ("STUDY GUIDE", "Create a 7-day Java study plan."),
    ("PROGRAMMING ASSISTANT", "Explain Python NameError with an example.")
]

history = []

for title, question in tests:

    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)
    print("Question:", question)

    try:
        response = requests.post(
            URL,
            json={
                "message": question,
                "history": []
            },
            timeout=90
        )

        response.raise_for_status()
        data = response.json()

        print("\nEduBridge AI:")
        print(data["answer"])

    except requests.RequestException as error:
        print("\nRequest failed:", error)
time.sleep(5)
print("\nALL TESTS COMPLETED")
