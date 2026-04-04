
interface Question {
    question: string;
    options: string[];
    correct: number;
}

interface Section {
    title: string;
    questions: Question[];
}

const quizData: Section[] = [
    {
        title: "The Coachman’s Vigil",
        questions: [
            {
                question: "Why does Ali come to the post office every day?",
                options: ["To meet people", "To receive a letter from Miriam", "To send letters", "To work"],
                correct: 1
            },
            {
                question: "How do the townspeople perceive Ali?",
                options: ["As a respected elder", "As a madman", "As a teacher", "As a worker"],
                correct: 1
            },
            {
                question: "What does Ali consider more important than the letter itself?",
                options: ["The post office", "The people", "The act of waiting and love behind it", "His routine"],
                correct: 2
            },
            {
                question: "What does the line “Hope lives in the act of reaching” mean?",
                options: ["Hope depends on results", "Hope exists only when fulfilled", "Hope exists in effort, not outcome", "Hope is temporary"],
                correct: 2
            },
            {
                question: "What does Ali’s daily visit symbolize?",
                options: ["Habit", "Madness", "Devotion and unconditional love", "Loneliness"],
                correct: 2
            }
        ]
    },
    {
        title: "The Young Bride & the Dhobi",
        questions: [
            {
                question: "What does Angoori wonder about love?",
                options: ["If it is real", "If it is forced", "Whether it is planted unknowingly like a spell", "If it is permanent"],
                correct: 2
            },
            {
                question: "What contrast is shown between Angoori and Prabhati?",
                options: ["Wealth difference", "Youth vs age", "Intelligence", "Strength"],
                correct: 1
            },
            {
                question: "How is Namu described?",
                options: ["Hardworking and strict", "Angry", "Philosophical and detached from chaos", "Ambitious"],
                correct: 2
            },
            {
                question: "What is Namu’s view on people’s complaints?",
                options: ["They matter deeply", "They must be solved", "They are temporary like dust", "They are dangerous"],
                correct: 2
            },
            {
                question: "What kind of love does Angoori eventually understand?",
                options: ["Magical love", "Forced love", "Love growing through shared life and silence", "Passionate love"],
                correct: 2
            }
        ]
    },
    {
        title: "The Girl in London",
        questions: [
            {
                question: "Why does Maggie work as a typist?",
                options: ["For fun", "To support her widowed mother", "To travel", "To study"],
                correct: 1
            },
            {
                question: "What does Maggie spend her extra money on?",
                options: ["Clothes", "Food", "Flowers for her brother’s grave", "Books"],
                correct: 2
            },
            {
                question: "What does India represent to Maggie?",
                options: ["A country", "A dream", "The place where her brother might be or be lost", "A job opportunity"],
                correct: 2
            },
            {
                question: "What does Maggie’s question to the stranger reveal?",
                options: ["Curiosity", "Fear and emotional pain about her brother", "Anger", "Confusion"],
                correct: 1
            },
            {
                question: "What does Maggie’s character symbolize?",
                options: ["Wealth", "Innocence", "Hope and quiet resilience in suffering", "Adventure"],
                correct: 2
            }
        ]
    },
    {
        title: "The Convergence",
        questions: [
            {
                question: "What connects all four characters?",
                options: ["Location", "Language", "Shared human emotions and struggles", "Family"],
                correct: 2
            },
            {
                question: "What realization does Ali have?",
                options: ["He should stop waiting", "The letter matters most", "Waiting itself is meaningful", "People are wrong"],
                correct: 2
            },
            {
                question: "What change occurs in Angoori?",
                options: ["She becomes sad", "She leaves", "She develops tenderness for Prabhati", "She becomes angry"],
                correct: 2
            },
            {
                question: "What does Namu feel while walking at night?",
                options: ["Stress", "Happiness", "Peace and acceptance of life’s cycle", "Fear"],
                correct: 2
            },
            {
                question: "What is the main idea of this section?",
                options: ["Life is unfair", "People are alone", "Different lives share a common emotional thread", "Time changes everything"],
                correct: 2
            }
        ]
    },
    {
        title: "The Last Night",
        questions: [
            {
                question: "What does Maggie do that is unexpected?",
                options: ["Leaves her job", "Buys two bouquets", "Meets her brother", "Travels"],
                correct: 1
            },
            {
                question: "What does the white rose represent?",
                options: ["Wealth", "Loss", "Love and hope despite uncertainty", "Beauty"],
                correct: 2
            },
            {
                question: "What message does the story give about hope?",
                options: ["It needs good news", "It disappears quickly", "It exists even in silence and uncertainty", "It is rare"],
                correct: 2
            },
            {
                question: "What do all four characters prove?",
                options: ["Life is difficult", "People are different", "Human hearts are universally connected", "Love is weak"],
                correct: 2
            },
            {
                question: "What is the final message of the story?",
                options: ["People travel alone", "Life ends in darkness", "No one truly travels alone", "Hope fades"],
                correct: 2
            }
        ]
    }
];

