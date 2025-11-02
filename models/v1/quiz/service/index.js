const db = require("../../../../config/db");

module.exports.CreateQuiz = async (props) => {
  const { title, questions } = props;

  if (!title || !questions || questions.length === 0) {
    return { status: false, message: "Quiz title and questions are required" };
  }

  try {
    // Check if a quiz with the same title already exists
    const existingQuiz = await db("quizzes").where({ title }).first();
    if (existingQuiz) {
      return { status: false, message: "Quiz with this title already exists" };
    }

    // Insert quiz
    const [quizId] = await db("quizzes").insert({ title });

    // Insert questions
    for (const q of questions) {
      await db("questions").insert({
        quizId,
        question: q.question,
        options: JSON.stringify(q.options),
        correctIndex: q.correctIndex,
      });
    }

    return { status: true, message: "Quiz created successfully", quizId };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ CreateQuiz End ------------------------------------------------------//

module.exports.GetAllQuizzes = async () => {
  try {
    const rows = await db("quizzes")
      .leftJoin("questions", "quizzes.quizid", "questions.quizid")
      .select(
        "quizzes.quizid",
        "quizzes.title",
        "questions.questionid",
        "questions.question",
        "questions.options",
        "questions.correctIndex"
      );

    const quizzesMap = {};

    rows.forEach((row) => {
      if (!quizzesMap[row.quizid]) {
        quizzesMap[row.quizid] = {
          quizid: row.quizid,
          title: row.title,
          questions: [],
        };
      }

      if (row.questionid) {
        quizzesMap[row.quizid].questions.push({
          questionid: row.questionid,
          question: row.question,
          options: row.options, // already a JSON array
          correctIndex: row.correctIndex,
        });
      }
    });

    const quizzes = Object.values(quizzesMap);
    return { status: true, quizzes };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ GetQuiz End ------------------------------------------------------//

module.exports.EditQuestion = async (props) => {
  const { quizid, questionid, question, options, correctIndex } = props;

  if (!quizid || !questionid || !question || !options || options.length !== 4) {
    return { status: false, message: "All fields are required" };
  }

  try {
    const qExists = await db("questions").where({ questionid, quizid }).first();
    if (!qExists) return { status: false, message: "Question not found" };

    await db("questions")
      .where({ questionid, quizid })
      .update({
        question,
        options: JSON.stringify(options),
        correctIndex,
      });

    return { status: true, message: "Question updated successfully" };
  } catch (err) {
    console.error("Service Error:", err);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ EditQuiz End ------------------------------------------------------//

module.exports.DeleteQuestion = async (props) => {
  const { quizid, questionid } = props;

  if (!quizid) return { status: false, message: "Quiz ID is required" };
  if (!questionid) return { status: false, message: "Question ID is required" };

  try {
    // Check if quiz exists
    const quizExists = await db("quizzes").where({ quizid }).first();
    if (!quizExists) return { status: false, message: "Quiz not found" };

    // Check if question exists
    const questionExists = await db("questions")
      .where({ questionid, quizid })
      .first();
    if (!questionExists)
      return { status: false, message: "Question not found" };

    // Delete only the specific question
    await db("questions").where({ questionid }).del();

    return { status: true, message: "Question deleted successfully" };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ DeleteQuiz End ------------------------------------------------------//

module.exports.SubmitQuiz = async (props) => {
  const { userid, quizid, answers } = props;

  try {
    // Get the quiz questions
    const rows = await db("questions").where("quizid", quizid);
    if (rows.length === 0) {
      return { status: false, message: "Quiz not found" };
    }

    let score = 0;
    const resultPerQuestion = {};
    const validQuestionIds = new Set(rows.map((q) => q.questionid));

    // Process each DB question
    rows.forEach((q) => {
      const selected =
        answers[q.questionid] !== undefined ? answers[q.questionid] : null;

      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;

      resultPerQuestion[q.questionid] = {
        question: q.question,
        correctIndex: q.correctIndex,
        selectedIndex: selected,
        isCorrect,
      };
    });

    // Optional: Detect invalid submitted question IDs
    const invalidIds = Object.keys(answers).filter(
      (id) => !validQuestionIds.has(parseInt(id))
    );
    if (invalidIds.length > 0) {
      console.warn(
        `Invalid question IDs submitted: ${invalidIds.join(
          ", "
        )} for quiz ${quizid}`
      );
    }

    // Save attempt
    await db("quiz_attempts").insert({
      userid,
      quizid,
      answers: JSON.stringify(resultPerQuestion), // ← MUST stringify
      score,
      // created_at is auto-filled
    });

    return { status: true, score, resultPerQuestion };
  } catch (error) {
    console.error("SubmitQuiz Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ SubmitQuiz End ------------------------------------------------------//

module.exports.GetGeneralLeaderboard = async () => {
  try {
    // Aggregate scores by user across all quizzes
    const leaderboard = await db("quiz_attempts as qa")
      .join("users as u", "qa.userid", "u.userid")
      .select("qa.userid", "u.fullname")
      .sum("qa.score as totalScore")
      .groupBy("qa.userid", "u.fullname")
      .orderBy("totalScore", "desc");

    return { status: true, leaderboard };
  } catch (error) {
    console.error("GetGeneralLeaderboard Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ GetLeaderboard End ------------------------------------------------------//

module.exports.GetMyResults = async (props) => {
  const { userid } = props;

  try {
    const attempts = await db("quiz_attempts")
      .where("userid", userid)
      .orderBy("created_at", "desc")
      .select("attemptid", "quizid", "score", "answers", "created_at");

    if (!attempts.length) {
      return { status: true, results: [] };
    }

    const quizIds = [...new Set(attempts.map((a) => a.quizid))];
    const quizMap = await db("quizzes")
      .whereIn("quizid", quizIds)
      .select("quizid", "title")
      .then((rows) => Object.fromEntries(rows.map((r) => [r.quizid, r.title])));

    const latestAttempts = Object.values(
      attempts.reduce((acc, attempt) => {
        acc[attempt.quizid] = attempt; // keep latest per quiz
        return acc;
      }, {})
    );

    const results = latestAttempts
      .map((attempt) => {
        let parsed = attempt.answers;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            console.warn(
              `Invalid JSON in attempt for quiz ${attempt.quizid}:`,
              attempt.answers
            );
            return null;
          }
        }

        const total = Object.keys(parsed).length || 1;

        // Prepare per-question details
        const questions = Object.entries(parsed).map(([qid, q]) => ({
          questionId: qid,
          question: q.question,
          selectedIndex: q.selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect: q.isCorrect,
        }));

        return {
          attemptId: attempt.attemptid,
          quizId: attempt.quizid,
          quizTitle: quizMap[attempt.quizid] || `Quiz ${attempt.quizid}`,
          score: attempt.score,
          total,
          percentage: ((attempt.score / total) * 100).toFixed(1),
          date: attempt.created_at,
          questions,
        };
      })
      .filter(Boolean);

    return { status: true, results };
  } catch (error) {
    console.error("GetMyResults Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ GetMyResults End ------------------------------------------------------//
