"use client";
import MovementCheckingModePage from "../movement-check/page";
import { useState } from "react";
import QuizPage from "../quiz/page";

// chắc đây sẽ là file chưa logic để tính score
const LearningModePage = () => {
    const [isMovementCheck] = useState(true);

    return (
        <main>
            {isMovementCheck ? <MovementCheckingModePage /> : <QuizPage />}
        </main>
    );
}

export default function Page() {
    return (
        <div>
            <LearningModePage />
        </div>
    );
}