export const setupQuiz = () => {
    let currentOverallIndex = 0;
    let userAnswers: (number | null)[] = new Array(25).fill(null);
    let submittedAnswers: boolean[] = new Array(25).fill(false);
    
    const flattenedQuestions = quizData.flatMap(section => section.questions);
    const totalQuestions = flattenedQuestions.length;

    const startScreen = document.getElementById('quiz-start-screen');
    const playScreen = document.getElementById('quiz-play-screen');
    const resultScreen = document.getElementById('quiz-result-screen');
    
    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const exitBtn = document.getElementById('exit-quiz-btn');
    const prevBtn = document.getElementById('prev-question-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-question-btn') as HTMLButtonElement;
    const skipBtn = document.getElementById('skip-question-btn') as HTMLButtonElement;
    const submitBtn = document.getElementById('submit-answer-btn') as HTMLButtonElement;
    const homeBtn = document.getElementById('home-quiz-btn') as HTMLButtonElement;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const sectionTitleText = document.getElementById('section-title');
    const questionCountText = document.getElementById('question-count');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const sectionProgressText = document.getElementById('section-progress');
    const finalScore = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');

    const showScreen = (screen: HTMLElement | null) => {
        [startScreen, playScreen, resultScreen].forEach(s => s?.classList.remove('active'));
        screen?.classList.add('active');
    };

    const getSectionInfo = (index: number) => {
        let count = 0;
        for (let i = 0; i < quizData.length; i++) {
            if (index < count + quizData[i].questions.length) {
                return { title: quizData[i].title, sectionIndex: i + 1 };
            }
            count += quizData[i].questions.length;
        }
        return { title: "", sectionIndex: 0 };
    };

    const updateUI = () => {
        const question = flattenedQuestions[currentOverallIndex];
        const sectionInfo = getSectionInfo(currentOverallIndex);

        if (sectionTitleText) sectionTitleText.textContent = sectionInfo.title;
        if (questionCountText) questionCountText.textContent = `Question ${currentOverallIndex + 1} of ${totalQuestions}`;
        if (sectionProgressText) sectionProgressText.textContent = `Section ${sectionInfo.sectionIndex}/5`;
        if (progressBarFill) progressBarFill.style.width = `${((currentOverallIndex + 1) / totalQuestions) * 100}%`;
        if (questionText) questionText.textContent = question.question;

        // Update buttons
        prevBtn.disabled = currentOverallIndex === 0;
        nextBtn.disabled = currentOverallIndex === totalQuestions - 1;
        
        const isSubmitted = submittedAnswers[currentOverallIndex];
        submitBtn.disabled = isSubmitted || userAnswers[currentOverallIndex] === null;
        skipBtn.style.display = isSubmitted ? 'none' : 'block';

        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option';
                button.textContent = option;
                
                if (userAnswers[currentOverallIndex] === index) {
                    button.classList.add('selected');
                }

                if (isSubmitted) {
                    button.style.pointerEvents = 'none';
                    if (index === question.correct) {
                        button.classList.add('correct');
                    } else if (userAnswers[currentOverallIndex] === index) {
                        button.classList.add('wrong');
                    }
                }

                button.onclick = () => {
                    if (!isSubmitted) {
                        selectOption(index);
                    }
                };
                optionsContainer.appendChild(button);
            });
        }
    };

    const selectOption = (index: number) => {
        userAnswers[currentOverallIndex] = index;
        updateUI();
    };

    const handleNext = () => {
        if (currentOverallIndex < totalQuestions - 1) {
            currentOverallIndex++;
            updateUI();
        } else if (submittedAnswers.every(s => s) || submittedAnswers.filter((s, i) => s || userAnswers[i] === null).length === totalQuestions) {
            // If all are submitted or skipped, show results
             showResults();
        }
    };

    const handlePrev = () => {
        if (currentOverallIndex > 0) {
            currentOverallIndex--;
            updateUI();
        }
    };

    const handleSkip = () => {
        userAnswers[currentOverallIndex] = null;
        submittedAnswers[currentOverallIndex] = false;
        if (currentOverallIndex < totalQuestions - 1) {
            currentOverallIndex++;
            updateUI();
        } else {
            showResults();
        }
    };

    const handleSubmit = () => {
        if (userAnswers[currentOverallIndex] !== null) {
            submittedAnswers[currentOverallIndex] = true;
            updateUI();
            
            // Auto move to next after a short delay
            setTimeout(() => {
                if (currentOverallIndex < totalQuestions - 1) {
                    currentOverallIndex++;
                    updateUI();
                } else {
                    showResults();
                }
            }, 1000);
        }
    };

    const showResults = () => {
        let score = 0;
        flattenedQuestions.forEach((q, i) => {
            if (submittedAnswers[i] && userAnswers[i] === q.correct) {
                score++;
            }
        });

        showScreen(resultScreen);
        if (finalScore) finalScore.textContent = score.toString();
        
        let message = "";
        if (score >= 20) {
            message = "You truly understood the heart of the story.";
        } else if (score >= 12) {
            message = "You felt the story, but there is more beneath.";
        } else {
            message = "The journey is not over. Revisit the story.";
        }
        if (resultMessage) resultMessage.textContent = message;
    };

    const resetQuiz = () => {
        currentOverallIndex = 0;
        userAnswers = new Array(25).fill(null);
        submittedAnswers = new Array(25).fill(false);
        showScreen(playScreen);
        updateUI();
    };

    startBtn?.addEventListener('click', () => {
        showScreen(playScreen);
        updateUI();
    });

    restartBtn?.addEventListener('click', resetQuiz);
    exitBtn?.addEventListener('click', () => showScreen(startScreen));
    prevBtn?.addEventListener('click', handlePrev);
    nextBtn?.addEventListener('click', handleNext);
    skipBtn?.addEventListener('click', handleSkip);
    submitBtn?.addEventListener('click', handleSubmit);
    homeBtn?.addEventListener('click', () => showScreen(startScreen));

    // Nav bar button smooth scroll
    const navQuizBtn = document.getElementById('nav-quiz-btn');
    navQuizBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const quizSection = document.getElementById('quiz-experience');
        quizSection?.scrollIntoView({ behavior: 'smooth' });
    });
};
