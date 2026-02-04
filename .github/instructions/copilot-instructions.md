---
applyTo: '**'
---
# Copilot Repository Guidelines

This document defines the rules and context Copilot must follow when generating or modifying code in this repository.

## Project Context

* The project is a **Next.js** application written in **TypeScript**.
* The application is inspired by **Postman**, but intentionally **leaner and simpler**.
* Core focus: **sending and analyzing API requests** only. Avoid scope creep beyond this goal.

## UI & Design System

* Use **shadcn/ui** for all UI components.
* Use **lucide-react** for icons.
* Do not introduce alternative UI libraries unless explicitly instructed.

## Code Quality Principles

* Prefer **pure functions** whenever possible.
* Write **clean, readable, and testable** code.
* Favor **small, composable units** of logic over large, monolithic implementations.
* Avoid deeply nested or hard-to-follow control flow.

## Architecture & Implementation Guidelines

* Use **kebab-case** for all file and folder names.

* Keep components focused on a **single responsibility**.

* Extract business logic into standalone functions or hooks.

* Avoid side effects in shared logic; isolate them at the edges (e.g., network calls, storage).

* Ensure functions and components are easy to unit test.

## Testing & Reliability

* Use **Jest** for unit and integration testing.
* Always consider **edge cases**.
* Never assume inputs, external responses, or return values are safe or well-formed.
* Validate, guard, and fail gracefully where appropriate.

## General Expectations

* Optimize for **clarity and maintainability** over cleverness.
* Follow idiomatic **TypeScript** and **Next.js** patterns.
* When in doubt, choose the simplest solution that satisfies the requirements.
