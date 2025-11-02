const Joi = require("joi");

const createQuizSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Quiz title cannot be empty",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(2).required().messages({
          "string.empty": "Question cannot be empty",
          "string.min": "Question must be at least 2 characters",
        }),
        options: Joi.array()
          .length(4)
          .items(Joi.string().required())
          .required()
          .messages({
            "array.length": "Each question must have 4 options",
          }),
        correctIndex: Joi.number().min(0).max(3).required().messages({
          "number.base": "Correct index must be a number between 0-3",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Questions must be an array",
      "any.required": "At least one question is required",
    }),
});

const editQuizSchema = Joi.object({
  quizid: Joi.number().integer().required().messages({
    "number.base": "Quiz ID must be a number",
    "any.required": "Quiz ID is required",
  }),
  questionid: Joi.number().integer().required().messages({
    "number.base": "Question ID must be a number",
    "any.required": "Question ID is required",
  }),
  question: Joi.string().required().messages({
    "string.empty": "Question cannot be empty",
  }),
  options: Joi.array()
    .length(4)
    .items(Joi.string().required())
    .required()
    .messages({
      "array.length": "There must be exactly 4 options",
    }),
  correctIndex: Joi.number().integer().min(0).max(3).required(),
});

const deleteQuizSchema = Joi.object({
  quizid: Joi.number().integer().required().messages({
    "number.base": "Quiz ID must be a number",
    "any.required": "Quiz ID is required",
  }),
  questionid: Joi.number().integer().required().messages({
    "number.base": "Question ID must be a number",
    "any.required": "Question ID is required",
  }),
});

module.exports = { createQuizSchema, editQuizSchema, deleteQuizSchema };
