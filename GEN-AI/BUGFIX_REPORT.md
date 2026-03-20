# Bug Fix Report: Interview Report API — Empty Arrays & Model Migration

**Date:** 2026-03-18  
**Project:** GEN-AI Backend  
**Author:** Antigravity AI Assistant  
**Status:** ✅ Resolved

---

## Overview

The `/api/interview` POST endpoint was reading the PDF resume file, calling the Gemini AI model, and logging a valid-looking response to the console — but when tested in Postman, the response returned empty arrays for `technicalQuestions`, `behavioralQuestions`, `skillGaps`, and `preparationTips`.

---

## Bug #1 — Invalid Zod Schema Generation (Root Cause of Empty Arrays)

### File: `src/services/ai.service.js`

#### Problem

The code was using the `zod` library to define the AI response schema, then converting it with `zod-to-json-schema` before passing it to the Gemini SDK:

```js
const { zodToJsonSchema } = require("zod-to-json-schema")

// ...
config: {
    responseMimeType: "application/json",
    responseSchema: zodToJsonSchema(interviewReportSchema)
}
```

**The issue:** `zod-to-json-schema` generates [JSON Schema Draft-07](https://json-schema.org/specification-links.html#draft-7) format, which looks like this:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

The **Gemini SDK requires a plain OpenAPI 3.0-style schema object** (no `$schema` header, no Draft-07 keywords). Since Gemini could not interpret the schema, it **completely ignored it** and generated its own arbitrary JSON structure — resulting in arrays of primitive strings (`["question"]`) instead of arrays of objects (`[{ "question": "...", "intention": "...", "answer": "..." }]`).

#### Fix

Removed `zod` and `zod-to-json-schema` entirely. Replaced with a **plain JavaScript object** matching Gemini's native schema format:

```js
const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number" },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill:    { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        preparationTips: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day:   { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationTips"]
}
```

This schema is passed directly to the Gemini `generateContent` call and is correctly understood by the SDK, enforcing proper nested object generation.

---

## Bug #2 — Typo in Zod Schema Property (`z.describe` instead of `z.string().describe`)

### File: `src/services/ai.service.js`

#### Problem

One field in the Zod schema was defined incorrectly:

```js
// WRONG — z.describe is a top-level function that produces no type
answer: z.describe("how the candidate should ideally answer...")
```

This caused the `answer` field inside `technicalQuestions` to have no type constraint, making the JSON schema invalid for that property. This was a secondary contributor to the empty/malformed output.

#### Fix

Changed to:

```js
// CORRECT
answer: z.string().describe("how the candidate should ideally answer...")
```

> **Note:** This fix was later superseded by Bug #1's fix (removing Zod entirely in favour of a plain schema), but it is documented here for completeness.

---

## Bug #3 — Incorrect PDF Text Extraction

### File: `src/controllers/interview.controller.js`

#### Problem

The original code used `pdf-parse` to extract resume text, but then incorrectly accessed `.text` on the result of `await resumeContent.text` which was already a plain string:

```js
// ORIGINAL — called getParse wrongly and accessed .text on a string
const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
resume: await resumeContent.text  // ← .text on a plain string = undefined
```

This meant **the resume passed to Gemini was `undefined`**, which is why Gemini could not find meaningful content to analyse.

Additionally, the imported `pdfParse` was treated as a callable function (`pdfParse(req.file.buffer)`), but the installed version of the library exports an object (not a default function), so calling `pdfParse()` directly threw: **`TypeError: pdfParse is not a function`**.

#### Fix

The controller now:
1. Uses `new pdfParse.PDFParse(...)` correctly (matching the library's export structure)
2. Defensively handles the return value (may be a string or an object with `.text`)

```js
const rawResult = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
const resumeText = typeof rawResult === "string" ? rawResult : rawResult.text;
```

---

## Bug #4 — Model Quota Exhausted / Wrong Model Name

### File: `src/services/ai.service.js`

#### Problem

The original code referenced `"gemini-3-flash-preview"` which **does not exist** as a valid public model identifier. It was changed at various points to `"gemini-2.0-flash"`, but the API key's free quota for that model became exhausted during testing.

#### Model Testing Process

We queried the Gemini API to list all 45 available models, then tested each one:

| Model | Result |
|---|---|
| `gemini-3-flash-preview` | ❌ NOT FOUND (invalid model name) |
| `gemini-2.0-flash` | ❌ 429 — quota exhausted |
| `gemini-2.0-flash-lite` | ❌ 429 — quota exhausted |
| `gemini-1.5-flash` | ❌ NOT FOUND |
| `gemini-1.5-pro` | ❌ NOT FOUND |
| `gemini-2.5-flash-preview-*` | ❌ NOT FOUND |
| **`gemini-2.5-flash`** | ✅ **Working — selected** |

#### Fix

Updated the model name in `ai.service.js`:

```js
// BEFORE
model: "gemini-3-flash-preview"

// AFTER
model: "gemini-2.5-flash"
```

#### Validation

After switching to `gemini-2.5-flash`, a full schema test was run programmatically:

```
matchScore:          ✅ (number)
technicalQuestions:  ✅ 3 items | keys: ['question', 'intention', 'answer']
behavioralQuestions: ✅ 2 items
skillGaps:           ✅ 2 items
preparationTips:     ✅ 3 items
```

---

## Summary of All Changes

| File | Change |
|---|---|
| `src/services/ai.service.js` | Removed `zod` + `zod-to-json-schema`; replaced with plain Gemini-compatible JSON schema; fixed model name to `gemini-2.5-flash` |
| `src/controllers/interview.controller.js` | Fixed `pdf-parse` invocation to use `new pdfParse.PDFParse()`; fixed resume text extraction to properly read string output; added try/catch error handling |

---

## Final API Behaviour (Verified in Postman)

**Request:**
- `POST /api/interview`
- `Content-Type: multipart/form-data`
- Fields: `resume` (PDF file), `jobDescription` (string), `selfDescription` (string)
- Auth: Bearer token (JWT)

**Response:**
```json
{
  "message": "Interview report generated successfully",
  "interviewReport": {
    "matchScore": 82,
    "technicalQuestions": [
      { "question": "...", "intention": "...", "answer": "..." },
      ...
    ],
    "behavioralQuestions": [...],
    "skillGaps": [...],
    "preparationTips": [...]
  }
}
```

✅ All arrays are now correctly populated with structured objects, and the report is saved to MongoDB.
