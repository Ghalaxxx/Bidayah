# ADR-0001: Journey-First Architecture

Date: 2026-10-03

## Status

Accepted.

## Context

Bidayah helps zero-knowledge beginners perform a first prayer or first fast. The product has religious safety constraints: it must not invent claims, transfer practices between contexts, or encourage phone use during the actual prayer.

The current app works as a local MVP, but most logic is inside `src/App.tsx`. The next phase needs backend/RAG/LLM architecture without letting the LLM become the product authority.

## Decision

Bidayah will use a journey-first architecture:

- The Journey Engine owns sequence, mode behavior, prerequisites, and state transitions.
- The Knowledge Base owns approved atomic content and source provenance.
- Retrieval finds approved content for the current user question and journey context.
- The Answer Service explains retrieved content in beginner language.
- The Safety Gate can block, escalate, or mark `NEEDS_REVIEW`.
- The frontend is a client of these services and does not implement religious logic.

## Consequences

Positive:

- Safer than a generic chatbot.
- Easier to test and review.
- Future frontend can be redesigned without rewriting religious logic.
- The product can show source-backed confidence.

Tradeoffs:

- Slower than dropping in an LLM SDK.
- Requires content modeling and review workflows.
- Requires an evaluation harness before broad answers are allowed.

## Hard Rule

If an answer requires a religious claim not supported by the approved source set, the system must not answer as verified. It must refuse, escalate, or mark `NEEDS_REVIEW`.
