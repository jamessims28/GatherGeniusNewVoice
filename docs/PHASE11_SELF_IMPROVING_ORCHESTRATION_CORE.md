# Phase 11 — GatherGenius Self-Improving Orchestration Core

Built the next phase as background app code.

## Purpose

Phase 11 adds a learning loop on top of the Distributed Ambient Intelligence Fabric.

It does not expose complexity on the landing page. It runs in the background and improves the orchestration system through scoring, reviewable recommendations, strategy tuning, and optimization memory.

## Background modules

- `lib/phase11/outcomeScoringEngine.js`
- `lib/phase11/strategyLearningLoop.js`
- `lib/phase11/agentSelfTuningEngine.js`
- `lib/phase11/continuousOptimizationMemory.js`
- `lib/phase11/selfImprovingOrchestrationCore.js`

## API

- `POST /api/phase11/run`

## Admin route

- `/phase11`

## What it does

1. Runs Phase 10 distributed ambient fabric.
2. Scores the outcome.
3. Finds improvement opportunities.
4. Tunes agent priority in shadow/review mode.
5. Updates optimization memory.
6. Stores the run in Supabase if configured.

## Safety

Self-improvement defaults to review mode:
- `ORCHESTRATION_LEARNING_MODE=shadow`
- `SELF_IMPROVEMENT_REQUIRES_REVIEW=true`

This means recommendations are prepared, but not automatically applied unless explicitly configured.
